"""
FastAPI entrypoint.

Run with:  uvicorn app.main:app --reload --port 8000
Docs at:   http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import path, lessons, users
from .seed import seed

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

# Frontend runs on a different origin (localhost:3000) during dev, and on a
# different domain entirely once deployed — CORS must be wide open for a
# no-auth demo app like this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(users.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed()  # no-ops if already seeded


@app.get("/")
def root():
    return {"status": "ok", "message": "Duolingo Clone API — see /docs"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
