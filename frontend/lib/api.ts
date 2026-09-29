const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface MemoryItem {
  id: string;
  content: string;
  category?: string;
  score?: number;
  created_at?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  why_it_matters?: string;
}

export interface MemoryCategory {
  id: string;
  title: string;
  icon: string;
  count: number;
  memories: MemoryItem[];
}

export interface MemoryExplorerData {
  bank_id: string;
  total_memories: number;
  categories: MemoryCategory[];
  evolution_timeline: Array<{ day: string; event: string; category: string }>;
}

export interface TrendItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  lifecycle_stage: "EMERGING" | "RISING" | "TRENDING" | "SATURATED" | "DECLINING";
  momentum_score: number;
  velocity: number;
  source_count: number;
  sources: string[];
  related_topics: string[];
  description?: string;
}

export interface SevenDayPlanDay {
  day: number;
  phase: string;
  title: string;
  format: string;
  platform: string;
  objective: string;
  hook: string;
}

export interface StrategyResponse {
  id?: string;
  mode: string;
  trend?: string;
  why_it_matters: string;
  historical_memory: string[];
  audience_insight: string;
  content_gap: string;
  recommended_angle: string;
  format: string;
  platform: string;
  timing: string;
  hook: string;
  cta: string;
  seven_day_plan: SevenDayPlanDay[];
  success_metric: string;
  confidence_evidence: Record<string, string>;
  memories_used: MemoryItem[];
  reflection_summary?: string;
  generated_content?: Record<string, string>;
}

export interface BeforeAfterComparisonResponse {
  query: string;
  mode_a_no_memory: StrategyResponse;
  mode_b_with_hindsight: StrategyResponse;
  key_differences: string[];
}

export interface AgentChatResponse {
  reply: string;
  mode: string;
  memories_retrieved: MemoryItem[];
  reflection?: string;
  decision?: string;
  memory_retained?: string;
  trend_data?: any;
  action_suggestion?: any;
}

export interface ContentPublishAndLearnRequest {
  content_id?: string;
  title: string;
  topic: string;
  angle: string;
  format: string;
  impressions: number;
  engagements: number;
  shares: number;
  clicks?: number;
  org_id?: string;
}

export interface ContentPublishAndLearnResponse {
  content_id: string;
  engagement_rate: number;
  relative_performance: number;
  performance_analysis: string;
  retained_learning: string;
  hindsight_memory_id?: string;
}

export interface DashboardData {
  organization_name: string;
  bank_id: string;
  total_memories_count: number;
  active_trends_count: number;
  content_items_count: number;
  trend_radar: TrendItem[];
  top_learnings: string[];
  content_gaps: Array<{
    topic: string;
    coverage_level: string;
    coverage_percent: number;
    status_note: string;
  }>;
  top_topic: string;
  top_format: string;
  recent_published_content: any[];
  recommended_action: {
    title: string;
    format: string;
    platform: string;
    reason: string;
    action_type: string;
  };
  content_fatigue_alert?: string;
}

// API methods with resilient fallback
export async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}

export async function getMemoryExplorer(): Promise<MemoryExplorerData> {
  const res = await fetch(`${API_BASE}/memory/explorer`);
  if (!res.ok) throw new Error("Failed to load memory explorer");
  return res.json();
}

export async function getTrends(): Promise<TrendItem[]> {
  const res = await fetch(`${API_BASE}/trends`);
  if (!res.ok) throw new Error("Failed to load trends");
  return res.json();
}

export async function analyzeTrend(trendId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/trends/${trendId}/analyze`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to analyze trend");
  return res.json();
}

export async function generateStrategy(
  query: string = "What should we post next?",
  trendId?: string,
  mode: string = "with_hindsight"
): Promise<StrategyResponse> {
  const res = await fetch(`${API_BASE}/strategy/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, trend_id: trendId, mode, org_id: "acme-tech" }),
  });
  if (!res.ok) throw new Error("Failed to generate strategy");
  return res.json();
}

export async function compareModes(query: string): Promise<BeforeAfterComparisonResponse> {
  const res = await fetch(`${API_BASE}/strategy/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to compare modes");
  return res.json();
}

export async function sendAgentChat(message: string, mode: string = "with_hindsight"): Promise<AgentChatResponse> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode, org_id: "acme-tech" }),
  });
  if (!res.ok) throw new Error("Failed to send chat message");
  return res.json();
}

export async function publishAndLearn(data: ContentPublishAndLearnRequest): Promise<ContentPublishAndLearnResponse> {
  const res = await fetch(`${API_BASE}/performance/publish-and-learn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to ingest outcome");
  return res.json();
}

export async function getSimulationStep(step: number): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/timeline/${step}`);
  if (!res.ok) throw new Error(`Failed to load simulation step ${step}`);
  return res.json();
}

export async function getMemoryInsights(): Promise<any> {
  const res = await fetch(`${API_BASE}/memory/insights`);
  if (!res.ok) throw new Error("Failed to load memory insights");
  return res.json();
}
