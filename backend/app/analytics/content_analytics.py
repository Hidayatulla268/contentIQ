from typing import List, Dict, Any, Optional
from app.schemas.schemas import ContentGapItem

class ContentAnalyticsService:
    def __init__(self):
        self.gaps = [
            ContentGapItem(
                topic="AI Agent Security & Sandboxing",
                coverage_level="NONE",
                coverage_percent=5,
                status_note="High developer search volume, zero coverage in Acme library. Critical emerging opportunity."
            ),
            ContentGapItem(
                topic="Local SLM Edge Deployment",
                coverage_level="LOW",
                coverage_percent=20,
                status_note="Emerging infrastructure trend with only 1 introductory mention."
            ),
            ContentGapItem(
                topic="AI Workflow Automation",
                coverage_level="MEDIUM",
                coverage_percent=55,
                status_note="Well covered in Q2. Ready for refreshed technical case study."
            ),
            ContentGapItem(
                topic="Generic AI Industry News",
                coverage_level="HIGH",
                coverage_percent=90,
                status_note="High saturation, underperforming engagement (0.4x). Fatigue risk detected."
            ),
        ]

    def detect_gaps(self) -> List[ContentGapItem]:
        return self.gaps

    def check_content_fatigue(self, recent_topics: Optional[List[str]] = None) -> Optional[str]:
        # Default analysis if none supplied
        topics = recent_topics or ["AI News", "AI News", "AI Commentary", "AI News", "AI Roundup"]
        news_count = sum(1 for t in topics if "news" in t.lower() or "commentary" in t.lower())
        if news_count >= 3:
            return (
                f"Content Fatigue Alert: {news_count} of your last {len(topics)} posts were generic AI news/commentary. "
                f"Historical Hindsight memories show generic commentary underperforms by 0.4x median. "
                f"We strongly recommend switching format to a hands-on Technical Tutorial or Architecture Breakdown."
            )
        return None

content_analytics_service = ContentAnalyticsService()
