import os
import time
import json
import asyncio
import logging
import traceback
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel
from sqlalchemy.orm import Session
from openai import OpenAI

# ------------------ ENV ------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("backend")

# ------------------ DATABASE ------------------
from database import get_db, init_db
from models import Stack, StackShare

# ------------------ GROQ / OpenAI-compatible ------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

log.info("✅ Groq client initialized")

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

# ------------------ STATIC ------------------
STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------ STARTUP ------------------
@app.on_event("startup")
def startup():
    print("🚀 Backend starting...")

    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ DB Error: {e}")

# ------------------ HEALTH ------------------
@app.get("/")
def root():
    return {
        "status": "running",
        "service": "StackMind Backend"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": time.time()
    }

# ------------------ REQUEST MODEL ------------------
class IdeaRequest(BaseModel):
    idea: str

# ------------------ HELPERS ------------------
def generate_cost_estimate(tech_stack: dict, idea: str):
    try:
        ai_count = len(tech_stack.get("ai", []))
        backend_count = len(tech_stack.get("backend", []))

        base = 20

        if ai_count > 0:
            base += 30

        if backend_count > 2:
            base += 20

        return {
            "estimate": f"${base}–{base + 80}/month",
            "breakdown": [
                "Frontend Hosting: $10–20/month",
                "Backend Hosting: $20–50/month",
                "Database: $5–20/month",
                "AI APIs: $10–50/month"
            ]
        }

    except Exception as e:
        log.error(f"Cost estimation error: {e}")

        return {
            "estimate": "$20–100/month",
            "breakdown": [
                "Hosting",
                "Database",
                "AI APIs"
            ]
        }


def generate_reasoning(tech_stack: dict, idea: str):
    try:
        reasoning = []

        frontend = tech_stack.get("frontend", [])
        backend = tech_stack.get("backend", [])
        database = tech_stack.get("database", [])
        ai = tech_stack.get("ai", [])
        devops = tech_stack.get("devops", [])

        if frontend:
            reasoning.append(
                f"{frontend[0]['name']} selected for scalable frontend development"
            )

        if backend:
            reasoning.append(
                f"{backend[0]['name']} selected for backend APIs and performance"
            )

        if database:
            reasoning.append(
                f"{database[0]['name']} selected for reliable data storage"
            )

        if ai:
            reasoning.append(
                f"{ai[0]['name']} added for AI-powered functionality"
            )

        if devops:
            reasoning.append(
                f"{devops[0]['name']} used for deployment and scaling"
            )

        return reasoning[:5]

    except Exception as e:
        log.error(f"Reasoning error: {e}")

        return [
            "Modern scalable architecture",
            "Fast backend APIs",
            "Reliable deployment setup"
        ]

# ------------------ RECOMMEND ------------------
# ------------------ RECOMMEND ------------------
@app.post("/recommend")
async def recommend(req: IdeaRequest):
    try:
        idea = req.idea.strip()

        if not idea:
            raise HTTPException(
                status_code=400,
                detail="Idea is required"
            )

        if not client:
            raise HTTPException(
                status_code=500,
                detail="AI client not initialized"
            )

        prompt = f"""
You are a world-class AI systems architect.

Your job:
Generate a COMPLETE production-ready AI system design.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No backticks
- No explanations
- No comments
- No extra text

The result should feel like:
- AWS architecture consultant
- YC startup infra advisor
- Vercel AI architect
- senior AI engineer

The response MUST be:
- scalable
- visually renderable
- modern
- startup realistic
- concise but informative

Return STRICT JSON in this EXACT schema:

{{
  "title": "Project title",

  "frontend": [
    {{
      "name": "Next.js",
      "purpose": "Frontend dashboard and SSR"
    }}
  ],

  "backend": [
    {{
      "name": "FastAPI",
      "purpose": "Backend APIs and AI orchestration"
    }}
  ],

  "database": [
    {{
      "name": "PostgreSQL",
      "purpose": "Primary relational database"
    }}
  ],

  "ai": [
    {{
      "name": "OpenAI API",
      "purpose": "LLM reasoning and generation"
    }}
  ],

  "devops": [
    {{
      "name": "Docker",
      "purpose": "Containerized deployment"
    }}
  ],

  "storage": [
    {{
      "name": "AWS S3",
      "purpose": "Object and file storage"
    }}
  ],

  "architecture_summary":
    "2-3 sentence scalable architecture overview.",

  "workflow": [
    {{
      "step": "User Query",
      "description": "User sends prompt from dashboard."
    }},
    {{
      "step": "Prompt Optimization",
      "description": "Backend validates and enriches prompts."
    }},
    {{
      "step": "Retriever",
      "description": "Relevant context and data are fetched."
    }},
    {{
      "step": "LLM Reasoning",
      "description": "AI model generates decisions and architecture."
    }},
    {{
      "step": "Validation",
      "description": "System validates outputs and formatting."
    }},
    {{
      "step": "Response Formatter",
      "description": "Structured frontend-ready response is generated."
    }}
  ],

  "build_modes": {{
    "mvp": [
      "Single backend service",
      "Basic AI inference",
      "Simple cloud deployment",
      "Minimal monitoring"
    ],

    "production": [
      "Redis queues",
      "Scalable APIs",
      "CI/CD pipelines",
      "Analytics and monitoring",
      "Background workers"
    ],

    "enterprise": [
      "Kubernetes orchestration",
      "Multi-region scaling",
      "Advanced observability",
      "Role-based access control",
      "Microservice architecture"
    ]
  }},

  "deployment": {{
    "frontend":
      "Deploy frontend on Vercel with CDN and edge caching.",

    "backend":
      "Deploy backend using Docker containers on AWS ECS.",

    "database":
      "Use managed PostgreSQL with automated backups on AWS RDS.",

    "monitoring":
      "Use Grafana, Prometheus, and Sentry for monitoring.",

    "scaling":
      "Use Redis queues, autoscaling, and load balancing."
  }},

  "reasoning": [
    "Next.js selected for fast frontend rendering and scalability.",
    "FastAPI chosen for async APIs and AI orchestration.",
    "PostgreSQL selected for reliable structured storage.",
    "Redis added for queues and caching performance.",
    "Docker chosen for reproducible infrastructure deployments."
  ],

  "cost": {{
    "estimate": "$80-300/month",

    "breakdown": [
      "Frontend Hosting: $20/month",
      "Backend Infrastructure: $80/month",
      "Database Hosting: $40/month",
      "AI APIs: $100/month",
      "Monitoring & DevOps: $30/month"
    ]
  }},

  "roadmap": [
    "Design scalable system architecture",
    "Setup frontend dashboard and authentication",
    "Build backend APIs and AI orchestration layer",
    "Integrate vector database and AI services",
    "Add monitoring, analytics, and logging",
    "Deploy production infrastructure",
    "Optimize performance and scaling"
  ]
}}

Generate architecture for this startup idea:

{idea}
"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=2500
            )

            raw = (
                response.choices[0]
                .message.content
                or ""
            ).strip()

            if not raw:
                raise Exception("Empty AI response")

            log.info(f"✅ RAW AI RESPONSE:\\n{raw}")

        except Exception as e:
            log.error(f"❌ AI API Error: {e}")

            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": "AI request failed",
                    "details": str(e)
                }
            )

        # CLEAN RESPONSE
        raw = (
            raw.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            parsed = json.loads(raw)

            log.info("✅ JSON parsing successful")

        except json.JSONDecodeError as e:
            log.error(f"❌ JSON Parse Error: {e}")
            log.error(f"❌ RAW RESPONSE:\\n{raw}")

            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": "Invalid JSON returned by AI",
                    "details": str(e),
                    "raw": raw
                }
            )

        final_response = {
            "success": True,

            "idea": idea,

            "title": parsed.get(
                "title",
                "AI System Design"
            ),

            "architecture_summary": parsed.get(
                "architecture_summary",
                ""
            ),

            "tech_stack": {
                "frontend": parsed.get("frontend", []),
                "backend": parsed.get("backend", []),
                "database": parsed.get("database", []),
                "ai_ml": parsed.get("ai", []),
                "devops": parsed.get("devops", []),
                "storage": parsed.get("storage", [])
            },

            "workflow": parsed.get(
                "workflow",
                []
            ),

            "build_modes": parsed.get(
                "build_modes",
                {
                    "mvp": [],
                    "production": [],
                    "enterprise": []
                }
            ),

            "deployment": parsed.get(
                "deployment",
                {}
            ),

            "reasoning": parsed.get(
                "reasoning",
                []
            ),

            "cost": parsed.get(
                "cost",
                {
                    "estimate": "$0",
                    "breakdown": []
                }
            ),

            "roadmap": parsed.get(
                "roadmap",
                []
            )
        }

        log.info("✅ Recommendation generated successfully")

        return final_response

    except HTTPException as e:
        raise e

    except Exception as e:
        log.error(f"❌ Recommend route failed: {e}")
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Recommendation generation failed",
                "details": str(e)
            }
        )
       

# ------------------ STREAM ------------------
@app.post("/recommend-stream")
async def recommend_stream(data: IdeaRequest):

    async def generator():
        try:
            if not client:
                yield "ERROR: AI client not initialized"
                return

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "user",
                        "content": data.idea
                    }
                ],
                temperature=0.4,
                max_tokens=400
            )

            text = response.choices[0].message.content or ""

            for chunk in text.split():
                yield chunk + " "
                await asyncio.sleep(0.02)

        except Exception as e:
            yield f"ERROR: {str(e)}"

    return StreamingResponse(generator(), media_type="text/plain")

# ------------------ SAVE STACK ------------------
@app.post("/save-stack")
def save_stack(data: dict, db: Session = Depends(get_db)):
    try:
        stack = Stack(**data)

        db.add(stack)
        db.commit()
        db.refresh(stack)

        return {
            "success": True,
            "id": stack.id
        }

    except Exception as e:
        log.error(f"Save stack error: {e}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Failed to save stack"
        )

# ------------------ GET STACKS ------------------
@app.get("/stacks")
def get_stacks(db: Session = Depends(get_db)):
    try:
        stacks = db.query(Stack).all()

        result = []

        for s in stacks:
            result.append({
                "id": getattr(s, "id", None),
                "idea": getattr(s, "idea", ""),
                "architecture": getattr(s, "architecture", ""),
                "core_technologies": getattr(s, "core_technologies", []),
                "deployment": getattr(s, "deployment", ""),
                "roadmap": getattr(s, "roadmap", []),
                "created_at": (
                    str(s.created_at)
                    if hasattr(s, "created_at") and s.created_at is not None
                    else None
                )
            })

        return result

    except Exception as e:
        log.error(f"Get stacks error: {e}")
        traceback.print_exc()

        return []

# ------------------ SHARE ------------------
@app.post("/share")
def share_stack(data: dict, db: Session = Depends(get_db)):
    try:
        share = StackShare(data=data)

        db.add(share)
        db.commit()
        db.refresh(share)

        return {
            "success": True,
            "id": share.id
        }

    except Exception as e:
        log.error(f"Share error: {e}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Failed to share stack"
        )

@app.get("/share/{id}")
def get_share(id: str, db: Session = Depends(get_db)):
    try:
        share = db.query(StackShare).filter(
            StackShare.id == id
        ).first()

        if not share:
            raise HTTPException(
                status_code=404,
                detail="Share not found"
            )

        return share

    except HTTPException as e:
        raise e

    except Exception as e:
        log.error(f"Get share error: {e}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch share"
        )

# ------------------ RUN ------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )