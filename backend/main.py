from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json

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

