from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.github_controller import router as github_router
import config

app = FastAPI(title="IHC Grupo 2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://Interacao-Humano-Computador.github.io"
    ],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(github_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "IHC Grupo 2 Analytics Engine Operacional", "version": "1.0.0"}