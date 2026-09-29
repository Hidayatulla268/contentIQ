"use client";

import React from "react";
import { 
  Flame, 
  Brain, 
  Lightbulb, 
  BarChart3, 
  ArrowUpRight, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  Zap
} from "lucide-react";
import { DashboardData, TrendItem } from "../lib/api";

interface DashboardOverviewProps {
  data: DashboardData | null;
  loading: boolean;
  onSelectTrend: (trend: TrendItem) => void;
  onTriggerStrategy: (trendId?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  loading,
  onSelectTrend,
  onTriggerStrategy,
  onNavigateTab,
}) => {
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading ContentIQ persistent memory & trends...</p>
      </div>
    );
  }

  const getLifecycleColor = (stage: string) => {
    switch (stage) {
      case "EMERGING": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "RISING": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "TRENDING": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "SATURATED": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "DECLINING": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Hindsight Memory Advantage */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#0e1627] to-[#0b1322] border border-violet-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Persistent Hindsight Memory Active
              </span>
              <span className="text-xs text-slate-400">Org: <strong className="text-slate-200">{data.organization_name}</strong></span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Content Intelligence & Strategy Radar
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Unlike generic content tools that generate one-off posts from scratch, ContentIQ retains campaign outcomes, 
              audience feedback, and brand voice in Hindsight to recommend evidence-backed strategies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab("compare")}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span>See Before & After</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTriggerStrategy()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-lg shadow-violet-900/40 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>What Should We Post Next?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Fatigue Alert (Section 22) */}
      {data.content_fatigue_alert && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300">Audience Fatigue Detection:</span>
            <p className="text-amber-200/90">{data.content_fatigue_alert}</p>
          </div>
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Retained Memories</span>
            <Brain className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total_memories_count}</div>
          <p className="text-[11px] text-violet-300 mt-1">Hindsight Memory Units</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tracked Trends</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.active_trends_count}</div>
          <p className="text-[11px] text-cyan-300 mt-1">Multi-Source Radar</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Top Performing Angle</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{data.top_topic}</div>
          <p className="text-[11px] text-emerald-300 mt-1">3.2x Median Multiplier</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Top Asset Format</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{data.top_format}</div>
          <p className="text-[11px] text-amber-300 mt-1">3.6x Higher Saves</p>
        </div>
      </div>

      {/* Primary Grid: Trend Radar & What I Learned */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trend Radar (Section 17, 18, 30) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Trend Radar</h2>
            </div>
            <button
              onClick={() => onNavigateTab("trends")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>View Full Radar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Current public signals monitored across GitHub, Hacker News, Reddit, and Dev publications.
          </p>

          <div className="space-y-3">
            {data.trend_radar.slice(0, 4).map((trend) => (
              <div
                key={trend.id}
                className="p-3.5 rounded-xl bg-[#111724]/70 hover:bg-[#161f30] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{trend.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getLifecycleColor(trend.lifecycle_stage)}`}>
                      {trend.lifecycle_stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Momentum: <strong className="text-cyan-400">{trend.momentum_score}</strong>/100</span>
                    <span>Velocity: <strong className="text-emerald-400">+{trend.velocity}x</strong></span>
                    <span>Sources: {trend.source_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTrend(trend)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => onTriggerStrategy(trend.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/30 hover:bg-violet-600/50 text-cyan-300 border border-violet-500/40 transition-all"
                  >
                    Join Trend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: What I Learned & Content Gaps (Section 21, 30) */}
        <div className="lg:col-span-5 space-y-6">
          {/* What I Learned (Section 30) */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-400" />
                <h2 className="text-base font-bold text-white">What I Learned</h2>
              </div>
              <button
                onClick={() => onNavigateTab("memory")}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium"
              >
                Explorer
              </button>
            </div>

            <div className="space-y-2.5">
              {data.top_learnings.map((learning, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{learning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Gaps Matrix (Section 21) */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Content Gap Radar</h2>
              </div>
              <span className="text-[11px] text-slate-400">Opportunity Index</span>
            </div>

            <div className="space-y-2.5">
              {data.content_gaps.map((gap, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#101622] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{gap.topic}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      gap.coverage_level === "NONE" ? "bg-rose-500/20 text-rose-400" :
                      gap.coverage_level === "LOW" ? "bg-amber-500/20 text-amber-400" :
                      "bg-slate-700 text-slate-300"
                    }`}>
                      {gap.coverage_level}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        gap.coverage_level === "NONE" ? "bg-rose-500" :
                        gap.coverage_level === "LOW" ? "bg-amber-500" : "bg-cyan-500"
                      }`}
                      style={{ width: `${Math.max(gap.coverage_percent, 6)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{gap.status_note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action Card (Section 30) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#101726] to-violet-950/30 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase tracking-wide">
              Top Agent Recommendation
            </span>
            <span className="text-xs text-slate-400">Aligned with 3.2x Historical Multiplier</span>
          </div>
          <h3 className="text-lg font-bold text-white">{data.recommended_action.title}</h3>
          <p className="text-xs text-slate-300 max-w-3xl">
            {data.recommended_action.reason} Format: <strong>{data.recommended_action.format}</strong> on <strong>{data.recommended_action.platform}</strong>.
          </p>
        </div>
        <button
          onClick={() => onTriggerStrategy()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>Generate Strategic Brief</span>
        </button>
      </div>

      {/* Recent Published Content Table with Relative Performance */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Historical Content & Validated Benchmarks</h2>
          </div>
          <span className="text-xs text-slate-400">Indexed in Hindsight Bank</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="pb-3 font-medium">Content Title</th>
                <th className="pb-3 font-medium">Topic & Angle</th>
                <th className="pb-3 font-medium">Format</th>
                <th className="pb-3 font-medium">Impressions</th>
                <th className="pb-3 font-medium">Engagements</th>
                <th className="pb-3 font-medium">Multiplier</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {data.recent_published_content.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium text-slate-100 max-w-xs truncate">{item.title}</td>
                  <td className="py-3 text-slate-400">{item.topic} &middot; <span className="text-slate-300">{item.angle}</span></td>
                  <td className="py-3">{item.format}</td>
                  <td className="py-3">{item.impressions.toLocaleString()}</td>
                  <td className="py-3">{item.engagements} ({item.engagement_rate}%)</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.relative_performance >= 2.0 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      item.relative_performance < 0.8 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                      "bg-slate-700 text-slate-300"
                    }`}>
                      {item.relative_performance}x median
                    </span>
                  </td>
                  <td className="py-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Memory Retained</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
