import os
import json
import logging
from typing import Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

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

# ✅ Load API Key (never log the key)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Stable model ID for AI Studio / v1beta (gemini-1.5-flash often returns 404)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

model: Any = None

# ✅ Configure Gemini
if genai and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            GEMINI_MODEL,
            generation_config={
                "temperature": 0.9,
                "top_p": 1,
                "top_k": 40,
            },
        )
        log.info("✅ Gemini model configured: %s", GEMINI_MODEL)
    except Exception as e:
        log.error("❌ Gemini config failed: %s", e)
        model = None
else:
    log.warning("⚠️ Gemini not initialized")

log.info(f"Model status: {'ACTIVE' if model else 'NOT ACTIVE'}")

# ✅ FastAPI App
app = FastAPI(title="StackMind Backend")

# ✅ CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Global Error Handler (must not swallow FastAPI/Starlette HTTPException)
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

# ✅ Extract JSON safely
def extract_json_from_text(text: str):
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
    except Exception:
        return None
    return None

# ✅ Extract Gemini response text
def get_response_text(resp):
    try:
        return resp.text
    except:
        try:
            return resp.candidates[0].content.parts[0].text
        except:
            return str(resp)

# ✅ Root
@app.get("/")
def root():
    return {"status": "Backend running 🚀"}

# 🚀 MAIN ENDPOINT
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    idea = (req.idea or "").strip()
    log.info(f"📥 Idea: {idea}")

    if not model:
        raise HTTPException(
            status_code=503,
            detail="Gemini not configured. Check API key.",
        )

    prompt = f"""
You are a senior software architect.

Generate a COMPLETE and UNIQUE tech stack for:

{idea}

Return ONLY JSON:

{{
  "architecture": "detailed architecture",
  "core_technologies": ["tech1", "tech2"],
  "deployment": "deployment strategy",
  "roadmap": ["step 1", "step 2"]
}}

Make it:
- Non-generic
- Specific
- Production-ready
"""

    try:
        resp = model.generate_content(prompt)
    except Exception as e:
        log.exception("❌ Gemini failed: %s", e)
        raise HTTPException(status_code=502, detail=f"Model request failed: {e!s}")

    raw = get_response_text(resp)
    raw = (raw or "").strip()

    log.info(f"🧠 RAW OUTPUT:\n{raw}")

    if not raw:
        raise HTTPException(status_code=502, detail="Empty response from Gemini")

    # ✅ Remove markdown
    if "```" in raw:
        raw = raw.split("```")[1]
        raw = raw.replace("json", "").strip()

    # ✅ Parse JSON safely
    try:
        parsed = extract_json_from_text(raw)

        if not parsed:
            raise ValueError("Invalid JSON format")

    except Exception as e:
        log.warning(f"⚠️ JSON parse failed: {e}")

        return {
            "architecture": raw[:500],
            "core_technologies": ["AI-generated"],
            "deployment": "Generated dynamically",
            "roadmap": ["See architecture section"],
        }

    architecture = parsed.get("architecture", "")
    core = parsed.get("core_technologies", [])
    deployment = parsed.get("deployment", "")
    roadmap = parsed.get("roadmap", [])

    if not isinstance(core, list):
        core = [str(core)]
    if not isinstance(roadmap, list):
        roadmap = [str(roadmap)]

    return {
        "architecture": architecture,
        "core_technologies": core,
        "deployment": deployment,
        "roadmap": roadmap,
    }

# ✅ TEMP AUTH (for frontend)
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
