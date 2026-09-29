from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# ================= Memory Schemas =================

class MemoryRetainRequest(BaseModel):
    category: str = Field(..., description="content, performance, campaign, learning, brand_voice, audience_insight, trend, decision, experiment")
    content: str = Field(..., description="The knowledge or learning to retain")
    context: Optional[str] = Field(None, description="Contextual details")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tags: Optional[List[str]] = Field(default_factory=list)
    document_id: Optional[str] = None
    org_id: Optional[str] = Field("acme-tech", description="Organization ID for memory bank")

class MemoryRetainResponse(BaseModel):
    success: bool
    bank_id: str
    memory_id: Optional[str] = None
    message: str
    retained_at: datetime = Field(default_factory=datetime.utcnow)

class MemoryRecallRequest(BaseModel):
    query: str
    org_id: Optional[str] = "acme-tech"
    tags: Optional[List[str]] = None
    max_tokens: int = 4096
    budget: str = "mid"
    trace: bool = True

class MemoryItem(BaseModel):
    id: str
    content: str
    category: Optional[str] = "learning"
    score: Optional[float] = 1.0
    created_at: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    why_it_matters: Optional[str] = None

class MemoryRecallResponse(BaseModel):
    query: str
    bank_id: str
    memories: List[MemoryItem] = Field(default_factory=list)
    trace_info: Optional[Dict[str, Any]] = None
    raw_text: Optional[str] = None

class MemoryReflectRequest(BaseModel):
    query: str
    org_id: Optional[str] = "acme-tech"
    context: Optional[str] = None
    tags: Optional[List[str]] = None
    budget: str = "low"

class MemoryReflectResponse(BaseModel):
    query: str
    bank_id: str
    synthesis: str
    supporting_facts: List[str] = Field(default_factory=list)
    reflected_at: datetime = Field(default_factory=datetime.utcnow)

class MemoryExplorerCategory(BaseModel):
    id: str
    title: str
    icon: str
    count: int
    memories: List[MemoryItem]

class MemoryExplorerData(BaseModel):
    bank_id: str
    total_memories: int
    categories: List[MemoryExplorerCategory]
    evolution_timeline: List[Dict[str, Any]]

# ================= Trend Schemas =================

class TrendItem(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    lifecycle_stage: str # EMERGING, RISING, TRENDING, SATURATED, DECLINING
    momentum_score: float # 0 to 100
    velocity: float
    source_count: int
    sources: List[str]
    related_topics: List[str]
    description: Optional[str] = None

class TrendAnalysisRequest(BaseModel):
    trend_id: Optional[str] = None
    trend_name: Optional[str] = None
    org_id: Optional[str] = "acme-tech"

class TrendOpportunityResponse(BaseModel):
    trend: TrendItem
    opportunity: str
    why_it_matters: str
    best_angle: str
    best_format: str
    best_platform: str
    timing: str
    hook: str
    cta: str
    risk: str
    evidence: List[str]
    historical_memory_used: List[MemoryItem]
    content_gap_aligned: Optional[str] = None

# ================= Strategy & Agent Schemas =================

class SevenDayPlanDay(BaseModel):
    day: int
    phase: str # e.g. "Trend Reaction", "Technical Tutorial"
    title: str
    format: str
    platform: str
    objective: str
    hook: str

class StrategyGenerateRequest(BaseModel):
    query: Optional[str] = "What should we post next?"
    trend_id: Optional[str] = None
    trend_name: Optional[str] = None
    org_id: Optional[str] = "acme-tech"
    mode: Optional[str] = "with_hindsight" # "with_hindsight" or "no_memory"

class StrategyResponse(BaseModel):
    id: Optional[str] = None
    mode: str
    trend: Optional[str] = None
    why_it_matters: str
    historical_memory: List[str] = Field(default_factory=list)
    audience_insight: str
    content_gap: str
    recommended_angle: str
    format: str
    platform: str
    timing: str
    hook: str
    cta: str
    seven_day_plan: List[SevenDayPlanDay] = Field(default_factory=list)
    success_metric: str
    confidence_evidence: Dict[str, str] = Field(default_factory=dict)
    memories_used: List[MemoryItem] = Field(default_factory=list)
    reflection_summary: Optional[str] = None
    generated_content: Optional[Dict[str, str]] = None # {"linkedin": "...", "twitter": "..."}

class AgentChatRequest(BaseModel):
    message: str
    org_id: Optional[str] = "acme-tech"
    mode: Optional[str] = "with_hindsight" # "with_hindsight" or "no_memory"

class AgentChatResponse(BaseModel):
    reply: str
    mode: str
    memories_retrieved: List[MemoryItem] = Field(default_factory=list)
    reflection: Optional[str] = None
    decision: Optional[str] = None
    memory_retained: Optional[str] = None
    trend_data: Optional[Dict[str, Any]] = None
    action_suggestion: Optional[Dict[str, Any]] = None

# ================= Before / After Demo Schemas =================

class BeforeAfterComparisonResponse(BaseModel):
    query: str
    mode_a_no_memory: StrategyResponse
    mode_b_with_hindsight: StrategyResponse
    key_differences: List[str]

# ================= Content & Performance Schemas =================

class ContentCreateRequest(BaseModel):
    title: str
    body: Optional[str] = None
    topic: str
    angle: str
    format: str
    platform: Optional[str] = "LinkedIn"
    campaign_id: Optional[str] = None
    org_id: Optional[str] = "acme-tech"

class ContentPublishAndLearnRequest(BaseModel):
    content_id: Optional[str] = None
    title: str
    topic: str
    angle: str
    format: str
    impressions: int
    engagements: int
    shares: int
    clicks: Optional[int] = 0
    org_id: Optional[str] = "acme-tech"

class ContentPublishAndLearnResponse(BaseModel):
    content_id: str
    engagement_rate: float
    relative_performance: float
    performance_analysis: str
    retained_learning: str
    hindsight_memory_id: Optional[str] = None

# ================= Dashboard Schema =================

class ContentGapItem(BaseModel):
    topic: str
    coverage_level: str # HIGH, MEDIUM, LOW, NONE
    coverage_percent: int
    status_note: str

class TopPerformerItem(BaseModel):
    title: str
    topic: str
    format: str
    engagement_rate: float
    multiplier: float

class DashboardOverviewResponse(BaseModel):
    organization_name: str
    bank_id: str
    total_memories_count: int
    active_trends_count: int
    content_items_count: int
    trend_radar: List[TrendItem]
    top_learnings: List[str]
    content_gaps: List[ContentGapItem]
    top_topic: str
    top_format: str
    recent_published_content: List[Dict[str, Any]]
    recommended_action: Dict[str, Any]
    content_fatigue_alert: Optional[str] = None
