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

// ==========================================
// RICH FALLBACK & STANDALONE DEMO DATA
// Enables seamless live execution on Vercel without backend server
// ==========================================

const MOCK_TRENDS: TrendItem[] = [
  {
    id: "trend-ai-agents",
    name: "AI Agents & Multi-Agent Workflows",
    slug: "ai-agents-workflows",
    category: "AI Architecture",
    lifecycle_stage: "RISING",
    momentum_score: 94.5,
    velocity: 3.2,
    source_count: 4,
    sources: ["GitHub Trending", "Hacker News", "ArXiv", "Twitter/X"],
    related_topics: ["LangGraph", "Docker Sandboxing", "State Machines", "Tool Calling"],
    description: "Massive developer migration toward autonomous multi-agent pipelines with durable execution and memory.",
  },
  {
    id: "trend-local-slm",
    name: "Local Small Language Models (SLMs)",
    slug: "local-slm-deployment",
    category: "Edge AI",
    lifecycle_stage: "TRENDING",
    momentum_score: 89.2,
    velocity: 2.8,
    source_count: 3,
    sources: ["Reddit r/LocalLLaMA", "Hugging Face", "Ollama"],
    related_topics: ["Ollama", "vLLM", "Quantization", "Edge Deployment"],
    description: "Engineering teams shifting internal tool tasks from high-cost frontier models to 8B/3B quantized local SLMs.",
  },
  {
    id: "trend-agent-memory",
    name: "Persistent AI Agent Memory Layers",
    slug: "persistent-agent-memory",
    category: "AI Infrastructure",
    lifecycle_stage: "EMERGING",
    momentum_score: 91.8,
    velocity: 4.1,
    source_count: 3,
    sources: ["Hindsight Engine", "Vectorize", "Tech Twitter"],
    related_topics: ["Hindsight", "Durable Memory", "Retain/Recall/Reflect", "Context Drift"],
    description: "Surging demand for persistent agent memory that avoids prompt amnesia and retains past campaign lessons.",
  },
  {
    id: "trend-code-sandboxing",
    name: "Code Sandboxing & Agent Security",
    slug: "code-sandboxing-security",
    category: "Security",
    lifecycle_stage: "RISING",
    momentum_score: 86.4,
    velocity: 3.0,
    source_count: 3,
    sources: ["CVE Database", "Docker Blog", "Dev.to"],
    related_topics: ["gVisor", "Docker Isolation", "Untrusted Code Execution", "E2B"],
    description: "Critical unaddressed enterprise security need as autonomous agents run generated bash and python scripts.",
  },
  {
    id: "trend-genai-hype",
    name: "Broad AI Industry News & Speculation",
    slug: "genai-industry-news",
    category: "General Tech",
    lifecycle_stage: "SATURATED",
    momentum_score: 42.1,
    velocity: 0.6,
    source_count: 5,
    sources: ["LinkedIn Feeds", "Marketing Blogs", "Mainstream Media"],
    related_topics: ["Top 10 Tools", "Prompts for Beginners", "AI Revolution"],
    description: "High-level generic AI commentary is severely oversaturated; developer audience engagement is dropping at 0.4x.",
  },
  {
    id: "trend-prompt-templates",
    name: "Prompt Engineering Cheat Sheets",
    slug: "prompt-cheat-sheets",
    category: "Prompting",
    lifecycle_stage: "DECLINING",
    momentum_score: 28.3,
    velocity: 0.3,
    source_count: 2,
    sources: ["Medium", "Twitter Threads"],
    related_topics: ["Copy-Paste Prompts", "Secret Formulas"],
    description: "Developer audiences dismiss superficial prompt templates in favor of structured workflows and code architectures.",
  },
];

let inMemoryPublishedItems: any[] = [
  {
    id: "post-demo-1",
    title: "Building Your First Multi-Agent Pipeline with LangGraph",
    topic: "AI Agents",
    angle: "Practical developer tutorial",
    format: "Tutorial",
    platform: "LinkedIn",
    impressions: 8200,
    engagements: 410,
    shares: 63,
    engagement_rate: 5.0,
    relative_performance: 2.4,
    published_at: "3 weeks ago",
  },
  {
    id: "post-demo-2",
    title: "Why AI is Changing the Entire Future of Knowledge Work",
    topic: "AI Industry News",
    angle: "Generic commentary",
    format: "Opinion",
    platform: "LinkedIn",
    impressions: 950,
    engagements: 12,
    shares: 0,
    engagement_rate: 1.2,
    relative_performance: 0.4,
    published_at: "2 weeks ago",
  },
  {
    id: "post-demo-3",
    title: "Automating Internal Code Reviews with Local SLMs",
    topic: "AI Automation",
    angle: "Technical architecture breakdown",
    format: "Case Study",
    platform: "LinkedIn",
    impressions: 6800,
    engagements: 390,
    shares: 45,
    engagement_rate: 5.7,
    relative_performance: 2.1,
    published_at: "10 days ago",
  },
  {
    id: "post-demo-4",
    title: "10 Mind-Blowing AI Tools You Cannot Miss This Week",
    topic: "AI Tools",
    angle: "Generic listicle",
    format: "Listicle",
    platform: "LinkedIn",
    impressions: 1100,
    engagements: 18,
    shares: 1,
    engagement_rate: 1.6,
    relative_performance: 0.35,
    published_at: "1 week ago",
  },
  {
    id: "post-demo-5",
    title: "How to Sandbox Python Tool Calls in Docker for Autonomous Agents",
    topic: "AI Agents",
    angle: "Security tutorial + GitHub Repo",
    format: "Tutorial",
    platform: "LinkedIn",
    impressions: 12400,
    engagements: 680,
    shares: 93,
    engagement_rate: 5.5,
    relative_performance: 3.2,
    published_at: "3 days ago",
  },
];

let inMemoryCustomMemories: MemoryItem[] = [];

// Helper with timeout to gracefully try backend then fall back
async function safeFetch<T>(url: string, options?: RequestInit, timeoutMs: number = 2000): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend unavailable or timed out, will fall back to rich demo dataset
  }
  return null;
}

// ==========================================
// API IMPLEMENTATIONS WITH AUTOMATIC FALLBACK
// ==========================================

export async function getDashboard(): Promise<DashboardData> {
  const data = await safeFetch<DashboardData>(`${API_BASE}/dashboard`);
  if (data) return data;

  return {
    organization_name: "AcmeAI Technologies",
    bank_id: "contentiq::acme-tech",
    total_memories_count: 24 + inMemoryCustomMemories.length,
    active_trends_count: MOCK_TRENDS.length,
    content_items_count: inMemoryPublishedItems.length,
    trend_radar: MOCK_TRENDS,
    top_learnings: [
      "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
      "Code carousels produce 3.6x higher saves on LinkedIn compared to static architecture diagrams.",
      "Audience Rule: 3 educational engineering touchpoints must precede any promotional product CTA.",
      "AI Agent Security & Sandboxing is an unaddressed content gap with surging search momentum.",
    ],
    content_gaps: [
      {
        topic: "AI Agent Security & Sandboxing",
        coverage_level: "NONE",
        coverage_percent: 0,
        status_note: "High developer search intent, 0 internal posts published",
      },
      {
        topic: "Local SLM Deployment & Quantization",
        coverage_level: "LOW",
        coverage_percent: 25,
        status_note: "1 case study published 10 days ago (2.1x median)",
      },
      {
        topic: "Persistent Agent Memory Architecture",
        coverage_level: "MEDIUM",
        coverage_percent: 50,
        status_note: "2 posts published; high audience engagement",
      },
      {
        topic: "Broad AI Industry News",
        coverage_level: "HIGH",
        coverage_percent: 90,
        status_note: "Content fatigue detected: 7 consecutive posts at 0.4x median",
      },
    ],
    top_topic: "AI Agents & Workflows (3.2x Median)",
    top_format: "Technical Tutorial & Code Carousel",
    recent_published_content: inMemoryPublishedItems,
    recommended_action: {
      title: "Create: How to Secure Your First Production AI Agent",
      format: "Technical Tutorial + Code Carousel",
      platform: "LinkedIn & GitHub",
      reason: "Capitalizes on Rising 'AI Agents' trend while filling our 0% coverage Security gap.",
      action_type: "generate_strategy",
    },
    content_fatigue_alert: "Alert: 7 consecutive high-level AI industry posts produced 0.4x median performance. Shift to technical tutorial format.",
  };
}

export async function getMemoryExplorer(): Promise<MemoryExplorerData> {
  const data = await safeFetch<MemoryExplorerData>(`${API_BASE}/memory/explorer`);
  if (data) return data;

  const baseLearnings: MemoryItem[] = [
    {
      id: "mem-l1",
      content: "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
      category: "learning",
      score: 0.98,
      created_at: "3 weeks ago",
      tags: ["performance", "format_rule"],
      why_it_matters: "Proves developer audiences only engage with reproducible code and architectures.",
    },
    {
      id: "mem-l2",
      content: "Code carousels produce 3.6x higher saves on LinkedIn compared to static architecture diagrams.",
      category: "learning",
      score: 0.95,
      created_at: "2 weeks ago",
      tags: ["linkedin", "format_test"],
      why_it_matters: "Carousels keep users swiping, boosting algorithmic distribution.",
    },
    {
      id: "mem-l3",
      content: "Generic AI news roundups suffered a 60% engagement drop (0.4x median across 7 posts).",
      category: "learning",
      score: 0.92,
      created_at: "10 days ago",
      tags: ["failure_lesson", "news_fatigue"],
      why_it_matters: "Hard evidence to immediately cease publishing broad summaries.",
    },
    {
      id: "mem-l4",
      content: "Developer audience prioritizes security hardening, reproducible code, and benchmark figures.",
      category: "learning",
      score: 0.91,
      created_at: "5 days ago",
      tags: ["audience_insight", "rules"],
      why_it_matters: "Guides exact content angle selection for upcoming campaigns.",
    },
    ...inMemoryCustomMemories,
  ];

  const basePerformance: MemoryItem[] = [
    {
      id: "mem-p1",
      content: "Tutorial 'Building Your First Multi-Agent Pipeline with LangGraph' achieved 8,200 impressions (2.4x median).",
      category: "performance",
      score: 0.96,
      created_at: "3 weeks ago",
      tags: ["benchmark", "ai_agents"],
      why_it_matters: "Established multi-agent tutorials as top acquisition pillar.",
    },
    {
      id: "mem-p2",
      content: "Tutorial 'How to Sandbox Python Tool Calls in Docker for Autonomous Agents' reached 12,400 impressions (3.2x median).",
      category: "performance",
      score: 0.99,
      created_at: "3 days ago",
      tags: ["benchmark", "security"],
      why_it_matters: "Record company engagement verifying that security tutorials outperform all other topics.",
    },
    {
      id: "mem-p3",
      content: "Opinion post 'Why AI is Changing the Entire Future of Knowledge Work' scored only 950 impressions (0.4x median).",
      category: "performance",
      score: 0.88,
      created_at: "2 weeks ago",
      tags: ["underperformance", "generic_opinion"],
      why_it_matters: "Underpins the agent's refusal to recommend high-level opinion posts.",
    },
  ];

  const baseAudience: MemoryItem[] = [
    {
      id: "mem-a1",
      content: "Audience segment: Software Developers & AI Engineers (65% of followers) demand reproducible Docker configs.",
      category: "audience",
      score: 0.94,
      created_at: "1 month ago",
      tags: ["segment", "developer"],
      why_it_matters: "Ensures technical accuracy and actionable artifacts.",
    },
    {
      id: "mem-a2",
      content: "CTOs and Engineering Managers engage heavily with cost optimization postmortems and latency comparisons.",
      category: "audience",
      score: 0.91,
      created_at: "2 weeks ago",
      tags: ["segment", "leadership"],
      why_it_matters: "Secondary persona target for enterprise case studies.",
    },
  ];

  const baseBrand: MemoryItem[] = [
    {
      id: "mem-b1",
      content: "Brand Tone Rule: Direct, authoritative engineer-to-engineer tone with zero marketing fluff.",
      category: "brand",
      score: 0.97,
      created_at: "1 month ago",
      tags: ["brand_voice", "tone"],
      why_it_matters: "Enforces professional credibility in all generated drafts.",
    },
    {
      id: "mem-b2",
      content: "Forbidden Words List: 'game-changer', 'revolutionary', 'mind-blowing', 'magic', 'guaranteed virality'.",
      category: "brand",
      score: 0.99,
      created_at: "1 month ago",
      tags: ["brand_voice", "negative_constraints"],
      why_it_matters: "Prevents cringe promotional tropes from appearing in output.",
    },
  ];

  const baseTrend: MemoryItem[] = [
    {
      id: "mem-t1",
      content: "Trend observation: Early participation in 'AI Agents' while in RISING stage yielded peak ROI before competitor saturation.",
      category: "trend",
      score: 0.93,
      created_at: "3 weeks ago",
      tags: ["lifecycle", "timing"],
      why_it_matters: "Validates acting quickly on Rising signals before they become saturated.",
    },
  ];

  const baseDecision: MemoryItem[] = [
    {
      id: "mem-d1",
      content: "Strategic Mandate: Require a 3:1 ratio of educational code walkthroughs to conversion-oriented promotional posts.",
      category: "decision",
      score: 0.96,
      created_at: "2 weeks ago",
      tags: ["strategy", "cadence"],
      why_it_matters: "Preserves community trust while maintaining steady lead acquisition.",
    },
    {
      id: "mem-d2",
      content: "Pivot Decision: Shift focus away from generic industry news toward AI Agent Sandboxing & Reliability.",
      category: "decision",
      score: 0.98,
      created_at: "1 week ago",
      tags: ["strategy", "content_gap"],
      why_it_matters: "Directly addresses our largest 0% coverage opportunity.",
    },
  ];

  return {
    bank_id: "contentiq::acme-tech",
    total_memories: baseLearnings.length + basePerformance.length + baseAudience.length + baseBrand.length + baseTrend.length + baseDecision.length,
    categories: [
      { id: "learning", title: "Content Learnings", icon: "Brain", count: baseLearnings.length, memories: baseLearnings },
      { id: "performance", title: "Performance Benchmarks", icon: "BarChart3", count: basePerformance.length, memories: basePerformance },
      { id: "audience", title: "Audience Insights", icon: "Users", count: baseAudience.length, memories: baseAudience },
      { id: "brand", title: "Brand Voice Guidelines", icon: "Megaphone", count: baseBrand.length, memories: baseBrand },
      { id: "trend", title: "Trend History", icon: "Flame", count: baseTrend.length, memories: baseTrend },
      { id: "decision", title: "Strategic Decisions", icon: "Lightbulb", count: baseDecision.length, memories: baseDecision },
    ],
    evolution_timeline: [
      { day: "Day 1", event: "Cold Start: Initialized Hindsight bank contentiq::acme-tech with brand voice rules.", category: "brand" },
      { day: "Day 7", event: "First Experiment: Published LangGraph tutorial; achieved 2.4x median benchmark.", category: "performance" },
      { day: "Day 14", event: "Failure Ingestion: Generic AI news post underperformed at 0.4x median; retained failure pattern.", category: "learning" },
      { day: "Day 21", event: "Rule Synthesis: Established 3 educational touchpoints rule prior to product CTAs.", category: "decision" },
      { day: "Day 25", event: "Breakthrough: Docker sandboxing tutorial delivered record 3.2x median engagement.", category: "performance" },
      { day: "Today", event: "Hindsight Orchestrator proactively targeting 0% covered Security gap for Rising Agent trend.", category: "trend" },
    ],
  };
}

export async function getTrends(): Promise<TrendItem[]> {
  const data = await safeFetch<TrendItem[]>(`${API_BASE}/trends`);
  if (data) return data;
  return MOCK_TRENDS;
}

export async function analyzeTrend(trendId: string): Promise<any> {
  const data = await safeFetch<any>(`${API_BASE}/trends/${trendId}/analyze`, { method: "POST" });
  if (data) return data;

  const targetTrend = MOCK_TRENDS.find((t) => t.id === trendId) || MOCK_TRENDS[0];
  return {
    trend: targetTrend,
    opportunity: `Establish Category Authority in ${targetTrend.name} Security & Sandboxing`,
    why_it_matters: `Trend '${targetTrend.name}' is ${targetTrend.lifecycle_stage} with velocity ${targetTrend.velocity}x. While competitors publish high-level fluff, Acme can own the technical sandboxing niche.`,
    best_angle: `Hands-on Developer Implementation: Hardening and Sandboxing ${targetTrend.name}`,
    best_format: "Technical Tutorial & Code Carousel",
    best_platform: "LinkedIn + GitHub Blueprint",
    timing: `Immediate (${targetTrend.lifecycle_stage} phase window is open)`,
    hook: `We reviewed 50 production ${targetTrend.name} setups. 82% failed at the persistence layer. Here is the exact fix:`,
    cta: "Clone the open-source sandboxing Docker template from our GitHub repo in the comments.",
    risk: "Joining with a generic promotional post risks diluting developer brand equity (0.4x historical penalty).",
    evidence: [
      `Observed: Previous technical tutorial on ${targetTrend.name} outperformed company median by 3.2x.`,
      "Historical pattern: Generic commentary failed at 0.4x median.",
      "Audience Signal: Developer audience actively searches for practical production architectures.",
      "Content Gap: We have 0% coverage on 'AI Agent Security & Sandboxing'.",
    ],
    historical_memory_used: [
      {
        id: "mem-rec-1",
        content: "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
        category: "learning",
      },
      {
        id: "mem-rec-2",
        content: "Tutorial 'How to Sandbox Python Tool Calls in Docker for Autonomous Agents' scored 3.2x median.",
        category: "performance",
      },
      {
        id: "mem-rec-3",
        content: "Developer audience prioritizes security hardening, reproducible code, and benchmark figures.",
        category: "audience",
      },
    ],
    content_gap_aligned: "AI Agent Security & Sandboxing",
  };
}

export async function generateStrategy(
  query: string = "What should we post next?",
  trendId?: string,
  mode: string = "with_hindsight"
): Promise<StrategyResponse> {
  const data = await safeFetch<StrategyResponse>(`${API_BASE}/strategy/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, trend_id: trendId, mode, org_id: "acme-tech" }),
  });
  if (data) return data;

  const targetTrend = MOCK_TRENDS.find((t) => t.id === trendId) || MOCK_TRENDS[0];

  return {
    id: `strat-${Date.now()}`,
    mode,
    trend: targetTrend.name,
    why_it_matters: `Targeting '${targetTrend.name}' (${targetTrend.lifecycle_stage}, ${targetTrend.velocity}x velocity) aligns with our highest-intent developer audience while resolving our 0% coverage security content gap.`,
    historical_memory: [
      "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement.",
      "Generic opinion commentary underperforms at 0.4x median (cease generic posts).",
      "Audience prefers 3 educational touchpoints before introducing any product CTA.",
    ],
    audience_insight: "Developers and AI engineers ignore superficial hype and prioritize reproducible Docker templates and gVisor isolation blueprints.",
    content_gap: "AI Agent Security & Sandboxing (Surging search intent, 0 internal articles published)",
    recommended_angle: "Hands-on Code Tutorial: Docker Sandboxing for Autonomous Tool Calls",
    format: "Multi-slide Code Carousel + GitHub Blueprint",
    platform: "LinkedIn + GitHub Repository",
    timing: "Thursday 8:00 AM EST (Peak developer save window)",
    hook: "Stop letting autonomous agents execute shell commands on your host. Here's our production-grade Docker sandbox configuration:",
    cta: "Check the pinned comment for the full docker-compose.yml and pytest suite.",
    seven_day_plan: [
      {
        day: 1,
        phase: "Problem Discovery",
        title: "The Silent Failure Mode in Multi-Agent Execution",
        format: "LinkedIn Text + Architecture Diagram",
        platform: "LinkedIn",
        objective: "Establish credibility by breaking down why unchecked tool calls create host vulnerabilities.",
        hook: "We audited 50 autonomous agent pipelines. 82% execute shell tools without container isolation.",
      },
      {
        day: 2,
        phase: "Deep Dive Architecture",
        title: "Docker vs. gVisor: Sandboxing Agent Tool Calls",
        format: "Code Carousel (6 slides)",
        platform: "LinkedIn",
        objective: "Deliver tangible technical value with side-by-side benchmark latency comparison.",
        hook: "How to run Python tool calls in a throwaway container in under 120ms:",
      },
      {
        day: 3,
        phase: "Community Engagement",
        title: "Ask the Engineers: What is your biggest agent bottleneck?",
        format: "Interactive Poll & Technical Discussion",
        platform: "Twitter/X",
        objective: "Gather first-party audience signals and collect common failure modes for memory retention.",
        hook: "When your autonomous agent loop encounters an unhandled exception, what happens?",
      },
      {
        day: 4,
        phase: "Tactical Implementation",
        title: "Step-by-Step: Production Agent Sandboxing with LangGraph",
        format: "GitHub Blueprint + Markdown Guide",
        platform: "GitHub & Substack",
        objective: "Provide complete copy-pasteable repo implementing state-isolated tool execution.",
        hook: "Complete blueprint: Dockerized LangGraph runtime with memory persistence and security limits.",
      },
      {
        day: 5,
        phase: "Case Study & Benchmarks",
        title: "How We Cut Memory State Drift by 74% with Hindsight",
        format: "Engineering Case Study",
        platform: "LinkedIn",
        objective: "Showcase persistent memory architecture without generic promotional claims.",
        hook: "Most agents forget what they did 10 minutes ago. Here is how durable retain/recall fixed it:",
      },
      {
        day: 6,
        phase: "Micro-Tutorial",
        title: "3 Docker Flags Every Agent Engineer Needs to Set Today",
        format: "Short Code Snippet + Explainer",
        platform: "Twitter/X",
        objective: "Bite-sized, high-retweet tip for engineers scanning their feeds.",
        hook: "If you're using subprocess.Popen for agent tools, add these 3 flags right now:",
      },
      {
        day: 7,
        phase: "Synthesis & Community Call",
        title: "Weekly Engineering Roundup: Agent Security & Memory",
        format: "Longform Newsletter Edition",
        platform: "Newsletter",
        objective: "Summarize the week's learnings and invite developers to join our open-source repo.",
        hook: "Everything we learned running 100,000 sandboxed agent runs this week.",
      },
    ],
    success_metric: "3.0x+ median engagement (Benchmark: 10,000+ impressions, 500+ engagements, 80+ shares)",
    confidence_evidence: {
      "Historical Benchmark": "3.2x median achieved on previous Docker security tutorial.",
      "Audience Alignment": "Developers rate sandboxing code as their #1 operational pain point.",
      "Trend Momentum": "AI Agents & Sandboxing velocity is 3.2x in Rising stage.",
      "Hindsight Memory Validation": "Passed negative check: Zero generic hype words present.",
    },
    memories_used: [
      {
        id: "mem-u1",
        content: "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
        category: "learning",
      },
      {
        id: "mem-u2",
        content: "Code carousels produce 3.6x higher saves on LinkedIn compared to static architecture diagrams.",
        category: "performance",
      },
      {
        id: "mem-u3",
        content: "Mandate practical technical code angle for all future AI Agent and SLM campaigns.",
        category: "decision",
      },
    ],
    reflection_summary:
      "Cross-referencing historical benchmarks with our current content gaps indicates that our developer audience rewards practical sandboxing code with 3.2x median engagement. Conversely, publishing high-level commentary on this rising trend carries a 0.4x performance penalty.",
    generated_content: {
      linkedin:
        "Stop letting autonomous agents execute shell commands on your host.\n\nWe audited 50 production AI agent pipelines. 82% of them execute tool calls directly inside the host process without container boundaries.\n\nHere is how to containerize untrusted Python tool calls in throwaway Docker containers with sub-120ms spin-up:\n\n1. Use lightweight alpine images with pre-warmed runtimes\n2. Mount read-only scratch volumes with strict memory cgroups\n3. Enforce 10-second timeout limits on tool execution loops\n\nFull docker-compose.yml and LangGraph integration guide linked in the comments. 🛠️",
      twitter:
        "Running autonomous agent tool calls on your production host is an incident waiting to happen.\n\nHere's our 5-line Docker isolation wrapper that spins up a sandboxed runtime in <120ms:\n\n[Thread with code snippets 🧵👇]",
      newsletter:
        "Subject: Why your agent workflows need Docker sandboxing (and how we cut latency to 110ms)\n\nIn this week's technical deep dive, we're sharing the exact architecture we use to execute untrusted LLM-generated code safely without sacrificing pipeline throughput...",
    },
  };
}

export async function compareModes(query: string): Promise<BeforeAfterComparisonResponse> {
  const data = await safeFetch<BeforeAfterComparisonResponse>(`${API_BASE}/strategy/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (data) return data;

  return {
    query,
    mode_a_no_memory: {
      mode: "no_memory",
      trend: "AI Agents",
      why_it_matters: "AI Agents are popular right now and everyone is talking about automation.",
      historical_memory: [],
      audience_insight: "Generic audience interested in artificial intelligence and automation.",
      content_gap: "None detected (stateless agent has no catalog of previous content).",
      recommended_angle: "Generic Industry Overview: 5 Ways AI Agents Will Change Work in 2026",
      format: "Broad text post with stock illustration",
      platform: "LinkedIn",
      timing: "Anytime",
      hook: "AI agents are revolutionary! Are you ready for the autonomous future?",
      cta: "What are your thoughts on AI? Comment below!",
      seven_day_plan: [
        { day: 1, phase: "Intro", title: "What is an AI Agent?", format: "Text", platform: "LinkedIn", objective: "Define agents", hook: "Did you know AI can do tasks?" },
        { day: 2, phase: "Tools", title: "Top 5 Agent Tools", format: "Listicle", platform: "LinkedIn", objective: "List tools", hook: "Here are 5 cool tools:" },
        { day: 3, phase: "Future", title: "The Future of Agents", format: "Quote", platform: "Twitter", objective: "Inspire", hook: "AI will change everything." },
        { day: 4, phase: "Tips", title: "How to Prompt Agents", format: "Text", platform: "LinkedIn", objective: "Prompting tips", hook: "Prompting is key!" },
        { day: 5, phase: "Debate", title: "Will Agents Take Over?", format: "Poll", platform: "Twitter", objective: "Engage", hook: "Vote now!" },
        { day: 6, phase: "Summary", title: "Agent Weekly Recap", format: "Text", platform: "LinkedIn", objective: "Recap", hook: "What a week for AI!" },
        { day: 7, phase: "Promo", title: "Check Out Our Product", format: "Promotional", platform: "LinkedIn", objective: "Sell", hook: "Try our AI tool today!" },
      ],
      success_metric: "Unknown (no historical benchmarks available)",
      confidence_evidence: {
        "Memory Confidence": "0% (Stateless prompt-only LLM)",
        "Failure Risk": "High: Repeats generic 0.4x failure pattern that previously underperformed for Acme.",
      },
      memories_used: [],
      reflection_summary: "Generated solely from immediate token probability. No organizational awareness or historical grounding.",
    },
    mode_b_with_hindsight: {
      mode: "with_hindsight",
      trend: "AI Agents & Multi-Agent Workflows",
      why_it_matters: "Recalled that our developer audience responded with 3.2x median engagement to hands-on tutorials while generic news posts failed at 0.4x. Cross-referencing against our content gap highlights AI Agent Security & Sandboxing as the highest-ROI opportunity.",
      historical_memory: [
        "Retained: Tutorial 'How to Sandbox Python Tool Calls in Docker' achieved 3.2x median engagement.",
        "Retained: Generic commentary post 'Why AI is Changing Work' underperformed at 0.4x median.",
        "Retained Rule: Always provide 3 educational code touchpoints before introducing any product CTA.",
      ],
      audience_insight: "Developers ignore superficial speculation and aggressively save technical tutorials featuring reproducible Docker and LangGraph configurations.",
      content_gap: "AI Agent Security & Sandboxing (0% internal coverage, rising search intent)",
      recommended_angle: "Hands-on Code Tutorial: Docker Sandboxing for Autonomous Tool Calls",
      format: "Technical Tutorial & Code Carousel",
      platform: "LinkedIn + GitHub Blueprint",
      timing: "Thursday 8:00 AM EST (Optimal historical engineer engagement window)",
      hook: "Stop letting autonomous agents execute shell commands on your host. Here's our production-grade Docker sandbox configuration:",
      cta: "Clone the open-source sandboxing Docker template from our GitHub repo in the comments.",
      seven_day_plan: [
        { day: 1, phase: "Problem Discovery", title: "The Silent Failure Mode in Multi-Agent Execution", format: "LinkedIn Text + Diagram", platform: "LinkedIn", objective: "Audit 50 production pipelines", hook: "82% execute shell tools without container isolation." },
        { day: 2, phase: "Architecture", title: "Docker vs. gVisor: Sandboxing Agent Tool Calls", format: "Code Carousel", platform: "LinkedIn", objective: "Benchmark latency under 120ms", hook: "How to run Python tools in throwaway containers:" },
        { day: 3, phase: "Discussion", title: "What is your biggest agent bottleneck?", format: "Interactive Poll", platform: "Twitter/X", objective: "Collect audience failure modes", hook: "When your autonomous loop crashes, what happens?" },
        { day: 4, phase: "Implementation", title: "Production Agent Sandboxing with LangGraph", format: "GitHub Blueprint", platform: "GitHub", objective: "Complete reproducible repository", hook: "Complete blueprint: Dockerized LangGraph runtime." },
        { day: 5, phase: "Evidence", title: "How We Cut Memory State Drift by 74% with Hindsight", format: "Engineering Case Study", platform: "LinkedIn", objective: "Validate durable memory layer", hook: "Most agents forget what they did 10 minutes ago." },
        { day: 6, phase: "Micro-Tip", title: "3 Docker Flags Every Agent Engineer Needs", format: "Code Snippet", platform: "Twitter/X", objective: "High-save tactical tip", hook: "If you're using subprocess.Popen, add these flags:" },
        { day: 7, phase: "Synthesis", title: "Weekly Engineering Roundup: Agent Security", format: "Newsletter Edition", platform: "Newsletter", objective: "Educational community wrap-up", hook: "Everything we learned from 100,000 sandboxed runs." },
      ],
      success_metric: "3.2x median engagement target (based on historical benchmark in Hindsight bank contentiq::acme-tech)",
      confidence_evidence: {
        "Memory Grounding": "100% verified against Hindsight bank contentiq::acme-tech",
        "Benchmark Citation": "3.2x median historical engagement on similar security tutorial",
        "Negative Check": "Zero generic forbidden buzzwords detected",
        "Audience Rule": "Enforces 3 educational touchpoints prior to conversion CTA",
      },
      memories_used: [
        { id: "m1", content: "Technical tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x." },
        { id: "m2", content: "Code carousels produce 3.6x higher saves on LinkedIn compared to static images." },
        { id: "m3", content: "Developer audience prioritizes security hardening and reproducible code." },
      ],
      reflection_summary: "High-order strategic reasoning powered by Hindsight: Synthesized 3 weeks of campaign data to reject generic tropes and prescribe a verified, high-ROI technical roadmap.",
    },
    key_differences: [
      "Memory Grounding: Mode A relies on zero company history; Mode B recalls specific 3.2x tutorial benchmarks.",
      "Angle Precision: Mode A suggests a generic 'Future of AI' post (which historically failed at 0.4x); Mode B prescribes a technical Docker sandboxing tutorial.",
      "Audience Calibration: Mode B tailors format and tone for software engineers based on past save rates (3.6x higher for code carousels).",
      "Content Gap Alignment: Mode B cross-references existing catalog to target the 0% covered Security gap.",
      "Evidence-Backed Reasoning: Mode B cites exact metrics, past experiments, and brand rules justifying every recommendation.",
    ],
  };
}

export async function sendAgentChat(message: string, mode: string = "with_hindsight"): Promise<AgentChatResponse> {
  const data = await safeFetch<AgentChatResponse>(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode, org_id: "acme-tech" }),
  });
  if (data) return data;

  const lower = message.toLowerCase();

  if (lower.includes("learn") || lower.includes("learned")) {
    return {
      reply:
        "Based on our accumulated experience in Hindsight bank [contentiq::acme-tech], our key learning is that hands-on developer tutorials achieve 2.4x to 3.2x median engagement, whereas generic AI news roundups suffered a 60% penalty (0.4x median across 7 posts). Furthermore, LinkedIn code carousels drive 3.6x higher saves than static graphics.",
      mode,
      memories_retrieved: [
        { id: "m-learn-1", content: "Technical step-by-step tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x." },
        { id: "m-learn-2", content: "Code carousels produce 3.6x higher saves on LinkedIn compared to static architecture diagrams." },
      ],
      reflection: "Synthesized 5 historical campaigns to guide future content allocations.",
      decision: "Mandate practical technical code angle for all future AI Agent and SLM campaigns.",
    };
  }

  if (lower.includes("stop") || lower.includes("avoid") || lower.includes("bad")) {
    return {
      reply:
        "We should immediately stop publishing broad, generic AI news summaries. Our memory bank shows that 7 consecutive high-level commentary posts underperformed our company median by 60% (0.4x median performance). Developer audiences ignore generic commentary without reproducible code.",
      mode,
      memories_retrieved: [
        { id: "m-stop-1", content: "Weekly AI News Roundup underperformed by 60% (0.4x median across 7 posts)." },
        { id: "m-stop-2", content: "Forbidden Words List: 'game-changer', 'revolutionary', 'mind-blowing', 'magic'." },
      ],
      decision: "Cease all generic weekly news posts; redirect bandwidth to code tutorials.",
    };
  }

  if (lower.includes("remember") || lower.includes("note") || lower.includes("feedback")) {
    const newMem: MemoryItem = {
      id: `mem-user-${Date.now()}`,
      content: message,
      category: "learning",
      score: 1.0,
      created_at: "Just now",
      tags: ["user_feedback", "hindsight_retain"],
      why_it_matters: "Direct instruction from marketing strategist retained in Hindsight.",
    };
    inMemoryCustomMemories.unshift(newMem);

    return {
      reply: `🧠 Retained into Hindsight bank [contentiq::acme-tech]:\n\n«${message}»\n\nI have committed this to memory and will apply it when evaluating future trend opportunities and generating 7-day tactical roadmaps.`,
      mode,
      memories_retrieved: [],
      memory_retained: message,
      decision: "Updated active brand & audience memory rules in Hindsight.",
    };
  }

  // Default strategic advice
  return {
    reply:
      "I recommend prioritizing 'AI Agent Security & Sandboxing' right now. Trend Radar signals show the AI Agents trend is in its RISING stage (94.5 momentum, 3.2x velocity), while our internal content gap analysis shows we have 0% coverage on agent security. Based on our historical 3.2x median win with Docker tutorials, a hands-on code carousel will establish Acme as an engineering authority before the topic becomes saturated.",
    mode,
    memories_retrieved: [
      { id: "m-def-1", content: "Tutorial 'How to Sandbox Python Tool Calls in Docker for Autonomous Agents' scored 3.2x median." },
      { id: "m-def-2", content: "Developer audience prioritizes security hardening, reproducible code, and benchmark figures." },
      { id: "m-def-3", content: "Early participation in emerging trends with a technical implementation angle delivers peak viral distribution." },
    ],
    reflection: "Cross-referenced Rising trend velocity with historical 3.2x tutorial win and 0% coverage security gap.",
    decision: "Target AI Agent Security & Sandboxing via multi-slide code carousel.",
  };
}

export async function publishAndLearn(data: ContentPublishAndLearnRequest): Promise<ContentPublishAndLearnResponse> {
  const result = await safeFetch<ContentPublishAndLearnResponse>(`${API_BASE}/performance/publish-and-learn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (result) return result;

  const engRate = (data.engagements / Math.max(data.impressions, 1)) * 100;
  const medianRate = 2.0;
  const relPerf = Number((engRate / medianRate).toFixed(2));

  let analysis = "";
  let retainedLearning = "";

  if (relPerf >= 2.0) {
    analysis = `Significant Outperformance: Achieved ${engRate.toFixed(1)}% engagement (${relPerf.toFixed(1)}x median benchmark). The combination of '${data.angle}' and '${data.format}' resonated deeply with software engineers, yielding ${data.shares} high-intent shares.`;
    retainedLearning = `Verified Outcome: '${data.title}' (${data.topic} / ${data.angle}) generated ${data.impressions.toLocaleString()} impressions and outperformed median content by ${relPerf.toFixed(1)}x. Technical tutorial formats remain our highest-ROI content lever.`;
  } else if (relPerf < 0.8) {
    analysis = `Underperformance: Achieved ${engRate.toFixed(1)}% engagement (${relPerf.toFixed(1)}x median benchmark). Angle '${data.angle}' proved too generic for developer expectations.`;
    retainedLearning = `Failure Learning: '${data.title}' underperformed at ${relPerf.toFixed(1)}x median. Confirming that generic commentary without reproducible code should be avoided for ${data.topic}.`;
  } else {
    analysis = `Baseline Performance: Achieved ${engRate.toFixed(1)}% engagement (${relPerf.toFixed(1)}x median benchmark).`;
    retainedLearning = `Content outcome recorded for ${data.title}: Performed at expected baseline (${relPerf.toFixed(1)}x).`;
  }

  const postId = `post-${Date.now()}`;
  inMemoryPublishedItems.unshift({
    id: postId,
    title: data.title,
    topic: data.topic,
    angle: data.angle,
    format: data.format,
    platform: "LinkedIn",
    impressions: data.impressions,
    engagements: data.engagements,
    shares: data.shares,
    engagement_rate: Number(engRate.toFixed(2)),
    relative_performance: relPerf,
    published_at: "Just now",
  });

  const memId = `mem-retained-${Date.now()}`;
  inMemoryCustomMemories.unshift({
    id: memId,
    content: retainedLearning,
    category: "learning",
    score: 1.0,
    created_at: "Just now",
    tags: ["performance_learning", "outcome", data.topic.toLowerCase().replace(/\s+/g, "_")],
    why_it_matters: `Recorded after analyzing published post '${data.title}'`,
  });

  return {
    content_id: postId,
    engagement_rate: Number(engRate.toFixed(2)),
    relative_performance: relPerf,
    performance_analysis: analysis,
    retained_learning: retainedLearning,
    hindsight_memory_id: memId,
  };
}

export async function getSimulationStep(step: number): Promise<any> {
  const data = await safeFetch<any>(`${API_BASE}/demo/timeline/${step}`);
  if (data) return data;

  const bankId = "contentiq::acme-tech";

  if (step === 1) {
    return {
      step: 1,
      title: "Interaction 1: Zero-Memory Initial Request",
      user_prompt: "What content should we create about AI?",
      agent_response:
        "You could create a post explaining AI and its benefits. Highlight how artificial intelligence is transforming various industries and ask your audience how they feel about the technology.",
      is_generic: true,
      memory_used: null,
      learning_status: "Agent has no company memory or historical benchmarks yet.",
    };
  } else if (step === 2) {
    const learningFact = "Our technical tutorials performed 2.8x better than generic posts; developers want code and architecture diagrams.";
    return {
      step: 2,
      title: "Interaction 2: Retaining First Learning in Hindsight",
      user_prompt: "Our technical tutorials performed better than generic posts. Remember that our developers want code and architectures.",
      agent_response: `🧠 Retained into Hindsight bank [${bankId}]:\n«${learningFact}»\nI will prioritize technical code walkthroughs and architectural diagrams over generic commentary in future strategy.`,
      memory_retained: learningFact,
      learning_status: "Retained 1 core audience preference rule in Hindsight.",
    };
  } else if (step === 3) {
    return {
      step: 3,
      title: "Interaction 3: Recalling Accumulated Learning",
      user_prompt: "What should we post about AI Agents?",
      agent_response:
        "Based on our retained learning that your developer audience strongly prefers technical code and architectures over generic posts, I recommend a hands-on tutorial: 'Building a Multi-Agent State Machine with LangGraph'. Include Docker configs and code snippets rather than high-level commentary.",
      memories_recalled: [
        "Our technical tutorials performed 2.8x better than generic posts; developers want code and architecture diagrams.",
        "Developer audience prioritizes security hardening, reproducible code, and benchmark figures.",
      ],
      learning_status: "Agent recalled Interaction 2 learning and adapted strategy from generic to technical.",
    };
  } else if (step === 4) {
    const outcomeLearning = "Outcome Retained: LangGraph tutorial achieved 3.2x median performance (12,400 impressions, 680 engagements).";
    return {
      step: 4,
      title: "Interaction 4: Retaining Quantitative Outcome ($3.2\\times$ Win)",
      user_prompt: "The LangGraph tutorial got 12,400 impressions and 680 engagements (3.2x median). What did you learn?",
      agent_response: `🧠 Performance Outcome Retained into Hindsight bank [${bankId}]:\n«${outcomeLearning}»\nI have updated our performance benchmark multiplier for AI Agent technical tutorials to 3.2x median.`,
      memory_retained: outcomeLearning,
      learning_status: "Retained quantitative validation confirming technical format superiority.",
    };
  } else {
    return {
      step: 5,
      title: "Interaction 5: Compound Intelligence on New Trends",
      user_prompt: "There's a new trend in Local SLMs. What should we do?",
      agent_response:
        "I analyzed the emerging 'Local SLMs' trend (velocity 2.8x) through the lens of all accumulated Hindsight memories:\n\n1. RECALLED RULE: Developers demand code walkthroughs (Interaction 2).\n2. RECALLED WIN: Technical step-by-step tutorials deliver 3.2x median ROI (Interaction 4).\n3. RECALLED FAILURE: Generic commentary produced 0.4x failure (Historical Memory).\n4. CONTENT GAP: We have 0% coverage on edge quantization.\n\nRECOMMENDED STRATEGY:\nA multi-slide code carousel titled 'Running Llama-3-8B Locally via vLLM with Custom Tool Calling' with a GitHub Docker template.",
      memories_recalled: [
        "Technical tutorials achieve 2.4x–3.2x median engagement; generic commentary underperforms at 0.4x.",
        "LangGraph tutorial achieved 3.2x median performance.",
        "Developer audience prioritizes reproducible code and Docker configs.",
      ],
      learning_status: "Compound Intelligence: Synthesizes 4 interactions and 24 accumulated memories to produce a flawless strategy.",
    };
  }
}

export async function getMemoryInsights(): Promise<any> {
  const data = await safeFetch<any>(`${API_BASE}/memory/insights`);
  if (data) return data;

  return {
    bank_id: "contentiq::acme-tech",
    insights:
      "Cross-referencing historical campaigns in Hindsight bank contentiq::acme-tech shows an unmistakable divergence in developer engagement. Technical step-by-step tutorials featuring reproducible Docker files and architecture diagrams consistently deliver 2.4x to 3.2x median engagement. Conversely, broad industry news roundups and opinion pieces experienced a 60% engagement drop (0.4x median). The highest-ROI unaddressed opportunity is AI Agent Security and Sandboxing.",
    key_takeaways: [
      "Technical code walkthroughs generate 3.2x median engagement.",
      "Generic AI commentary consistently fails (0.4x median) with software developers.",
      "Code carousels yield 3.6x higher LinkedIn saves than static images.",
      "Security and Sandboxing is currently our highest-value unaddressed content gap.",
    ],
  };
}
