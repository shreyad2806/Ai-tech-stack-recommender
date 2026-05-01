import os
import time
import json
import asyncio
import logging
import traceback
import re

from typing import Any
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from pydantic import BaseModel, EmailStr, validator

from sqlalchemy.orm import Session

from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

# ------------------ ENV ------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("backend")

# ------------------ DATABASE ------------------
from database import get_db, init_db
from models import Stack, User, StackShare

# ------------------ GEMINI ------------------
try:
    import google.generativeai as genai
except:
    genai = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

model: Any = None

if genai and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL)
        log.info("✅ Gemini ready")
    except Exception as e:
        log.error("Gemini error: %s", e)

# ------------------ APP ------------------
app = FastAPI()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://stackmind-xi.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ STARTUP ------------------
@app.on_event("startup")
def startup():
    print("🚀 Backend starting...")
    try:
        init_db()
        print("✅ DB initialized")
    except Exception as e:
        print("❌ DB error:", e)

# ------------------ TOKEN ------------------
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ------------------ PASSWORD ------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------ MODELS ------------------
class IdeaRequest(BaseModel):
    idea: str

class UserAuth(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def validate_password(cls, v):
        if len(v.strip()) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

# ------------------ ROOT ------------------
@app.get("/")
def root():
    return {"status": "running"}

# ------------------ HEALTH ------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# ------------------ RECOMMEND ------------------
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    try:
        idea = req.idea.strip()

        if not idea:
            raise HTTPException(400, "Idea required")

        if not model:
            return {"architecture": "Gemini not configured"}

        prompt = f"""
        Give tech stack for: {idea}
        Return JSON with:
        architecture, core_technologies, deployment, roadmap
        """

        resp = model.generate_content(prompt)
        raw = resp.text if hasattr(resp, "text") else str(resp)

        try:
            match = re.search(r"\{.*\}", raw, re.DOTALL)
            parsed = json.loads(match.group(0)) if match else {}
        except:
            parsed = {}

        return {
            "architecture": parsed.get("architecture", raw[:300]),
            "core_technologies": parsed.get("core_technologies", []),
            "deployment": parsed.get("deployment", ""),
            "roadmap": parsed.get("roadmap", [])
        }

    except Exception as e:
        print("Recommend error:", e)
        raise HTTPException(500, str(e))

# ------------------ STREAM ------------------
@app.post("/recommend-stream")
async def recommend_stream(data: IdeaRequest):
    async def generator():
        try:
            resp = model.generate_content(data.idea)
            text = resp.text

            for chunk in text.split():
                yield chunk + " "
                await asyncio.sleep(0.02)

        except Exception as e:
            yield f"ERROR: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")

# ------------------ SAVE ------------------
@app.post("/save-stack")
def save_stack(data: dict, db: Session = Depends(get_db)):
    stack = Stack(**data)
    db.add(stack)
    db.commit()
    db.refresh(stack)
    return {"id": stack.id}

# ------------------ GET STACKS ------------------
@app.get("/stacks")
def get_stacks(db: Session = Depends(get_db)):
    return db.query(Stack).all()

# ------------------ SIGNUP ------------------
@app.post("/auth/signup")
def signup(auth: UserAuth, db: Session = Depends(get_db)):
    try:
        email = auth.email.strip().lower()
        password = auth.password.strip()

        # 🔥 IMPORTANT
        password = password[:72]

        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(400, "User already exists")

        hashed = pwd_context.hash(password)

        user = User(email=email, password=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_token({"sub": user.email})

        return {
            "success": True,
            "token": token,
            "user": {"id": user.id, "email": user.email}
        }

    except Exception as e:
        print("Signup error:", e)
        raise HTTPException(500, str(e))

# ------------------ LOGIN ------------------
@app.post("/auth/login")
def login(auth: UserAuth, db: Session = Depends(get_db)):
    try:
        email = auth.email.strip().lower()
        password = auth.password.strip()[:72]

        user = db.query(User).filter(User.email == email).first()

        if not user or not pwd_context.verify(password, user.password):
            raise HTTPException(401, "Invalid email or password")

        token = create_token({"sub": user.email})

        return {
            "success": True,
            "token": token,
            "user": {"id": user.id, "email": user.email}
        }

    except Exception as e:
        print("Login error:", e)
        raise HTTPException(500, str(e))

# ------------------ SHARE ------------------
@app.post("/share")
def share_stack(data: dict, db: Session = Depends(get_db)):
    share = StackShare(data=data)
    db.add(share)
    db.commit()
    db.refresh(share)
    return {"id": share.id}

@app.get("/share/{id}")
def get_share(id: str, db: Session = Depends(get_db)):
    share = db.query(StackShare).filter(StackShare.id == id).first()
    if not share:
        raise HTTPException(404, "Not found")
    return share
        