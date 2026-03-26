from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os
import json
import bcrypt
import jwt
from datetime import datetime, timedelta
import uuid
from typing import Optional
from fastapi import Depends

import google.genai as genai

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

# ---------------- AUTH CONFIG & DB ----------------
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

fake_users_db = {}

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_bytes.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
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

# ---------------- REQUEST MODEL ----------------
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

class User(BaseModel):
    id: str
    email: str
    hashed_password: str

# ---------------- AUTH ENDPOINTS ----------------
@app.post("/signup")
def signup(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    new_user = User.model_validate({
        "id": user_id,
        "email": user.email,
        "hashed_password": hashed_password
    })
    
    fake_users_db[user.email] = new_user
    
    return {"message": "User created successfully", "user_id": user_id}

@app.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = fake_users_db.get(user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"status": "Backend running with Gemini (Structured Output)"}

# ---------------- PROMPT ----------------
def build_prompt(project_description: str) -> str:
    return f"""
You are a senior software architect.

Analyze the project idea below and respond ONLY in valid JSON.
DO NOT include markdown, explanations, or extra text.
DO NOT wrap the JSON in backticks.

Use this EXACT JSON structure:

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

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="AI response was empty"
            )

        raw_text = response.text.strip()

        # Parse JSON safely
        structured_output = json.loads(raw_text)

        return {
            "project_description": data.description,
            "result": structured_output
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI response was not valid JSON"
        )
    except Exception as e:
        print("Gemini Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

