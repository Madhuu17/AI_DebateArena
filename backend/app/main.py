from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import FRONTEND_URL, DEMO_MODE
from app.routes import debate, evidence
from app.db.mongo import connect_db, disconnect_db
from app.db.chroma import init_chroma


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"🚀 AI Debate Arena starting... DEMO_MODE={'ON' if DEMO_MODE else 'OFF'}")
    await connect_db()
    await init_chroma()
    yield
    # Shutdown
    await disconnect_db()
    print("👋 Server shutting down")


app = FastAPI(
    title="AI Debate Arena API",
    description="Multi-agent AI debate system with real-time SSE streaming",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(debate.router)
app.include_router(evidence.router)


@app.get("/")
async def root():
    return {
        "service": "AI Debate Arena API",
        "status": "running",
        "demo_mode": DEMO_MODE,
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
