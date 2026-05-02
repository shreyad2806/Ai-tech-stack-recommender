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

# ------------------ HEALTH ------------------
@app.get("/")
def root():
    return {"status": "running", "service": "StackMind Backend"}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": time.time()}

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
MAX_BCRYPT_BYTES = 72

def safe_password(password: str) -> str:
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

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

# ------------------ RECOMMEND ------------------
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    try:
        idea = req.idea.strip()

        if not idea:
            raise HTTPException(400, "Idea required")

        if not model:
            return {
                "success": False,
                "error": "AI model not configured"
            }

        prompt = f"""You are an expert system architect. Given this idea: {idea}

Return ONLY valid JSON in this exact format. No text, no markdown, no explanation:

{{
  "idea": "{idea}",
  "architecture": {{
    "description": "Detailed system architecture description",
    "layers": [
      {{
        "name": "Layer Name",
        "components": ["Component 1", "Component 2"]
      }}
    ]
  }},
  "tech_stack": {{
    "frontend": ["React", "TypeScript", "Tailwind"],
    "backend": ["FastAPI", "Python", "PostgreSQL"],
    "database": ["PostgreSQL", "Redis"],
    "ai_ml": ["OpenAI API", "LangChain"],
    "devops": ["Docker", "AWS", "GitHub Actions"]
  }},
  "deployment": "Deployment strategy and platform details",
  "roadmap": [
    "Step 1: Setup foundation",
    "Step 2: Build core features",
    "Step 3: Deploy and scale"
  ]
}}

IMPORTANT: Return ONLY the JSON object. No ```json``` wrapper, no explanation."""

        # Generate AI response
        resp = model.generate_content(prompt)
        raw = resp.text if hasattr(resp, "text") else str(resp)
        
        print("AI RAW RESPONSE:", raw)

        # Clean AI response safely
        parsed = {}
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{.*\}', raw, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                parsed = json.loads(json_str)
                print("PARSED JSON:", parsed)
            else:
                # If no JSON found, create fallback response
                parsed = {
                    "idea": idea,
                    "architecture": {
                        "description": f"Architecture for {idea}",
                        "layers": [
                            {"name": "Frontend", "components": ["React", "TypeScript"]},
                            {"name": "Backend", "components": ["FastAPI", "Python"]},
                            {"name": "Database", "components": ["PostgreSQL"]},
                            {"name": "AI/ML", "components": ["OpenAI API"]}
                        ]
                    },
                    "tech_stack": {
                        "frontend": ["React", "TypeScript", "Tailwind"],
                        "backend": ["FastAPI", "Python"],
                        "database": ["PostgreSQL", "Redis"],
                        "ai_ml": ["OpenAI API", "LangChain"],
                        "devops": ["Docker", "AWS", "GitHub Actions"]
                    },
                    "deployment": "Deploy on Vercel (frontend) and AWS (backend)",
                    "roadmap": [
                        "Step 1: Setup development environment",
                        "Step 2: Build core features",
                        "Step 3: Add authentication",
                        "Step 4: Deploy and scale"
                    ]
                }
        except Exception as e:
            print(f"JSON parsing error: {e}")
            # Fallback response on parsing error
            parsed = {
                "idea": idea,
                "architecture": {
                    "description": f"Architecture for {idea}",
                    "layers": [
                        {"name": "Frontend", "components": ["React"]},
                        {"name": "Backend", "components": ["FastAPI"]},
                        {"name": "Database", "components": ["PostgreSQL"]}
                    ]
                },
                "tech_stack": {
                    "frontend": ["React"],
                    "backend": ["FastAPI"],
                    "database": ["PostgreSQL"],
                    "ai_ml": ["OpenAI API"],
                    "devops": ["Docker"]
                },
                "deployment": "Deploy on cloud platform",
                "roadmap": ["Setup", "Build", "Deploy"]
            }

        # Return the parsed AI data directly
        response = {
            "idea": parsed.get("idea", idea),
            "architecture": parsed.get("architecture", {
                "description": f"Architecture for {idea}",
                "layers": [
                    {"name": "Frontend", "components": ["React", "TypeScript"]},
                    {"name": "Backend", "components": ["FastAPI", "Python"]},
                    {"name": "Database", "components": ["PostgreSQL"]},
                    {"name": "AI/ML", "components": ["OpenAI API"]}
                ]
            }),
            "tech_stack": parsed.get("tech_stack", {
                "frontend": ["React", "TypeScript", "Tailwind"],
                "backend": ["FastAPI", "Python"],
                "database": ["PostgreSQL", "Redis"],
                "ai_ml": ["OpenAI API", "LangChain"],
                "devops": ["Docker", "AWS", "GitHub Actions"]
            }),
            "deployment": parsed.get("deployment", "Deploy on Vercel (frontend) and AWS (backend)"),
            "roadmap": parsed.get("roadmap", [
                "Step 1: Setup development environment",
                "Step 2: Build core features",
                "Step 3: Add authentication",
                "Step 4: Deploy and scale"
            ])
        }

        print("FINAL RESPONSE:", response)
        return response

    except Exception as e:
        print("Recommend error:", e)
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }

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
    """Get all stacks. Always returns an array (empty if error)."""
    try:
        if db is None:
            print("⚠️ DB not available, returning empty array")
            return []
        
        stacks = db.query(Stack).all()
        
        # ✅ Ensure always returns array
        if stacks is None:
            return []
        
        # ✅ Convert to list of dicts with safe field access
        result = []
        for s in stacks:
            result.append({
                "id": s.id if hasattr(s, 'id') else None,
                "idea": s.idea if hasattr(s, 'idea') else "",
                "architecture": s.architecture if hasattr(s, 'architecture') else "",
                "core_technologies": s.core_technologies if hasattr(s, 'core_technologies') else [],
                "deployment": s.deployment if hasattr(s, 'deployment') else "",
                "roadmap": s.roadmap if hasattr(s, 'roadmap') else [],
                "created_at": str(s.created_at) if hasattr(s, 'created_at') and s.created_at else None
            })
        
        print(f"✅ Returning {len(result)} stacks")
        return result
        
    except Exception as e:
        print(f"❌ Error fetching stacks: {e}")
        import traceback
        traceback.print_exc()
        # ✅ Always return empty array on error (never null)
        return []

# ------------------ SIGNUP ------------------
@app.post("/auth/signup")
def signup(auth: UserAuth, db: Session = Depends(get_db)):
    try:
        email = auth.email.strip().lower()
        
        clean_password = safe_password(auth.password)

        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(400, "User already exists")

        hashed_password = pwd_context.hash(clean_password)

        user = User(email=email, password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_token({"sub": user.email})

        return {
            "success": True,
            "token": token,
            "user": {"id": user.id, "email": user.email}
        }

    except HTTPException:
        # Re-raise HTTP exceptions (like our password validation)
        raise
    except Exception as e:
        import traceback
        print("Signup error:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

# ------------------ LOGIN ------------------
@app.post("/auth/login")
def login(auth: UserAuth, db: Session = Depends(get_db)):
    try:
        email = auth.email.strip().lower()
        
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        clean_password = safe_password(auth.password)

        if not pwd_context.verify(clean_password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token({"sub": user.email})

        return {
            "success": True,
            "token": token,
            "user": {"id": user.id, "email": user.email}
        }

    except HTTPException:
        # Re-raise HTTP exceptions (like our password validation)
        raise
    except Exception as e:
        import traceback
        print("Login error:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

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