import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "ContentIQ"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Hindsight Memory Configuration
    HINDSIGHT_API_URL: str = Field(default="https://api.hindsight.vectorize.io")
    HINDSIGHT_API_KEY: str = Field(default="")
    HINDSIGHT_BANK_ID: str = Field(default="contentiq::acme-tech")

    # LLM (Groq is default)
    GROQ_API_KEY: str = Field(default="")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile")

    # Primary Database (SQLite zero-friction async fallback or PostgreSQL)
    DATABASE_URL: str = Field(default="sqlite+aiosqlite:///./contentiq.db")

    # Redis (Optional)
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # Trend Integrations
    NEWS_API_KEY: str = Field(default="")
    YOUTUBE_API_KEY: str = Field(default="")

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
