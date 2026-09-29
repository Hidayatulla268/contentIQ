from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.schemas import TrendItem

class BaseTrendProvider(ABC):
    @abstractmethod
    async def fetch_trends(self, limit: int = 10) -> List[TrendItem]:
        pass

    @abstractmethod
    async def analyze_trend_momentum(self, trend_id: str) -> Dict[str, Any]:
        pass

class DemoTrendProvider(BaseTrendProvider):
    """
    Clearly labeled synthetic demo provider modeling real-world public signals.
    """
    def __init__(self):
        self._trends = [
            TrendItem(
                id="trend-ai-agents",
                name="AI Agents & Multi-Agent Workflows",
                slug="ai-agents",
                category="Artificial Intelligence",
                lifecycle_stage="RISING",
                momentum_score=94.5,
                velocity=2.8,
                source_count=18,
                sources=["GitHub Trending", "Hacker News", "Reddit r/LocalLLaMA", "ArXiv"],
                related_topics=["Agentic Security", "Tool Calling", "Memory Architecture", "LangGraph", "Hindsight"],
                description="Massive spike in production implementations of autonomous agents, multi-agent coordination, and persistent memory frameworks."
            ),
            TrendItem(
                id="trend-ai-coding",
                name="AI Coding Assistants & Repo Context",
                slug="ai-coding",
                category="Developer Tools",
                lifecycle_stage="TRENDING",
                momentum_score=88.0,
                velocity=1.9,
                source_count=24,
                sources=["GitHub", "Twitter/X Dev", "YouTube Tech"],
                related_topics=["Cursor", "Windsurf", "Claude Sonnet", "Coding Benchmark", "Context Windows"],
                description="Rapid developer adoption of context-aware IDE assistants, automated debugging agents, and code review bots."
            ),
            TrendItem(
                id="trend-edge-ai",
                name="Edge AI & Local SLMs",
                slug="edge-ai",
                category="Infrastructure",
                lifecycle_stage="EMERGING",
                momentum_score=76.2,
                velocity=3.4,
                source_count=9,
                sources=["Hacker News", "Semiconductor Digest", "ArXiv"],
                related_topics=["Ollama", "On-Device Inference", "NPU Optimization", "Quantization", "Llama 3.2"],
                description="Emerging interest in running small, fine-tuned language models locally on consumer devices and private edge gateways."
            ),
            TrendItem(
                id="trend-synthetic-data",
                name="Synthetic Data & Evaluation Pipelines",
                slug="synthetic-data",
                category="Data Engineering",
                lifecycle_stage="RISING",
                momentum_score=71.8,
                velocity=1.7,
                source_count=11,
                sources=["ArXiv", "Hugging Face", "Reddit"],
                related_topics=["LLM-as-a-Judge", "Model Distillation", "Data Augmentation", "Benchmarking"],
                description="Enterprises seeking privacy-preserving data synthesis and systematic evaluation frameworks for LLM applications."
            ),
            TrendItem(
                id="trend-ai-hype-backlash",
                name="Enterprise AI ROI & Pragmatism",
                slug="ai-roi-pragmatism",
                category="Strategy",
                lifecycle_stage="SATURATED",
                momentum_score=52.0,
                velocity=0.6,
                source_count=16,
                sources=["Substack", "TechCrunch", "LinkedIn Pulse"],
                related_topics=["Proof of Concept Fatigue", "Cost Optimization", "Reliability", "Latency"],
                description="High saturation of generic AI commentary prompting a demand for hard financial ROI and production battle-stories."
            ),
            TrendItem(
                id="trend-generic-chatbots",
                name="Basic Q&A Wrapper Chatbots",
                slug="basic-chatbots",
                category="Legacy Applications",
                lifecycle_stage="DECLINING",
                momentum_score=28.4,
                velocity=-1.4,
                source_count=7,
                sources=["Product Hunt", "Twitter"],
                related_topics=["Wrapper fatigue", "Lack of differentiation", "Commoditization"],
                description="Users moving away from basic stateless chatbot prompts towards integrated, memory-powered workflow agents."
            ),
        ]

    async def fetch_trends(self, limit: int = 10) -> List[TrendItem]:
        return self._trends[:limit]

    async def analyze_trend_momentum(self, trend_id: str) -> Dict[str, Any]:
        match = next((t for t in self._trends if t.id == trend_id or t.slug == trend_id), self._trends[0])
        return {
            "trend": match,
            "lifecycle": match.lifecycle_stage,
            "momentum": match.momentum_score,
            "velocity": match.velocity,
            "is_synthetic_demo": True,
            "provider": "DemoTrendProvider (labeled synthetic data for hackathon)",
        }

class TrendRadarService:
    def __init__(self):
        # Default to high-fidelity demo provider
        self.provider: BaseTrendProvider = DemoTrendProvider()

    async def get_radar_trends(self) -> List[TrendItem]:
        return await self.provider.fetch_trends()

    async def get_trend_by_id(self, trend_id: str) -> Optional[TrendItem]:
        trends = await self.get_radar_trends()
        return next((t for t in trends if t.id == trend_id or t.slug == trend_id), None)

trend_radar_service = TrendRadarService()
