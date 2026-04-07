import os
import json
import logging
import asyncio
import time
# import redis  # Temporarily disabled
from typing import Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

# ✅ Load ENV first
load_dotenv()

# Logging setup (MUST be before any log usage)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("backend")

# Redis client for distributed caching - TEMPORARILY DISABLED
# try:
#     redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
#     redis_client.ping()  # Test connection
#     REDIS_AVAILABLE = True
#     log.info("✅ Redis connected")
# except Exception as e:
#     redis_client = None
#     REDIS_AVAILABLE = False
#     log.warning("⚠️ Redis not available: %s", e)

# Mock Redis variables for compatibility
redis_client = None
REDIS_AVAILABLE = False

# In-memory cache for recommendations with TTL (fallback)
cache = {}  # {idea: (data, timestamp)}
CACHE_TTL = 3600  # seconds (1 hour)
from sqlalchemy.orm import Session

from database import get_db, init_db
from models import Stack

# ✅ Gemini Import
try:
    import google.generativeai as genai
except Exception as e:
    genai = None
    log.warning("Gemini SDK not importable: %s", e)

# ✅ Load API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

model: Any = None

# ✅ Configure Gemini
if genai and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(GEMINI_MODEL)
        log.info("✅ Gemini model configured: %s", GEMINI_MODEL)
    except Exception as e:
        log.error("❌ Gemini config failed: %s", e)
        model = None
else:
    log.warning("⚠️ Gemini not initialized")

# ✅ FastAPI App
app = FastAPI(title="StackMind Backend")

# ✅ Startup event - init database AFTER app is created
@app.on_event("startup")
def startup():
    try:
        success = init_db()
        if success:
            log.info("✅ Database initialized on startup")
        else:
            log.warning("⚠️ Database initialization skipped (no DATABASE_URL)")
    except Exception as e:
        log.error(f"❌ Database initialization failed on startup: {e}")
        # Don't crash the app - let it start without DB

# ✅ CORS - Updated for production
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://stackmind-xi.vercel.app",  # ✅ Actual Vercel frontend URL
    "https://your-frontend-url.vercel.app",  # Keep for flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# STEP 7: STARTUP LOG
log.info("🚀 Backend running on port 8000")
log.info("📡 CORS enabled for: %s", ALLOWED_ORIGINS)
if model:
    log.info("🤖 Gemini model: %s", GEMINI_MODEL)
else:
    log.warning("⚠️ Gemini not configured - will use fallback responses")

# ✅ Global Error Handler
@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException:
        raise
    except Exception as e:
        log.exception("Unhandled error: %s", e)
        return JSONResponse({"error": "Internal server error"}, status_code=500)

# ✅ Request Model
class IdeaRequest(BaseModel):
    idea: str


# 🛡️ FAULT-TOLERANT FALLBACK RESPONSE
FALLBACK_RESPONSE = {
    "architecture": "AI-generated architecture for your idea. The system includes a modern frontend (React/Vue), scalable backend (Node.js/Python), and cloud deployment infrastructure.",
    "core_technologies": ["React", "Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
    "deployment": "Cloud deployment using Docker containers on AWS/GCP with CI/CD pipeline and auto-scaling.",
    "roadmap": ["Define MVP scope and core features", "Build frontend and backend infrastructure", "Deploy MVP and gather user feedback", "Scale and optimize for production"]
}

# ------------------ HELPERS ------------------

import re

def extract_json(text):
    """Extract and parse JSON from text, return partial data if parsing fails."""
    import json
    
    if not text or not isinstance(text, str):
        print("⚠️ Empty text in extract_json")
        return {
            "architecture": "",
            "core_technologies": [],
            "deployment": "",
            "roadmap": []
        }
    
    print(f"📝 EXTRACT_JSON INPUT: {text[:200]}...")
    
    # Remove markdown code blocks
    clean_text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
    clean_text = re.sub(r'```\s*', '', clean_text)
    clean_text = clean_text.strip()
    
    print(f"🧹 CLEANED TEXT: {clean_text[:200]}...")
    
    # Try to find JSON object using regex
    try:
        match = re.search(r'\{.*\}', clean_text, re.DOTALL)
        if match:
            json_str = match.group(0)  # Use group(0) not group()
            print(f"🔍 FOUND JSON BLOCK: {json_str[:200]}...")
            parsed = json.loads(json_str)
            print(f"✅ JSON PARSED SUCCESSFULLY: {parsed}")
            return parsed
    except Exception as e:
        print(f"❌ JSON parse error: {e}")
    
    # Fallback: try direct json.loads
    try:
        print("🔄 Trying direct json.loads...")
        parsed = json.loads(clean_text)
        print(f"✅ DIRECT PARSE SUCCESS: {parsed}")
        return parsed
    except Exception as e:
        print(f"❌ Direct parse failed: {e}")
    
    # STEP 4: Return partial structured object with raw text as architecture
    print("⚠️ Using RAW TEXT FALLBACK - preserving AI output")
    return {
        "architecture": text[:500],  # STEP 4: preserve AI output
        "core_technologies": [],
        "deployment": "",
        "roadmap": []
    }


def normalize_response(data, raw_text=""):
    """Normalize response - preserve AI data, only fill missing fields."""
    print(f"🔄 NORMALIZE INPUT: {data}")
    
    # STEP 6: Ensure data is at least an empty dict
    if not data or not isinstance(data, dict):
        print("⚠️ normalize_response: data is not dict, using empty")
        data = {}
    
    # STEP 6: Preserve AI data, only fill missing
    result = {
        "architecture": data.get("architecture", ""),
        "core_technologies": data.get("core_technologies", []),
        "deployment": data.get("deployment", ""),
        "roadmap": data.get("roadmap", [])
    }
    
    # Convert any dict values to appropriate types
    if isinstance(result["architecture"], dict):
        result["architecture"] = json.dumps(result["architecture"], indent=2)
    if isinstance(result["deployment"], dict):
        result["deployment"] = json.dumps(result["deployment"], indent=2)
    if isinstance(result["core_technologies"], dict):
        result["core_technologies"] = list(result["core_technologies"].values())
    if isinstance(result["roadmap"], dict):
        result["roadmap"] = list(result["roadmap"].values())
    
    print(f"✅ NORMALIZE OUTPUT: {result}")
    return result


def get_response_text(resp):
    try:
        return resp.text
    except:
        try:
            return resp.candidates[0].content.parts[0].text
        except:
            return str(resp)


# ------------------ ROUTES ------------------

@app.get("/")
def root():
    return {"status": "Backend running 🚀"}


@app.get("/health")
def health_check():
    """Health check endpoint for Render."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "redis": REDIS_AVAILABLE,
        "gemini": model is not None
    }


# 🚀 RECOMMEND (LLM) - DIAGNOSTIC VERSION - STEP 1 & 2: FORCE RAW OUTPUT
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    print("\n" + "="*60)
    print("🔥 API HIT - /recommend endpoint called")
    
    try:
        idea = (req.idea or "").strip()
        print(f"👉 Input idea: '{idea}'")
        
        if not idea:
            print("⚠️ Empty idea - returning test response")
            return {
                "architecture": "Empty idea provided - test response",
                "core_technologies": ["Test"],
                "deployment": "Test deployment",
                "roadmap": ["Step 1"]
            }
        
        # Check if model is available
        if not model:
            print("❌ Gemini model not available")
            return {
                "architecture": "Gemini not configured",
                "core_technologies": ["Error"],
                "deployment": "Error",
                "roadmap": ["Error"]
            }
        
        # STEP 1: Build enhanced prompt with new optional fields
        prompt = f"""Generate a comprehensive tech stack for: {idea}

Return ONLY valid JSON with ALL fields:
{{
  "architecture": "brief description",
  "core_technologies": ["tech1", "tech2", "tech3"],
  "deployment": "deployment method",
  "roadmap": ["step 1", "step 2"],
  "architecture_diagram": {{
    "nodes": [
      {{"id": "frontend", "label": "Frontend", "type": "component"}},
      {{"id": "backend", "label": "Backend", "type": "service"}},
      {{"id": "database", "label": "Database", "type": "data"}}
    ],
    "edges": [
      {{"from": "frontend", "to": "backend", "label": "API"}},
      {{"from": "backend", "to": "database", "label": "queries"}}
    ]
  }},
  "roadmap_phases": [
    {{
      "phase": "Phase 1: Foundation",
      "items": ["Setup project", "Define architecture", "Choose tech stack"]
    }},
    {{
      "phase": "Phase 2: Development",
      "items": ["Build frontend", "Develop backend", "Setup database"]
    }}
  ],
  "deployment_structured": {{
    "platform": "AWS/Vercel/Heroku",
    "strategy": "CI/CD pipeline",
    "monitoring": "Logging and metrics",
    "scaling": "Auto-scaling configuration"
  }}
}}

IMPORTANT: Include all fields for complete solution."""
        
        print(f"📝 Prompt built: {prompt[:200]}...")
        
        # STEP 1: Call Gemini
        print("🤖 Calling Gemini...")
        resp = model.generate_content(prompt)
        print(f"✅ Got response object: {type(resp)}")
        
        # STEP 1: Extract text safely
        def get_text(resp):
            try:
                return resp.text
            except:
                try:
                    return resp.candidates[0].content.parts[0].text
                except:
                    return ""
        
        raw = get_text(resp)
        print(f"🔥 RAW GEMINI OUTPUT:\n{raw}\n")
        print(f"📊 Length: {len(raw)} characters")
        
        # STEP 2: TEMPORARY BYPASS - Return raw directly structured
        # STEP 3: NO FALLBACK - Just return what we got
        if not raw:
            print("❌ Empty response from Gemini")
            return {
                "architecture": "Gemini returned empty response",
                "core_technologies": ["Error"],
                "deployment": "Error",
                "roadmap": ["Error"]
            }
        
        # STEP 6: Simple safe parsing
        print("🔧 Attempting to parse JSON...")
        import json, re
        
        def simple_extract(text):
            try:
                match = re.search(r'\{.*\}', text, re.DOTALL)
                if match:
                    return json.loads(match.group(0))
            except Exception as e:
                print(f"⚠️ JSON parse error: {e}")
            
            # Return raw text as architecture if JSON fails - include new fields
            return {
                "architecture": text,
                "core_technologies": [],
                "deployment": "",
                "roadmap": [],
                "architecture_diagram": {"nodes": [], "edges": []},
                "roadmap_phases": [],
                "deployment_structured": {}
            }
        
        parsed = simple_extract(raw)
        print(f"✅ Parsed: {parsed}")
        
        # Ensure basic structure with new optional fields
        result = {
            "architecture": parsed.get("architecture", raw[:500]),
            "core_technologies": parsed.get("core_technologies", []),
            "deployment": parsed.get("deployment", ""),
            "roadmap": parsed.get("roadmap", []),
            "architecture_diagram": parsed.get("architecture_diagram", {"nodes": [], "edges": []}),
            "roadmap_phases": parsed.get("roadmap_phases", []),
            "deployment_structured": parsed.get("deployment_structured", {})
        }
        
        print(f"✅ FINAL RESULT: {result}")
        print("="*60 + "\n")
        
        return result
        
    except Exception as e:
        print(f"🔥 CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {
            "architecture": f"Error: {str(e)}",
            "core_technologies": ["Error"],
            "deployment": "Error",
            "roadmap": ["Error"]
        }

@app.post("/recommend-stream")
async def recommend_stream(data: IdeaRequest):
    idea = data.idea

    async def stream_generator():
        try:
            prompt = f"""
            Give a tech stack for:
            {idea}

            Return JSON with:
            architecture, core_technologies, deployment, roadmap
            """

            response = model.generate_content(prompt)

            text = response.text if hasattr(response, "text") else str(response)

            # Simulate streaming (token by token)
            for chunk in text.split(" "):
                yield chunk + " "
                await asyncio.sleep(0.02)  # typing effect speed

        except Exception as e:
            yield f"ERROR: {str(e)}"

    return StreamingResponse(stream_generator(), media_type="text/plain")


# 💾 SAVE STACK
@app.post("/save-stack")
def save_stack(data: dict, db: Session = Depends(get_db)):
    try:
        stack = Stack(
            idea=data.get("idea"),
            architecture=data.get("architecture"),
            core_technologies=data.get("core_technologies"),
            deployment=data.get("deployment"),
            roadmap=data.get("roadmap"),
        )
        db.add(stack)
        db.commit()
        db.refresh(stack)

        return {"message": "Saved", "id": stack.id}

    except Exception as e:
        raise HTTPException(500, str(e))


# 📜 GET HISTORY
@app.get("/stacks")
def get_stacks(db: Session = Depends(get_db)):
    stacks = db.query(Stack).order_by(Stack.created_at.desc()).all()

    return [
        {
            "id": s.id,
            "idea": s.idea,
            "architecture": s.architecture,
            "core_technologies": s.core_technologies,
            "deployment": s.deployment,
            "roadmap": s.roadmap,
        }
        for s in stacks
    ]


# 🔐 AUTH ROUTES - Database Based
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import get_db
from models import User

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserAuth(BaseModel):
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) > 72:
            raise ValueError('Password cannot exceed 72 characters')
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class UserResponse(BaseModel):
    success: bool
    token: str
    user: dict

@app.post("/auth/signup", response_model=UserResponse)
def signup(auth: UserAuth, db: Session = Depends(get_db)):
    """Register a new user in database."""
    print(f"📥 Incoming signup request: {auth.email}")
    
    try:
        # Check if user exists
        print("🔍 Checking if user exists...")
        existing_user = db.query(User).filter(User.email == auth.email).first()
        
        if existing_user:
            print(f"⚠️ User already exists: {auth.email}")
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Hash password
        print("🔐 Hashing password...")
        print("Password length:", len(auth.password))
        print("Password value:", auth.password)
        print("Password type:", type(auth.password))
        hashed_pw = pwd_context.hash(auth.password)
        
        # Create user
        print("📝 Creating new user...")
        new_user = User(
            email=auth.email,
            password=hashed_pw
        )
        
        print("💾 Adding user to database...")
        db.add(new_user)
        
        print("📤 Committing transaction...")
        db.commit()
        db.refresh(new_user)
        
        # Generate token
        token = f"token-{new_user.id}"
        
        print(f"✅ User registered successfully: {auth.email}")
        
        return {
            "success": True,
            "token": token,
            "user": {"id": new_user.id, "email": new_user.email}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Signup error: {str(e)}")
        import traceback
        print(f"🔴 Full traceback:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/auth/login", response_model=UserResponse)
def login(auth: UserAuth, db: Session = Depends(get_db)):
    """Authenticate user from database."""
    try:
        # Find user
        user = db.query(User).filter(User.email == auth.email).first()
        
        if not user or not pwd_context.verify(auth.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Generate token
        token = f"token-{user.id}"
        
        log.info(f"✅ User logged in: {auth.email}")
        
        return {
            "success": True,
            "token": token,
            "user": {"id": user.id, "email": user.email}
        }
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"❌ Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")



# 🔗 SHARE STACK ENDPOINTS (NEW)
@app.post("/share")
def share_stack(data: dict, db: Session = Depends(get_db)):
    """Save stack data and return shareable ID."""
    try:
        from models import StackShare
        
        share = StackShare(
            data=data  # Store the entire stack result as JSON
        )
        db.add(share)
        db.commit()
        db.refresh(share)

        return {"id": share.id, "message": "Stack shared successfully"}

    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/share/{share_id}")
def get_shared_stack(share_id: str, db: Session = Depends(get_db)):
    """Retrieve shared stack by ID."""
    try:
        from models import StackShare
        
        share = db.query(StackShare).filter(StackShare.id == share_id).first()
        
        if not share:
            raise HTTPException(404, "Shared stack not found")

        return {
            "id": share.id,
            "data": share.data,
            "created_at": share.created_at.isoformat() if share.created_at else None
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
