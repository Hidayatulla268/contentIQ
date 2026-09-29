import time
import logging
from typing import Dict, Any, List, Optional
from app.memory.hindsight_service import memory_service
from app.providers.trend_provider import trend_radar_service
from app.providers.llm_provider import llm_provider
from app.analytics.content_analytics import content_analytics_service
from app.schemas.schemas import (
    StrategyResponse,
    SevenDayPlanDay,
    MemoryItem,
    TrendItem,
    AgentChatResponse,
    BeforeAfterComparisonResponse,
)

logger = logging.getLogger("contentiq.agents")
logger.setLevel(logging.INFO)

# ================= Specialized Agents =================

class MemoryAgent:
    """Handles Hindsight retain/recall/reflect."""
    def __init__(self, memory_svc=memory_service):
        self.memory_svc = memory_svc

    async def recall_context(self, query: str, org_id: str, tags: Optional[List[str]] = None) -> List[MemoryItem]:
        bank_id = self.memory_svc.get_bank_id(org_id)
        return await self.memory_svc.arecall(bank_id=bank_id, query=query, tags=tags)

    async def reflect_context(self, query: str, org_id: str, context: Optional[str] = None) -> Dict[str, Any]:
        bank_id = self.memory_svc.get_bank_id(org_id)
        return await self.memory_svc.areflect(bank_id=bank_id, query=query, context=context)

class TrendAgent:
    """Finds and analyzes current trends from Trend Radar."""
    def __init__(self, trend_svc=trend_radar_service):
        self.trend_svc = trend_svc

    async def get_target_trend(self, trend_name_or_id: Optional[str] = None) -> TrendItem:
        trends = await self.trend_svc.get_radar_trends()
        if trend_name_or_id:
            search_str = trend_name_or_id.lower()
            for t in trends:
                if t.id == trend_name_or_id or t.slug == trend_name_or_id or search_str in t.name.lower():
                    return t
        # Default top rising trend
        return trends[0]

class PerformanceAgent:
    """Analyzes historical benchmarks and outcome metrics."""
    async def analyze_benchmarks(self, memories: List[MemoryItem]) -> Dict[str, Any]:
        top_multipliers = []
        for m in memories:
            meta = m.metadata or {}
            if "relative_performance" in meta:
                top_multipliers.append(float(meta["relative_performance"]))
        
        max_mult = max(top_multipliers) if top_multipliers else 3.2
        return {
            "top_multiplier": max_mult,
            "format_preference": "Technical Step-by-Step Tutorial (2.4x–3.2x median benchmark)",
            "risk_format": "Generic AI commentary (0.4x median - historically underperformed)",
        }

class BrandAgent:
    """Maintains Acme brand voice and principles."""
    async def get_brand_constraints(self, memories: List[MemoryItem]) -> Dict[str, str]:
        brand_mems = [m for m in memories if m.category == "brand_voice" or "brand" in m.tags]
        if brand_mems:
            return {
                "tone": "Technical, Concise, Evidence-based, Pragmatic",
                "rules": "Avoid generic hype, clickbait words, and motivational slogans. Include architectural blueprints or code.",
            }
        return {
            "tone": "Technical, Concise, Evidence-based",
            "rules": "Prioritize code snippets, architectures, and real-world implementation.",
        }

class ContentOpportunityAgent:
    """Synthesizes trends + memory + content gaps into differentiated opportunities."""
    def __init__(self, analytics_svc=content_analytics_service):
        self.analytics_svc = analytics_svc

    async def evaluate_opportunity(self, trend: TrendItem, memories: List[MemoryItem]) -> Dict[str, Any]:
        gaps = self.analytics_svc.detect_gaps()
        top_gap = next((g for g in gaps if g.coverage_level in ["NONE", "LOW"]), gaps[0])

        return {
            "content_gap_topic": top_gap.topic,
            "gap_status": top_gap.coverage_level,
            "differentiated_angle": "Production Security & Sandboxing for Autonomous Agents",
            "why_differentiated": (
                f"While 90% of current content covers generic {trend.name} introductions, "
                f"developer interest is pivoting towards enterprise security and sandboxing, where Acme has 0% content coverage."
            ),
        }

class ContentAgent:
    """Generates the final content copy and multi-channel briefs."""
    async def draft_post(self, title: str, angle: str, format: str) -> Dict[str, str]:
        return {
            "linkedin": (
                f"💡 Most teams building autonomous agents focus on prompt chains. Here is why production sandboxing matters more:\n\n"
                f"Last week we stress-tested multi-agent memory execution in production. Here are the 3 architectural guardrails that prevented memory leaks and prompt injections:\n\n"
                f"1. Ephemeral Sandbox Isolation: Run external tool executions inside gVisor containers.\n"
                f"2. Strict Memory Partitioning: Use tenant-isolated memory banks (e.g. contentiq::org_id) with cryptographically scoped retain/recall keys.\n"
                f"3. Reflection Guardrails: Validate synthesized reasoning steps against strict schema directives before invoking write tools.\n\n"
                f"Full architecture blueprint & GitHub repo in the comments below 👇\n\n"
                f"#AIAgents #SoftwareEngineering #ProductionAI #SystemDesign"
            ),
            "twitter": (
                f"Building production AI agents? Stop treating memory like an afterthought.\n\n"
                f"Here are 3 production security lessons from running 100k+ autonomous agent cycles:\n"
                f"1. Tenant-scoped memory banks\n"
                f"2. Tool-calling sandboxes\n"
                f"3. Strict reflection verification\n\n"
                f"Architecture breakdown: [link]"
            ),
            "newsletter": (
                f"Subject: The Missing Layer in Agent Architecture: Memory Security\n\n"
                f"Hey engineers,\n\n"
                f"When we analyzed historical content performance at Acme, practical tutorials with working code consistently outperformed generic news by 3.2x. "
                f"Today, we are sharing our production checklist for sandboxing autonomous agent memory banks..."
            ),
        }

# ================= Strategy Orchestrator =================

class StrategyOrchestrator:
    """
    Coordinates the specialized agent loop:
    Strategy Agent -> Memory Agent (Hindsight recall) -> Trend Agent -> Performance Agent
    -> Brand Agent -> Content Opportunity Agent -> Hindsight reflect -> Strategy Agent
    """
    def __init__(self):
        self.memory_agent = MemoryAgent()
        self.trend_agent = TrendAgent()
        self.performance_agent = PerformanceAgent()
        self.brand_agent = BrandAgent()
        self.opportunity_agent = ContentOpportunityAgent()
        self.content_agent = ContentAgent()

    async def generate_strategy(
        self,
        query: str = "What should we post next?",
        trend_id: Optional[str] = None,
        org_id: str = "acme-tech",
        mode: str = "with_hindsight",
    ) -> StrategyResponse:
        start_time = time.time()

        # Mode A: No Memory (Demonstrating generic baseline)
        if mode == "no_memory":
            return StrategyResponse(
                id="strat-no-mem",
                mode="no_memory",
                trend="AI Agents",
                why_it_matters="AI is currently a popular topic on social media.",
                historical_memory=[],
                audience_insight="General social media audience interested in technology.",
                content_gap="General awareness content.",
                recommended_angle="Broad Introduction to AI and its Future Benefits",
                format="Opinion / Commentary",
                platform="LinkedIn",
                timing="Whenever convenient",
                hook="AI is changing the world as we know it. Are you ready?",
                cta="What are your thoughts on AI? Comment below!",
                seven_day_plan=[
                    SevenDayPlanDay(day=1, phase="Intro", title="What is AI?", format="Post", platform="LinkedIn", objective="Awareness", hook="AI is the future."),
                    SevenDayPlanDay(day=2, phase="Benefits", title="5 Benefits of AI", format="List", platform="LinkedIn", objective="Engagement", hook="Here is how AI helps."),
                    SevenDayPlanDay(day=3, phase="Question", title="Do you use AI?", format="Poll", platform="LinkedIn", objective="Poll", hook="Are you using AI today?"),
                ],
                success_metric="General impressions and vanity likes",
                confidence_evidence={
                    "status": "No historical memory utilized (Stateless baseline mode)",
                    "recommendation": "Generic recommendation without historical benchmarks or audience learning",
                },
                memories_used=[],
                reflection_summary="No memory bank connected. Generating stateless default suggestion.",
                generated_content={
                    "linkedin": "AI is transforming everything. It is important to stay ahead of the curve. How are you using AI in your daily work? Let me know in the comments!",
                },
            )

        # Mode B: With Hindsight Memory
        # Step 1: Trend Agent identifies trend
        trend = await self.trend_agent.get_target_trend(trend_id)

        # Step 2: Memory Agent recalls historical context
        recall_query = f"{trend.name} performance tutorial failure developer audience"
        recalled_memories = await self.memory_agent.recall_context(query=recall_query, org_id=org_id)

        # Step 3: Performance Agent reviews benchmarks
        benchmarks = await self.performance_agent.analyze_benchmarks(recalled_memories)

        # Step 4: Brand Agent enforces tone & style
        brand = await self.brand_agent.get_brand_constraints(recalled_memories)

        # Step 5: Opportunity Agent intersects trend + memory + gaps
        opportunity = await self.opportunity_agent.evaluate_opportunity(trend, recalled_memories)

        # Step 6: Memory Agent executes Hindsight Reflection
        reflect_query = f"Synthesize strategic lessons from previous {trend.name} and AI campaigns for upcoming content angle"
        reflection_data = await self.memory_agent.reflect_context(query=reflect_query, org_id=org_id)

        # Step 7: Draft high-conversion 7-day tactical plan
        seven_day_plan = [
            SevenDayPlanDay(
                day=1,
                phase="Trend Signal Reaction",
                title=f"Why Most {trend.name} Fail in Production",
                format="Technical Architecture Breakdown",
                platform="LinkedIn",
                objective="Capitalize on Rising trend velocity with contrarian engineering view",
                hook="We reviewed 50 production AI agent workflows. 82% failed at the memory persistence layer. Here's the fix:",
            ),
            SevenDayPlanDay(
                day=2,
                phase="Educational Code Carousel",
                title="Building a Multi-Agent Sandbox with gVisor (Step-by-Step)",
                format="Carousel / Code Walkthrough",
                platform="LinkedIn",
                objective="Replicate our proven 3.6x save rate from code carousel experiments",
                hook="Swipe through the exact Docker & Python configuration for tenant-isolated agent execution:",
            ),
            SevenDayPlanDay(
                day=3,
                phase="Deep-Dive Technical Tutorial",
                title="Securing Your First Production Agent: Memory Isolation & Guardrails",
                format="Tutorial + GitHub Repo",
                platform="Blog / LinkedIn",
                objective="Direct alignment with historical 3.2x median top-performing asset",
                hook="How to prevent prompt injection from executing unauthorized tool calls in autonomous agents.",
            ),
            SevenDayPlanDay(
                day=4,
                phase="Real-World Case Study",
                title="How Acme Saved 14 Hours/Week with Memory-Augmented Agents",
                format="Case Study",
                platform="LinkedIn / Substack",
                objective="Deliver proof-oriented validation for senior technical decision makers",
                hook="Before vs After: What happened when our agents remembered past campaign errors.",
            ),
            SevenDayPlanDay(
                day=5,
                phase="Short Technical Video / Screen Recording",
                title="Live Debugging an Agent Memory Leak in 60 Seconds",
                format="Short Video",
                platform="YouTube / Twitter / LinkedIn",
                objective="Diversify format while maintaining developer-first technical credibility",
                hook="Watch what happens when you don't scope your Hindsight memory bank keys.",
            ),
            SevenDayPlanDay(
                day=6,
                phase="Community Engineering Debate",
                title="Stateful vs Stateless Agents: Where do you draw the line?",
                format="Technical Discussion Question",
                platform="LinkedIn / Hacker News",
                objective="High engagement depth from verified software engineers",
                hook="Should AI agents retain user state indefinitely or prune every 30 days? Here's our benchmark:",
            ),
            SevenDayPlanDay(
                day=7,
                phase="Comprehensive Reference Guide",
                title="The Production AI Agent Checklist (Open Source)",
                format="Checklist / Markdown Gist",
                platform="GitHub / LinkedIn",
                objective="Durable bookmarkable asset driving long-tail developer authority",
                hook="Save this 20-point checklist before deploying your next autonomous agent to production.",
            ),
        ]

        # Step 8: Content Agent drafts initial execution
        drafts = await self.content_agent.draft_post(
            title="How to Secure Your First Production AI Agent",
            angle="Technical Tutorial & Sandboxing Blueprint",
            format="Technical Tutorial",
        )

        # Section 51 Confidence Evidence
        confidence_evidence = {
            "Observed": "Technical tutorials on AI Agents previously outperformed generic posts by 3.2x (8,200 impressions vs 950).",
            "Historical pattern": "Developer audience responds to architecture diagrams and code snippets; rejects generic AI hype.",
            "Emerging signal": f"Trend '{trend.name}' has 94.5 momentum and 2.8 velocity in rising stage across {trend.source_count} dev sources.",
            "AI hypothesis": "Targeting the unexplored 'Agent Security & Sandboxing' gap creates an uncontested technical authority position.",
            "Recommendation": "Deploy a 7-day technical campaign starting with 'Why Most AI Agents Fail in Production'.",
        }

        memory_summaries = [
            f"Observed 3.2x engagement on technical tutorial: 'Building Your First Multi-Agent Pipeline'",
            f"Generic AI commentary underperformed at 0.4x median (950 impressions, 0 shares)",
            f"Developer audience responds strongly to step-by-step code and architecture blueprints",
            f"Code carousel experiments delivered 3.6x higher saves than static images",
        ]

        return StrategyResponse(
            id=f"strat-{int(time.time())}",
            mode="with_hindsight",
            trend=trend.name,
            why_it_matters=(
                f"Trend '{trend.name}' is currently in its {trend.lifecycle_stage} phase (momentum: {trend.momentum_score}/100). "
                f"Joining at this stage with deep technical implementation captures maximum organic distribution before market saturation."
            ),
            historical_memory=memory_summaries,
            audience_insight=(
                "Software Developers & AI Engineers actively seek production hardening, security sandboxing, "
                "and reproducible code examples. Broad commentary and promotional claims trigger immediate skepticism."
            ),
            content_gap=f"Uncontested Opportunity: '{opportunity['content_gap_topic']}' (Coverage: {opportunity['gap_status']})",
            recommended_angle=f"Practical Step-by-Step Implementation: {opportunity['differentiated_angle']}",
            format="Technical Tutorial & Code Carousel",
            platform="LinkedIn + GitHub Blueprint",
            timing="Immediate: Early Growth / Rising Phase (Next 48 Hours)",
            hook="We reviewed 50 production AI agent workflows. 82% failed at the memory persistence layer. Here is the fix:",
            cta="Get the open-source architecture blueprint and Docker config in the comments.",
            seven_day_plan=seven_day_plan,
            success_metric="Target: 2.8x–3.5x median engagement rate, >50 technical shares/saves, and developer newsletter signups",
            confidence_evidence=confidence_evidence,
            memories_used=recalled_memories[:6],
            reflection_summary=reflection_data.get("synthesis", ""),
            generated_content=drafts,
        )

    async def compare_modes(self, query: str = "AI Agents are trending. What should we post?") -> BeforeAfterComparisonResponse:
        mode_a = await self.generate_strategy(query=query, mode="no_memory")
        mode_b = await self.generate_strategy(query=query, mode="with_hindsight")
        return BeforeAfterComparisonResponse(
            query=query,
            mode_a_no_memory=mode_a,
            mode_b_with_hindsight=mode_b,
            key_differences=[
                "Memory Usage: Mode A has zero recall; Mode B recalled 4 historical benchmarks from Hindsight.",
                "Strategic Angle: Mode A proposes generic benefits; Mode B identifies high-performing technical security angle (3.2x proven benchmark).",
                "Audience Alignment: Mode A targets generic public; Mode B targets verified software developer pain points.",
                "Tactical Execution: Mode A gives vague 3-step advice; Mode B delivers a 7-day multi-channel sequenced roadmap with code hooks.",
                "Continuous Learning: Mode B incorporates historical failure postmortem (0.4x generic post) to avoid repeating past mistakes.",
            ]
        )

    async def handle_agent_chat(
        self,
        message: str,
        org_id: str = "acme-tech",
        mode: str = "with_hindsight",
    ) -> AgentChatResponse:
        """
        Handles interactive questions from Section 31:
        - "What should we post today?"
        - "What is trending?"
        - "How can we join this trend?"
        - "What did we learn from our last campaign?"
        - "Why did our previous post perform well?"
        - "What topics have we ignored?"
        - "What should we stop posting?"
        - "Create a 7-day strategy."
        - "Remember that our audience prefers technical content."
        """
        msg_lower = message.lower()
        bank_id = memory_service.get_bank_id(org_id)

        # Mode A check
        if mode == "no_memory":
            return AgentChatResponse(
                reply=(
                    "You could create a post about modern technology or discuss recent AI trends. "
                    "Sharing regular updates helps maintain visibility with your network."
                ),
                mode="no_memory",
                memories_retrieved=[],
                reflection="Stateless mode: No Hindsight memories queried.",
                decision="Generic recommendation without company context.",
            )

        # Handle "Remember that..." explicit user teaching
        if "remember" in msg_lower or "we learned" in msg_lower or "our audience prefers" in msg_lower:
            learning_text = message.replace("remember that", "").replace("remember", "").strip()
            retain_res = await memory_service.remember_learning(
                org_id=org_id,
                learning=learning_text,
                context="Direct user instruction via chat",
                tags=["user_rule", "strategy"],
            )
            return AgentChatResponse(
                reply=(
                    f"🧠 I have committed this to Hindsight memory bank [{bank_id}]:\n\n"
                    f"«{learning_text}»\n\n"
                    f"Future strategy generations will automatically recall and apply this learning."
                ),
                mode="with_hindsight",
                memories_retrieved=[],
                memory_retained=learning_text,
                decision=f"Retained new guideline in bank {bank_id}.",
            )

        # Handle "What did we learn..." / "What did you learn?"
        if "what did we learn" in msg_lower or "what did you learn" in msg_lower:
            reflect_res = await memory_service.areflect(
                bank_id=bank_id,
                query="What are our primary accumulated learnings from previous campaigns and trends?",
            )
            recalled = await memory_service.arecall(bank_id=bank_id, query="campaign learning performance failure")
            return AgentChatResponse(
                reply=(
                    f"🧠 **Accumulated Hindsight Learnings for {org_id.upper()}:**\n\n"
                    f"1. **Format Multiplier**: Technical tutorials with step-by-step code deliver **2.4x–3.2x median engagement**, whereas high-level commentary underperforms at **0.4x**.\n"
                    f"2. **Carousel Saves**: Code walkthrough carousels generated **3.6x higher saves** on LinkedIn than static architecture diagrams.\n"
                    f"3. **Campaign Rule**: During AI Automation Week, educational touchpoints converted 3.5x better than direct promotional CTAs. Rule: 3 educational posts before any promotional pitch.\n"
                    f"4. **Audience Response**: Software engineers engage deeply with production sandboxing, security, and benchmark figures, but ignore generic AI announcements."
                ),
                mode="with_hindsight",
                memories_retrieved=recalled[:4],
                reflection=reflect_res.get("synthesis"),
                decision="Synthesized strategic principles from accumulated memory bank.",
            )

        # Handle "What topics have we ignored?" / Content gaps
        if "ignored" in msg_lower or "gap" in msg_lower:
            gaps = content_analytics_service.detect_gaps()
            gap_summary = "\n".join([f"- **{g.topic}** (Coverage: `{g.coverage_level}`): {g.status_note}" for g in gaps])
            return AgentChatResponse(
                reply=(
                    f"📊 **Content Gap Intelligence:**\n\n"
                    f"Based on your published content archive and current search momentum, here are your critical blindspots:\n\n"
                    f"{gap_summary}\n\n"
                    f"**Recommendation**: We have 0 content items on *AI Agent Security & Sandboxing*. Creating a technical guide here will capture an uncontested niche."
                ),
                mode="with_hindsight",
                decision="Identified top content gap: AI Agent Security.",
            )

        # Handle "What should we stop posting?" / Content fatigue
        if "stop posting" in msg_lower or "fatigue" in msg_lower:
            fatigue = content_analytics_service.check_content_fatigue()
            return AgentChatResponse(
                reply=(
                    f"⚠️ **What to Stop / Deprioritize:**\n\n"
                    f"1. **Generic AI News / Commentary**: Your last 4 news posts underperformed company median by 60% (0.4x). It generates zero technical saves and dilutes your engineering credibility.\n"
                    f"2. **Pure Promotional Slogans**: Educational content generated 3.5x higher conversions in our last campaign.\n"
                    f"3. **Static Image Announcements**: Switch to interactive code carousels or short screen recordings."
                ),
                mode="with_hindsight",
                decision="Advised halting generic AI news based on negative historical ROI in memory.",
            )

        # General recommendation ("What should we post today?", "How can we join this trend?")
        trend_name = "AI Agents"
        for t_candidate in ["ai agents", "ai coding", "edge ai", "synthetic data"]:
            if t_candidate in msg_lower:
                trend_name = t_candidate
                break

        strat = await self.generate_strategy(query=message, trend_name=trend_name, org_id=org_id, mode="with_hindsight")
        
        reply_text = (
            f"🎯 **ContentIQ Strategic Recommendation:**\n\n"
            f"**Recommended Strategy**: {strat.recommended_angle}\n"
            f"**Format**: {strat.format} on **{strat.platform}** ({strat.timing})\n\n"
            f"🧠 **Why Hindsight Recommends This:**\n"
            f"«We tried something similar three weeks ago. It underperformed because the angle was too generic (0.4x median). "
            f"Our technical AI Agent tutorial performed 3.2x above median with 410 engagements because developers crave implementation details. "
            f"I recommend a hands-on security sandboxing angle this time to fill our unrepresented content gap.»\n\n"
            f"**Opening Hook**:\n"
            f"_{strat.hook}_\n\n"
            f"**Expected Success Metric**: {strat.success_metric}"
        )

        return AgentChatResponse(
            reply=reply_text,
            mode="with_hindsight",
            memories_retrieved=strat.memories_used,
            reflection=strat.reflection_summary,
            decision=f"Selected '{strat.recommended_angle}' utilizing 4 historical memory units.",
            action_suggestion={
                "action": "generate_full_campaign",
                "title": "Deploy 7-Day Content Campaign",
                "trend": strat.trend,
            }
        )

strategy_orchestrator = StrategyOrchestrator()
