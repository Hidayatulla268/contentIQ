import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.memory.hindsight_service import memory_service
from app.api.endpoints import router as api_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("contentiq")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing ContentIQ backend...")
    # Initialize SQL database tables
    try:
        await init_db()
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.warning(f"Database init warning (using in-memory caches): {e}")

    # Preload demo data into Hindsight bank for acme-tech
    try:
        await memory_service.preload_acme_demo_data("acme-tech")
        logger.info("Acme-tech Hindsight demo memories preloaded.")
    except Exception as e:
        logger.warning(f"Hindsight preload notice: {e}")

    yield
    logger.info("ContentIQ backend shutting down...")

app = FastAPI(
    title="ContentIQ API",
    description="Persistent-memory AI agent for content strategy, trend intelligence and continuous marketing learning using Hindsight.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routes
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "product": "ContentIQ",
        "subtitle": "An AI Content Strategist That Remembers, Learns and Spots What's Next.",
        "hackathon": "HackwithHyderabad 3.0",
        "memory_layer": "Hindsight",
        "bank_id": settings.HINDSIGHT_BANK_ID,
        "status": "healthy",
        "endpoints": {
            "dashboard": "/api/dashboard",
            "memory_explorer": "/api/memory/explorer",
            "trends": "/api/trends",
            "strategy": "/api/strategy/generate",
            "before_after_compare": "/api/strategy/compare",
            "chat": "/api/agent/chat",
            "publish_learn": "/api/performance/publish-and-learn",
            "learning_timeline": "/api/demo/timeline/1",
        }
    }
