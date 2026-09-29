import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.memory.hindsight_service import memory_service
from app.providers.trend_provider import trend_radar_service
from app.analytics.content_analytics import content_analytics_service
from app.schemas.schemas import (
    ContentPublishAndLearnRequest,
    ContentPublishAndLearnResponse,
    DashboardOverviewResponse,
    ContentGapItem,
    TopPerformerItem,
)

logger = logging.getLogger("contentiq.learning")
logger.setLevel(logging.INFO)

class LearningService:
    def __init__(self):
        self.published_items: List[Dict[str, Any]] = [
            {
                "id": "post-demo-1",
                "title": "Building Your First Multi-Agent Pipeline with LangGraph",
                "topic": "AI Agents",
                "angle": "Practical developer tutorial",
                "format": "Tutorial",
                "platform": "LinkedIn",
                "impressions": 8200,
                "engagements": 410,
                "shares": 63,
                "engagement_rate": 5.0,
                "relative_performance": 2.4,
                "published_at": "3 weeks ago",
            },
            {
                "id": "post-demo-2",
                "title": "Why AI is Changing the Entire Future of Knowledge Work",
                "topic": "AI Industry News",
                "angle": "Generic commentary",
                "format": "Opinion",
                "platform": "LinkedIn",
                "impressions": 950,
                "engagements": 12,
                "shares": 0,
                "engagement_rate": 1.2,
                "relative_performance": 0.4,
                "published_at": "2 weeks ago",
            },
            {
                "id": "post-demo-3",
                "title": "Automating Internal Code Reviews with Local SLMs",
                "topic": "AI Automation",
                "angle": "Technical architecture breakdown",
                "format": "Case Study",
                "platform": "LinkedIn",
                "impressions": 6800,
                "engagements": 390,
                "shares": 45,
                "engagement_rate": 5.7,
                "relative_performance": 2.1,
                "published_at": "10 days ago",
            },
        ]

    async def publish_and_learn(self, data: ContentPublishAndLearnRequest) -> ContentPublishAndLearnResponse:
        """
        Implements Section 35:
        Post-Publish Learning:
        Input: Post title, topic, impressions, engagements, shares
        Analyze: Expected vs Actual
        Store learning into Hindsight:
        «Technical security tutorials about AI Agents significantly outperformed the organization's median content.»
        """
        # Calculate rates
        eng_rate = (data.engagements / max(data.impressions, 1)) * 100
        # Assume median engagement benchmark is 2.0%
        median_rate = 2.0
        rel_perf = round(eng_rate / median_rate, 2)

        if rel_perf >= 2.0:
            analysis = (
                f"Significant Outperformance: Achieved {eng_rate:.1f}% engagement ({rel_perf:.1f}x median benchmark). "
                f"The combination of '{data.angle}' and '{data.format}' resonated deeply with software engineers, "
                f"yielding {data.shares} high-intent shares."
            )
            retained_learning = (
                f"Verified Outcome: '{data.title}' ({data.topic} / {data.angle}) generated {data.impressions:,} impressions "
                f"and outperformed median content by {rel_perf:.1f}x. Technical tutorial formats remain our highest-ROI content lever."
            )
        elif rel_perf < 0.8:
            analysis = (
                f"Underperformance: Achieved {eng_rate:.1f}% engagement ({rel_perf:.1f}x median benchmark). "
                f"Angle '{data.angle}' proved too generic for developer expectations."
            )
            retained_learning = (
                f"Failure Learning: '{data.title}' underperformed at {rel_perf:.1f}x median. "
                f"Confirming that generic commentary without reproducible code should be avoided for {data.topic}."
            )
        else:
            analysis = f"Baseline Performance: Achieved {eng_rate:.1f}% engagement ({rel_perf:.1f}x median benchmark)."
            retained_learning = f"Content outcome recorded for {data.title}: Performed at expected baseline ({rel_perf:.1f}x)."

        # Retain into Hindsight
        bank_id = memory_service.get_bank_id(data.org_id)
        retain_res = await memory_service.remember_performance(
            org_id=data.org_id,
            topic=data.topic,
            angle=data.angle,
            format=data.format,
            impressions=data.impressions,
            engagements=data.engagements,
            engagement_rate=eng_rate,
            relative_performance=rel_perf,
            summary=retained_learning,
        )

        # Retain explicit learning unit
        await memory_service.remember_learning(
            org_id=data.org_id,
            learning=retained_learning,
            context=f"Recorded after analyzing published post '{data.title}'",
            tags=[data.topic.lower().replace(" ", "_"), "performance_learning", "outcome"],
        )

        # Store in local published list
        post_id = f"post-{int(time.time())}"
        self.published_items.insert(0, {
            "id": post_id,
            "title": data.title,
            "topic": data.topic,
            "angle": data.angle,
            "format": data.format,
            "platform": "LinkedIn",
            "impressions": data.impressions,
            "engagements": data.engagements,
            "shares": data.shares,
            "engagement_rate": round(eng_rate, 2),
            "relative_performance": rel_perf,
            "published_at": "Just now",
        })

        return ContentPublishAndLearnResponse(
            content_id=post_id,
            engagement_rate=round(eng_rate, 2),
            relative_performance=rel_perf,
            performance_analysis=analysis,
            retained_learning=retained_learning,
            hindsight_memory_id=retain_res.get("memory_id"),
        )

    async def get_dashboard_overview(self, org_id: str = "acme-tech") -> DashboardOverviewResponse:
        bank_id = memory_service.get_bank_id(org_id)
        trends = await trend_radar_service.get_radar_trends()
        gaps = content_analytics_service.detect_gaps()
        fatigue_alert = content_analytics_service.check_content_fatigue()
        
        # Memory explorer info
        mem_data = await memory_service.get_memory_explorer_data(org_id)

        top_learnings = [
            "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
            "Code carousels produce 3.6x higher saves on LinkedIn compared to static architecture diagrams.",
            "Audience Rule: 3 educational engineering touchpoints must precede any promotional product CTA.",
            "AI Agent Security & Sandboxing is an unaddressed content gap with surging search momentum.",
        ]

        return DashboardOverviewResponse(
            organization_name="AcmeAI Technologies",
            bank_id=bank_id,
            total_memories_count=mem_data.total_memories,
            active_trends_count=len(trends),
            content_items_count=len(self.published_items),
            trend_radar=trends,
            top_learnings=top_learnings,
            content_gaps=gaps,
            top_topic="AI Agents & Workflows (3.2x Median)",
            top_format="Technical Tutorial & Code Carousel",
            recent_published_content=self.published_items,
            recommended_action={
                "title": "Create: How to Secure Your First Production AI Agent",
                "format": "Technical Tutorial + Code Carousel",
                "platform": "LinkedIn & GitHub",
                "reason": "Capitalizes on Rising 'AI Agents' trend while filling our 0% coverage Security gap.",
                "action_type": "generate_strategy",
            },
            content_fatigue_alert=fatigue_alert,
        )

    async def run_learning_simulation_step(self, step: int, org_id: str = "acme-tech") -> Dict[str, Any]:
        """
        Executes the 5-step interactive learning evolution demo from Section 26:
        Interaction 1: General prompt -> Generic response
        Interaction 2: User provides feedback -> Store in Hindsight
        Interaction 3: User asks about AI Agents -> Recalls learning
        Interaction 4: User reports 3x performance -> Retain outcome
        Interaction 5: New AI trend appears -> Uses all accumulated experience
        """
        bank_id = memory_service.get_bank_id(org_id)

        if step == 1:
            return {
                "step": 1,
                "title": "Interaction 1: Zero-Memory Initial Request",
                "user_prompt": "What content should we create about AI?",
                "agent_response": (
                    "You could create a post explaining AI and its benefits. Highlight how artificial intelligence "
                    "is transforming various industries and ask your audience how they feel about the technology."
                ),
                "is_generic": True,
                "memory_used": None,
                "learning_status": "Agent has no company memory or historical benchmarks yet.",
            }

        elif step == 2:
            learning_fact = "Our technical tutorials performed 2.8x better than generic posts; developers want code and architecture diagrams."
            retain_res = await memory_service.remember_learning(
                org_id=org_id,
                learning=learning_fact,
                context="User feedback in Interaction 2",
                tags=["developer_audience", "tutorials_vs_generic"],
            )
            return {
                "step": 2,
                "title": "Interaction 2: Retaining First Learning in Hindsight",
                "user_prompt": "Our technical tutorials performed better than generic posts. Remember that our developers want code and architectures.",
                "agent_response": (
                    f"🧠 Retained into Hindsight bank [{bank_id}]:\n"
                    f"«{learning_fact}»\n"
                    f"I will prioritize technical code walkthroughs and architectural diagrams over generic commentary in future strategy."
                ),
                "memory_retained": learning_fact,
                "learning_status": "Retained 1 core audience preference rule in Hindsight.",
            }

        elif step == 3:
            recalled = await memory_service.arecall(bank_id=bank_id, query="technical tutorials code architecture developer")
            return {
                "step": 3,
                "title": "Interaction 3: Recalling Accumulated Learning",
                "user_prompt": "What should we post about AI Agents?",
                "agent_response": (
                    "Based on our retained learning that your developer audience strongly prefers technical code and architectures over generic posts, "
                    "I recommend a hands-on tutorial: 'Building a Multi-Agent State Machine with LangGraph'. "
                    "Include Docker configs and code snippets rather than high-level commentary."
                ),
                "memories_recalled": [m.content for m in recalled[:2]],
                "learning_status": "Agent recalled Interaction 2 learning and adapted strategy from generic to technical.",
            }

        elif step == 4:
            outcome = "The technical AI Agent post performed 3.2x above company median with 410 engagements and 63 shares."
            await memory_service.remember_performance(
                org_id=org_id,
                topic="AI Agents",
                angle="Technical developer tutorial",
                format="Tutorial",
                impressions=8200,
                engagements=410,
                engagement_rate=5.0,
                relative_performance=3.2,
                summary=outcome,
            )
            return {
                "step": 4,
                "title": "Interaction 4: Ingesting Real Performance Outcome",
                "user_prompt": "The technical AI Agent post performed 3.2x better with 410 engagements!",
                "agent_response": (
                    f"🎉 Retained performance outcome into Hindsight:\n"
                    f"«{outcome}»\n"
                    f"This validates that early technical tutorial participation in emerging trends produces 3x+ ROI."
                ),
                "memory_retained": outcome,
                "learning_status": "Outcome measured and retained into Hindsight memory bank.",
            }

        else: # step == 5
            return {
                "step": 5,
                "title": "Interaction 5: Full Hindsight-Augmented Strategic Reasoning",
                "user_prompt": "A new AI infrastructure & edge SLM trend is emerging. What should we do?",
                "agent_response": (
                    "🎯 **Synthesized Multi-Memory Strategy:**\n\n"
                    "1. **Trend Timing**: 'Edge AI & Local SLMs' is currently in its EMERGING phase with velocity 3.4. Based on our 3.2x win joining the AI Agent trend early, we should participate immediately.\n"
                    "2. **Proven Format**: In Interaction 2 & 4, we proved technical code tutorials deliver 3.2x higher engagement than opinion pieces. Do NOT write an 'Edge AI is the Future' opinion piece.\n"
                    "3. **Content Gap Alignment**: We have 0 posts on production sandboxing and local inference. I recommend: 'How to Deploy Quantized Llama 3.2 on Apple Silicon with Python Sandboxing'.\n"
                    "4. **Tactical Plan**: Deploy as a LinkedIn Code Carousel (proven 3.6x save multiplier) with companion GitHub repo."
                ),
                "is_full_learning_demonstrated": True,
                "learning_status": "Agent synthesized accumulated learnings from Interaction 1, 2, 3, and 4 into high-conviction strategy.",
            }

learning_service = LearningService()
