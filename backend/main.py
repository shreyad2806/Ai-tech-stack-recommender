import os
import time
import json
import asyncio
import logging
import traceback
import re
import base64
from pathlib import Path
from datetime import datetime, timedelta

from typing import Any
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel, EmailStr, validator

from sqlalchemy.orm import Session

from passlib.context import CryptContext
import jwt

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

# ------------------ HELPER FUNCTIONS ------------------
def generate_cost_estimate(tech_stack, idea):
    """Generate cost estimation based on tech stack and project complexity"""
    try:
        # Base costs for different tiers
        base_costs = {
            "mvp": {"min": 20, "max": 50},
            "scale": {"min": 200, "max": 500}
        }
        
        # Multipliers based on tech stack complexity
        multipliers = {
            "frontend": 1.0,
            "backend": 1.2,
            "database": 1.1,
            "ai_ml": 1.8,
            "devops": 1.3
        }
        
        complexity_factor = 1.0
        idea_lower = idea.lower()
        
        # Adjust complexity based on project type
        if any(keyword in idea_lower for keyword in ["ai", "machine learning", "ml"]):
            complexity_factor *= 1.5
        if any(keyword in idea_lower for keyword in ["real-time", "live", "streaming"]):
            complexity_factor *= 1.3
        if any(keyword in idea_lower for keyword in ["enterprise", "large scale", "high traffic"]):
            complexity_factor *= 1.4
        if any(keyword in idea_lower for keyword in ["simple", "basic", "mvp", "prototype"]):
            complexity_factor *= 0.8
        
        # Calculate costs
        mvp_min = int(base_costs["mvp"]["min"] * complexity_factor)
        mvp_max = int(base_costs["mvp"]["max"] * complexity_factor)
        scale_min = int(base_costs["scale"]["min"] * complexity_factor)
        scale_max = int(base_costs["scale"]["max"] * complexity_factor)
        
        return {
            "mvp": f"${mvp_min}–${mvp_max}/month",
            "scale": f"${scale_min}–${scale_max}/month"
        }
    except Exception as e:
        print(f"Cost estimation error: {e}")
        return {
            "mvp": "$20–50/month",
            "scale": "$200–500/month"
        }

def generate_reasoning(tech_stack, idea):
    """Generate reasoning for tech stack choices"""
    try:
        reasoning_points = []
        
        # Analyze frontend choices
        frontend = tech_stack.get("frontend", [])
        if "React" in frontend:
            reasoning_points.append("React chosen for component-based architecture and large ecosystem")
        if "TypeScript" in frontend:
            reasoning_points.append("TypeScript for type safety and better developer experience")
        if "Next.js" in frontend:
            reasoning_points.append("Next.js for SSR/SSG capabilities and optimized performance")
        
        # Analyze backend choices
        backend = tech_stack.get("backend", [])
        if "FastAPI" in backend:
            reasoning_points.append("FastAPI chosen for async performance and automatic API documentation")
        if "Node.js" in backend:
            reasoning_points.append("Node.js for JavaScript full-stack development")
        if "Python" in backend:
            reasoning_points.append("Python for extensive libraries and rapid development")
        
        # Analyze database choices
        database = tech_stack.get("database", [])
        if "PostgreSQL" in database:
            reasoning_points.append("PostgreSQL for structured data and ACID compliance")
        if "MongoDB" in database:
            reasoning_points.append("MongoDB for flexible schema and document storage")
        if "Redis" in database:
            reasoning_points.append("Redis for caching and session management")
        
        # Analyze AI/ML choices
        ai_ml = tech_stack.get("ai_ml", [])
        if "OpenAI API" in ai_ml:
            reasoning_points.append("OpenAI API for powerful language model capabilities")
        if "LangChain" in ai_ml:
            reasoning_points.append("LangChain for LLM orchestration and chain management")
        
        # Analyze devops choices
        devops = tech_stack.get("devops", [])
        if "Docker" in devops:
            reasoning_points.append("Docker for containerization and consistent deployment")
        if "AWS" in devops:
            reasoning_points.append("AWS for scalability and comprehensive cloud services")
        if "Vercel" in devops:
            reasoning_points.append("Vercel for seamless frontend deployment")
        
        # Add project-specific reasoning
        idea_lower = idea.lower()
        if "ai" in idea_lower or "machine learning" in idea_lower:
            reasoning_points.append("AI-focused stack for intelligent features and automation")
        if "real-time" in idea_lower or "websocket" in idea_lower:
            reasoning_points.append("Real-time capable architecture for live features")
        if "scalable" in idea_lower or "scale" in idea_lower:
            reasoning_points.append("Scalable architecture designed for growth")
        
        # Ensure we have at least 3 reasoning points
        if len(reasoning_points) < 3:
            reasoning_points.extend([
                "Modern tech stack for maintainability and performance",
                "Well-documented technologies for team collaboration",
                "Industry-standard tools for long-term support"
            ])
        
        return reasoning_points[:6]  # Limit to 6 points for readability
        
    except Exception as e:
        print(f"Reasoning generation error: {e}")
        return [
            "FastAPI chosen for async performance",
            "PostgreSQL for structured data", 
            "AWS for scalability"
        ]

# ------------------ STATIC FILES ------------------
STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


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

# ------------------ MODELS ------------------
class IdeaRequest(BaseModel):
    idea: str

# ------------------ COST ESTIMATION ------------------
def generate_cost_estimate(tech_stack: dict, idea: str):
    """Generate cost estimate for MVP scale application"""
    return {
        "estimate": "$20–100/month (MVP scale)",
        "breakdown": [
            "Hosting (Vercel/AWS): $10–30/month",
            "Database: $5–20/month", 
            "AI API usage: $5–50/month",
            "Storage/CDN: $5–10/month"
        ]
    }

# ------------------ REASONING ------------------
def generate_reasoning(tech_stack: dict, idea: str):
    """Generate reasoning for tech stack choices"""
    return [
        f"React chosen for modern, component-based frontend development",
        f"FastAPI provides high-performance Python backend with automatic API documentation",
        f"PostgreSQL offers reliable relational database with strong consistency",
        f"OpenAI API enables powerful AI capabilities without building ML infrastructure",
        f"Docker ensures consistent deployment across development and production environments"
    ]

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

        prompt = f"""You are a senior system architect.

Convert the following system idea into structured architecture JSON.

Return ONLY valid JSON in this exact format:

{{
  "frontend": [
    {{ "name": "React", "purpose": "UI rendering" }}
  ],
  "backend": [
    {{ "name": "FastAPI", "purpose": "API layer" }}
  ],
  "database": [
    {{ "name": "PostgreSQL", "purpose": "primary database" }}
  ],
  "ai": [
    {{ "name": "OpenAI API", "purpose": "AI inference" }}
  ],
  "devops": [
    {{ "name": "Docker", "purpose": "containerization" }}
  ],
  "flow": [
    {{ "from": "Frontend", "to": "Backend" }},
    {{ "from": "Backend", "to": "Database" }},
    {{ "from": "Backend", "to": "AI" }}
  ]
}}

Rules:
- Always include relevant sections
- Include mobile stack (Flutter / Android) if idea suggests mobile
- Keep names realistic
- Keep purpose short (1 line)
- No explanation text outside JSON

System: {idea}"""

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
                    "frontend": [
                        {"name": "React", "purpose": "UI rendering"},
                        {"name": "TypeScript", "purpose": "Type safety"},
                        {"name": "Tailwind", "purpose": "Styling"}
                    ],
                    "backend": [
                        {"name": "FastAPI", "purpose": "API layer"},
                        {"name": "Python", "purpose": "Backend language"}
                    ],
                    "database": [
                        {"name": "PostgreSQL", "purpose": "Primary database"},
                        {"name": "Redis", "purpose": "Caching"}
                    ],
                    "ai": [
                        {"name": "OpenAI API", "purpose": "AI inference"},
                        {"name": "LangChain", "purpose": "AI framework"}
                    ],
                    "devops": [
                        {"name": "Docker", "purpose": "Containerization"},
                        {"name": "AWS", "purpose": "Cloud hosting"},
                        {"name": "GitHub Actions", "purpose": "CI/CD"}
                    ],
                    "flow": [
                        {"from": "Frontend", "to": "Backend"},
                        {"from": "Backend", "to": "Database"},
                        {"from": "Backend", "to": "AI"}
                    ]
                }
        except Exception as e:
            print(f"JSON parsing error: {e}")
            # Fallback response on parsing error
            parsed = {
                "frontend": [
                    {"name": "React", "purpose": "UI rendering"},
                    {"name": "TypeScript", "purpose": "Type safety"}
                ],
                "backend": [
                    {"name": "FastAPI", "purpose": "API layer"},
                    {"name": "Python", "purpose": "Backend language"}
                ],
                "database": [
                    {"name": "PostgreSQL", "purpose": "Primary database"}
                ],
                "ai": [
                    {"name": "OpenAI API", "purpose": "AI inference"}
                ],
                "devops": [
                    {"name": "Docker", "purpose": "Containerization"},
                    {"name": "AWS", "purpose": "Cloud hosting"}
                ],
                "flow": [
                    {"from": "Frontend", "to": "Backend"},
                    {"from": "Backend", "to": "Database"},
                    {"from": "Backend", "to": "AI"}
                ]
            }

        # Generate cost estimation based on tech stack
        cost_estimate = generate_cost_estimate(parsed, idea)
        
        # Generate reasoning for tech choices
        reasoning = generate_reasoning(parsed, idea)
        
        # Return the parsed AI data with new structure
        response = {
            "idea": idea,
            "architecture": {
                "description": f"Modern architecture for {idea} with scalable tech stack"
            },
            "tech_stack": {
                "frontend": parsed.get("frontend", ["React", "TypeScript", "Tailwind"]),
                "backend": parsed.get("backend", ["FastAPI", "Python"]),
                "database": parsed.get("database", ["PostgreSQL", "Redis"]),
                "ai_ml": parsed.get("ai", ["OpenAI API", "LangChain"]),
                "devops": parsed.get("devops", ["Docker", "AWS", "GitHub Actions"])
            },
            "deployment": "Deploy on Vercel (frontend) and AWS (backend)",
            "roadmap": [
                "Step 1: Setup development environment",
                "Step 2: Build core features",
                "Step 3: Add authentication",
                "Step 4: Deploy and scale"
            ],
            "cost": cost_estimate,
            "reasoning": reasoning
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
    try:
        stack = Stack(**data)
        db.add(stack)
        db.commit()
        db.refresh(stack)
        return {"id": stack.id}
    except Exception as e:
        import traceback
        print("Save error:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

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

# ------------------ AUTH REMOVED ------------------
# Authentication has been removed for open-access demo mode


# ------------------ SHARE ------------------
@app.post("/share")
def share_stack(data: dict, db: Session = Depends(get_db)):
    try:
        share = StackShare(data=data)
        db.add(share)
        db.commit()
        db.refresh(share)
        return {"id": share.id}
    except Exception as e:
        import traceback
        print("Share error:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/share/{id}")
def get_share(id: str, db: Session = Depends(get_db)):
    share = db.query(StackShare).filter(StackShare.id == id).first()
    if not share:
        raise HTTPException(404, "Not found")
    return share


# ------------------ RUN ------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)