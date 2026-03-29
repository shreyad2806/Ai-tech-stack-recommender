import os
import json
import logging
import asyncio
import time
import redis
from typing import Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

# Redis client for distributed caching
try:
    redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
    redis_client.ping()  # Test connection
    REDIS_AVAILABLE = True
    print("✅ Redis connected")
except Exception as e:
    redis_client = None
    REDIS_AVAILABLE = False
    print(f"⚠️ Redis not available: {e}")

# In-memory cache for recommendations with TTL (fallback)
cache = {}  # {idea: (data, timestamp)}
CACHE_TTL = 3600  # seconds (1 hour)
from sqlalchemy.orm import Session

from database import get_db, init_db
from models import Stack

# ✅ Load ENV
load_dotenv()

# ✅ Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("backend")

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

# ✅ INIT DB (VERY IMPORTANT)
init_db()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# ------------------ HELPERS ------------------

def extract_json_from_text(text: str):
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
    except Exception:
        return None
    return None


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


# 🚀 RECOMMEND (LLM)
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    idea = (req.idea or "").strip().lower()
    log.info(f"📥 Idea: {idea}")

    # Check Redis cache first (if available)
    if REDIS_AVAILABLE and redis_client:
        try:
            cached = redis_client.get(idea)
            if cached:
                print("⚡ Redis Cache HIT")
                return json.loads(cached)
        except Exception as e:
            print(f"⚠️ Redis error: {e}")

    # Check in-memory cache with TTL (fallback)
    current_time = time.time()
    if idea in cache:
        cached_data, timestamp = cache[idea]
        if current_time - timestamp < CACHE_TTL:
            print("⚡ Memory Cache HIT")
            return cached_data
        else:
            print("⏳ Memory Cache expired")
            del cache[idea]
    
    print("🧠 Cache MISS → calling Gemini")

    if not model:
        raise HTTPException(503, "Gemini not configured")

    prompt = f"""
Generate a COMPLETE and UNIQUE tech stack for:

{idea}

Return ONLY JSON:
{{
  "architecture": "...",
  "core_technologies": ["..."],
  "deployment": "...",
  "roadmap": ["..."]
}}
"""

    try:
        resp = model.generate_content(prompt)
        raw = get_response_text(resp).strip()
    except Exception as e:
        raise HTTPException(502, f"Model failed: {e}")

    if not raw:
        raise HTTPException(502, "Empty model response")

    if "```" in raw:
        raw = raw.split("```")[1].replace("json", "").strip()

    parsed = extract_json_from_text(raw)

    if not parsed:
        result = {
            "architecture": raw[:500],
            "core_technologies": ["AI-generated"],
            "deployment": "Generated",
            "roadmap": ["See architecture"],
        }
        
        # Store in Redis (if available)
        if REDIS_AVAILABLE and redis_client:
            try:
                redis_client.setex(idea, CACHE_TTL, json.dumps(result))
                print("💾 Saved to Redis")
            except Exception as e:
                print(f"⚠️ Redis save error: {e}")
        
        # Store in memory cache with timestamp
        cache[idea] = (result, current_time)
        return result

    result = {
        "architecture": parsed.get("architecture", ""),
        "core_technologies": parsed.get("core_technologies", []),
        "deployment": parsed.get("deployment", ""),
        "roadmap": parsed.get("roadmap", []),
    }
    
    # Store in Redis (if available)
    if REDIS_AVAILABLE and redis_client:
        try:
            redis_client.setex(idea, CACHE_TTL, json.dumps(result))
            print("💾 Saved to Redis")
        except Exception as e:
            print(f"⚠️ Redis save error: {e}")
    
    # Store in memory cache with timestamp
    cache[idea] = (result, current_time)
    
    return result

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


# 🔐 TEMP AUTH
@app.post("/login")
def login():
    return {
        "access_token": "test-token",
        "user": {"email": "test@stackmind.ai"},
    }


@app.post("/signup")
def signup():
    return {
        "access_token": "test-token",
        "user": {"email": "test@stackmind.ai"},
    }
