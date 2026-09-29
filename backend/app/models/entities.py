import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    hindsight_bank_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    contents = relationship("Content", back_populates="organization")
    campaigns = relationship("Campaign", back_populates="organization")
    brand_guidelines = relationship("BrandGuideline", back_populates="organization")
    audience_segments = relationship("AudienceSegment", back_populates="organization")
    recommendations = relationship("Recommendation", back_populates="organization")
    agent_runs = relationship("AgentRun", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    role = Column(String(64), default="content_strategist")
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class BrandGuideline(Base):
    __tablename__ = "brand_guidelines"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    tone = Column(String(255), default="Technical, Concise, Evidence-based")
    vocabulary_rules = Column(JSON, default=list) # preferred words, forbidden words
    messaging_pillars = Column(JSON, default=list)
    guidelines_text = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="brand_guidelines")

class AudienceSegment(Base):
    __tablename__ = "audience_segments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False) # e.g. "Software Developers & AI Engineers"
    pain_points = Column(JSON, default=list)
    preferred_formats = Column(JSON, default=list)
    engagement_signals = Column(JSON, default=dict)

    organization = relationship("Organization", back_populates="audience_segments")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    objective = Column(String(255), nullable=True)
    status = Column(String(64), default="active") # draft, active, completed
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="campaigns")
    contents = relationship("Content", back_populates="campaign")
    metrics = relationship("CampaignMetric", back_populates="campaign")

class CampaignMetric(Base):
    __tablename__ = "campaign_metrics"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(64), ForeignKey("campaigns.id"), nullable=False)
    total_impressions = Column(Integer, default=0)
    total_engagements = Column(Integer, default=0)
    avg_engagement_rate = Column(Float, default=0.0)
    summary_learning = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="metrics")

class Content(Base):
    __tablename__ = "contents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    campaign_id = Column(String(64), ForeignKey("campaigns.id"), nullable=True)
    title = Column(String(512), nullable=False)
    body = Column(Text, nullable=True)
    topic = Column(String(255), nullable=False, index=True)
    angle = Column(String(255), nullable=False) # e.g. "Technical tutorial", "Generic commentary"
    format = Column(String(128), nullable=False) # "Tutorial", "Opinion", "Case Study", "Carousel"
    platform = Column(String(128), default="LinkedIn")
    status = Column(String(64), default="published") # draft, scheduled, published
    published_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="contents")
    campaign = relationship("Campaign", back_populates="contents")
    metrics = relationship("ContentMetric", back_populates="content", uselist=False)

class ContentMetric(Base):
    __tablename__ = "content_metrics"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    content_id = Column(String(64), ForeignKey("contents.id"), nullable=False, unique=True)
    impressions = Column(Integer, default=0)
    engagements = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0) # in percentage
    relative_performance = Column(Float, default=1.0) # multiple of median (e.g. 2.4x)
    outcome_summary = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("Content", back_populates="metrics")

class Trend(Base):
    __tablename__ = "trends"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    category = Column(String(128), default="Artificial Intelligence")
    lifecycle_stage = Column(String(64), default="RISING") # EMERGING, RISING, TRENDING, SATURATED, DECLINING
    momentum_score = Column(Float, default=75.0) # 0 to 100
    velocity = Column(Float, default=1.5) # growth rate
    source_count = Column(Integer, default=12)
    sources = Column(JSON, default=list) # e.g. ["GitHub", "Reddit", "Hacker News", "Google Trends"]
    related_topics = Column(JSON, default=list)
    first_detected_at = Column(DateTime, default=datetime.utcnow)
    last_updated_at = Column(DateTime, default=datetime.utcnow)

    observations = relationship("TrendObservation", back_populates="trend")

class TrendObservation(Base):
    __tablename__ = "trend_observations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trend_id = Column(String(64), ForeignKey("trends.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metric_value = Column(Float, default=0.0)
    source = Column(String(128), nullable=False)
    notes = Column(Text, nullable=True)

    trend = relationship("Trend", back_populates="observations")

class ContentGap(Base):
    __tablename__ = "content_gaps"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    topic = Column(String(255), nullable=False)
    coverage_level = Column(String(64), default="NONE") # NONE, LOW, MEDIUM, HIGH
    relevance_score = Column(Float, default=85.0)
    recommendation_reason = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    trend_id = Column(String(64), ForeignKey("trends.id"), nullable=True)
    title = Column(String(512), nullable=False)
    strategy_summary = Column(Text, nullable=False)
    angle = Column(String(255), nullable=False)
    format = Column(String(128), nullable=False)
    platform = Column(String(128), default="LinkedIn")
    timing = Column(String(255), default="Immediate / Early growth phase")
    hook = Column(Text, nullable=True)
    cta = Column(Text, nullable=True)
    seven_day_plan = Column(JSON, default=list)
    success_metric = Column(String(255), nullable=True)
    memory_trace = Column(JSON, default=list) # retrieved memories used
    reflections = Column(Text, nullable=True)
    confidence_evidence = Column(JSON, default=dict)
    status = Column(String(64), default="suggested") # suggested, approved, published, rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="recommendations")

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    hypothesis = Column(Text, nullable=False)
    variant_a = Column(JSON, default=dict)
    variant_b = Column(JSON, default=dict)
    outcome = Column(Text, nullable=True)
    hindsight_memory_stored = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    query = Column(Text, nullable=False)
    mode = Column(String(64), default="with_hindsight") # "with_hindsight" or "no_memory"
    memories_retrieved = Column(JSON, default=list)
    reflection = Column(Text, nullable=True)
    decision = Column(Text, nullable=True)
    memory_written = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="agent_runs")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(64), default="trend_alert") # trend_alert, learning_alert, fatigue_alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    org_id = Column(String(64), ForeignKey("organizations.id"), nullable=False)
    provider = Column(String(64), nullable=False) # "linkedin", "twitter", "reddit", "rss"
    is_active = Column(Boolean, default=True)
    config = Column(JSON, default=dict)
    updated_at = Column(DateTime, default=datetime.utcnow)
