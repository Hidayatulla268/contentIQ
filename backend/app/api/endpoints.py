import time
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from app.memory.hindsight_service import memory_service
from app.providers.trend_provider import trend_radar_service
from app.agents.specialized_agents import strategy_orchestrator
from app.services.learning_service import learning_service
from app.analytics.content_analytics import content_analytics_service
from app.schemas.schemas import (
    MemoryRetainRequest,
    MemoryRetainResponse,
    MemoryRecallRequest,
    MemoryRecallResponse,
    MemoryReflectRequest,
    MemoryReflectResponse,
    MemoryExplorerData,
    TrendItem,
    TrendOpportunityResponse,
    StrategyGenerateRequest,
    StrategyResponse,
    BeforeAfterComparisonResponse,
    AgentChatRequest,
    AgentChatResponse,
    ContentCreateRequest,
    ContentPublishAndLearnRequest,
    ContentPublishAndLearnResponse,
    DashboardOverviewResponse,
)

router = APIRouter()

# ================= 1. Memory Endpoints (Section 8, 11, 12, 13, 27) =================

@router.post("/memory/retain", response_model=MemoryRetainResponse)
async def retain_memory(req: MemoryRetainRequest):
    """
    Direct endpoint for Hindsight retain operation.
    """
    bank_id = memory_service.get_bank_id(req.org_id)
    res = await memory_service.aretain(
        bank_id=bank_id,
        content=req.content,
        category=req.category,
        context=req.context,
        metadata=req.metadata,
        tags=req.tags,
        document_id=req.document_id,
    )
    return MemoryRetainResponse(
        success=True,
        bank_id=bank_id,
        memory_id=res.get("memory_id"),
        message=res.get("message", "Retained"),
    )

@router.post("/memory/recall", response_model=MemoryRecallResponse)
async def recall_memories(req: MemoryRecallRequest):
    """
    Direct endpoint for Hindsight recall operation.
    """
    bank_id = memory_service.get_bank_id(req.org_id)
    mems = await memory_service.arecall(
        bank_id=bank_id,
        query=req.query,
        tags=req.tags,
        max_tokens=req.max_tokens,
        budget=req.budget,
        trace=req.trace,
    )
    return MemoryRecallResponse(
        query=req.query,
        bank_id=bank_id,
        memories=mems,
        trace_info={"count": len(mems), "bank": bank_id},
    )

@router.post("/memory/reflect", response_model=MemoryReflectResponse)
async def reflect_memories(req: MemoryReflectRequest):
    """
    Direct endpoint for Hindsight reflect operation.
    """
    bank_id = memory_service.get_bank_id(req.org_id)
    res = await memory_service.areflect(
        bank_id=bank_id,
        query=req.query,
        context=req.context,
        tags=req.tags,
        budget=req.budget,
    )
    return MemoryReflectResponse(
        query=req.query,
        bank_id=bank_id,
        synthesis=res.get("synthesis", ""),
        supporting_facts=res.get("supporting_facts", []),
    )

@router.get("/memory/explorer", response_model=MemoryExplorerData)
async def get_memory_explorer(org_id: str = "acme-tech"):
    """
    Provides categorized memories for 'What My Agent Remembers' UI (Section 27).
    """
    await memory_service.preload_acme_demo_data(org_id)
    return await memory_service.get_memory_explorer_data(org_id)

@router.get("/memory/insights")
async def get_memory_insights(org_id: str = "acme-tech"):
    """
    Summarizes strategic takeaways synthesized by Hindsight.
    """
    bank_id = memory_service.get_bank_id(org_id)
    reflect_res = await memory_service.areflect(
        bank_id=bank_id,
        query="What are the most critical content strategy insights accumulated in this bank?",
    )
    return {
        "bank_id": bank_id,
        "insights": reflect_res.get("synthesis"),
        "key_takeaways": [
            "Technical code walkthroughs generate 3.2x median engagement.",
            "Generic AI commentary consistently fails (0.4x median) with software developers.",
            "Code carousels yield 3.6x higher LinkedIn saves than static images.",
            "Security and Sandboxing is currently the highest-value content gap.",
        ]
    }

# ================= 2. Trend Radar Endpoints (Section 17, 18, 19, 20) =================

@router.get("/trends", response_model=List[TrendItem])
async def list_trends():
    """
    Returns radar trends with lifecycle stages: EMERGING, RISING, TRENDING, SATURATED, DECLINING.
    """
    return await trend_radar_service.get_radar_trends()

@router.get("/trends/{trend_id}", response_model=TrendItem)
async def get_trend(trend_id: str):
    trend = await trend_radar_service.get_trend_by_id(trend_id)
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
    return trend

@router.post("/trends/{trend_id}/analyze", response_model=TrendOpportunityResponse)
async def analyze_trend_opportunity(trend_id: str, org_id: str = "acme-tech"):
    """
    Answers: 'What does this trend mean for OUR brand?' (Section 19).
    Combines Trend + Audience + Brand Voice + Historical Hindsight Memory + Content Gaps.
    """
    trend = await trend_radar_service.get_trend_by_id(trend_id)
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")

    bank_id = memory_service.get_bank_id(org_id)
    recalled_mems = await memory_service.arecall(
        bank_id=bank_id,
        query=f"{trend.name} performance tutorial code failure",
    )

    gaps = content_analytics_service.detect_gaps()
    top_gap = next((g for g in gaps if g.coverage_level == "NONE"), gaps[0])

    evidence = [
        f"Observed: Previous technical tutorial on {trend.name} outperformed company median by 3.2x.",
        f"Historical pattern: Generic commentary failed at 0.4x median.",
        f"Audience Signal: Developer audience actively searches for practical production architectures.",
        f"Content Gap: We have {top_gap.coverage_level} coverage on '{top_gap.topic}'.",
    ]

    return TrendOpportunityResponse(
        trend=trend,
        opportunity=f"Establish Category Leadership in '{top_gap.topic}' for {trend.name}",
        why_it_matters=(
            f"Trend '{trend.name}' is {trend.lifecycle_stage} with velocity {trend.velocity}x. "
            f"While competitors publish high-level commentary, Acme can own the technical sandboxing niche."
        ),
        best_angle=f"Hands-on Developer Implementation: Sandboxing and Hardening {trend.name}",
        best_format="Technical Tutorial & Code Carousel",
        best_platform="LinkedIn + GitHub Blueprint",
        timing=f"Immediate ({trend.lifecycle_stage} phase window is open)",
        hook=f"We reviewed 50 production {trend.name} setups. 82% failed at the persistence layer. Here is the fix:",
        cta="Clone the open-source sandboxing Docker template from our GitHub repo in the comments.",
        risk="Joining with a generic promotional post risks diluting developer brand equity (0.4x historical penalty).",
        evidence=evidence,
        historical_memory_used=recalled_mems[:4],
        content_gap_aligned=top_gap.topic,
    )

# ================= 3. Strategy & Orchestrator Endpoints (Section 14, 16, 25, 32) =================

@router.post("/strategy/generate", response_model=StrategyResponse)
async def generate_content_strategy(req: StrategyGenerateRequest):
    """
    The core killer strategy loop:
    User Question -> Understand Intent -> Recall Memory -> Trend Radar -> Reflect -> Strategy + Evidence.
    """
    return await strategy_orchestrator.generate_strategy(
        query=req.query or "What should we post next?",
        trend_id=req.trend_id,
        org_id=req.org_id or "acme-tech",
        mode=req.mode or "with_hindsight",
    )

@router.post("/strategy/compare", response_model=BeforeAfterComparisonResponse)
async def compare_memory_modes(query: str = Body(default="AI Agents are trending. What should we post?", embed=True)):
    """
    Section 25: Mode A (No Memory) vs Mode B (With Hindsight) Side-by-Side Comparison!
    """
    return await strategy_orchestrator.compare_modes(query=query)

# ================= 4. Agent Interactive Chat (Section 31, 49, 50) =================

@router.post("/agent/chat", response_model=AgentChatResponse)
async def agent_chat(req: AgentChatRequest):
    """
    Conversational marketing strategist that remembers, learns, and cites memory evidence.
    """
    return await strategy_orchestrator.handle_agent_chat(
        message=req.message,
        org_id=req.org_id or "acme-tech",
        mode=req.mode or "with_hindsight",
    )

# ================= 5. Content & Post-Publish Learning (Section 35, 36) =================

@router.post("/performance/publish-and-learn", response_model=ContentPublishAndLearnResponse)
async def publish_and_learn_outcome(req: ContentPublishAndLearnRequest):
    """
    Input content performance -> analyze Expected vs Actual -> Retain into Hindsight!
    """
    return await learning_service.publish_and_learn(req)

@router.get("/content")
async def list_content_history():
    return learning_service.published_items

# ================= 6. Dashboard & Demo Simulation (Section 26, 30, 48) =================

@router.get("/dashboard", response_model=DashboardOverviewResponse)
async def get_dashboard(org_id: str = "acme-tech"):
    """
    Main dashboard overview with radar, learnings, gaps, and top performance.
    """
    await memory_service.preload_acme_demo_data(org_id)
    return await learning_service.get_dashboard_overview(org_id)

@router.get("/demo/timeline/{step}")
async def get_demo_simulation_step(step: int, org_id: str = "acme-tech"):
    """
    Controlled 5-step learning timeline demo (Section 26).
    """
    return await learning_service.run_learning_simulation_step(step=step, org_id=org_id)

@router.post("/demo/preload")
async def preload_demo_bank(org_id: str = "acme-tech"):
    """
    Preloads AcmeAI memory dataset into Hindsight.
    """
    await memory_service.preload_acme_demo_data(org_id)
    return {"status": "success", "message": f"Preloaded AcmeAI memories into bank contentiq::{org_id}"}
