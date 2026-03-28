import os
import json
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from sqlalchemy.orm import Session

import google.genai as genai
from database import engine, SessionLocal
from models import Base, User  # ✅ ONLY DB MODEL

# ---------------- LOAD ENV ----------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file")

# ---------------- CONFIGURE GEMINI ----------------
client = genai.Client(api_key=GEMINI_API_KEY)
model_name = "gemini-2.5-flash"

# ---------------- FASTAPI APP ----------------
app = FastAPI(title="AI Tech Stack Recommender")

# ---------------- INIT DATABASE ----------------
Base.metadata.create_all(bind=engine)

# ---------------- DATABASE DEPENDENCY ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- AUTH CONFIG ----------------
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- REQUEST MODELS ----------------
class ProjectInput(BaseModel):
    description: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ---------------- AUTH ENDPOINTS ----------------

# ✅ SIGNUP FIXED
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    new_user = User(email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


# ✅ LOGIN FIXED
@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": db_user.email
        }
    }

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"status": "Backend running with Gemini + PostgreSQL"}

# ---------------- PROMPT ----------------
def build_prompt(project_description: str) -> str:
    return f"""
You are a senior software architect.

Analyze the project idea below and respond ONLY in valid JSON.

{{
  "tech_stack": {{
    "frontend": [],
    "backend": [],
    "ai_ml": [],
    "database": []
  }},
  "architecture": "",
  "mvp_roadmap": [],
  "deployment": {{
    "backend": "",
    "frontend": "",
    "ci_cd": ""
  }}
}}

Project Idea:
{project_description}
"""

# ---------------- AI ENDPOINT ----------------
@app.post("/recommend")
def recommend_stack(data: ProjectInput):
    try:
        prompt = build_prompt(data.description)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        structured_output = json.loads(response.text.strip())

        return {
            "project_description": data.description,
            "result": structured_output
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
