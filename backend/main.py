from fastapi import FastAPI
from pydantic import BaseModel

print(">>> THIS MAIN.PY IS RUNNING <<<")


app = FastAPI(title="AI Tech Stack Recommender")

class ProjectInput(BaseModel):
    description: str

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/recommend")
def recommend_stack(data: ProjectInput):
    return {
        "input": data.description,
        "message": "API working successfully"
    }
