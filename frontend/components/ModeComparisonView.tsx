"use client";

import React, { useState } from "react";
import { 
  GitCompare, 
  Brain, 
  Sparkles, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  BarChart3, 
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { BeforeAfterComparisonResponse, compareModes } from "../lib/api";

export const ModeComparisonView: React.FC = () => {
  const [query, setQuery] = useState<string>("AI Agents are trending. What should we post?");
  const [data, setData] = useState<BeforeAfterComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunComparison = async (q?: string) => {
    const targetQuery = q || query;
    setLoading(true);
    try {
      const res = await compareModes(targetQuery);
      setData(res);
    } catch (e) {
      console.error("Failed to compare modes:", e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial comparison on mount if empty
  React.useEffect(() => {
    handleRunComparison();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Without Memory vs With Hindsight</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 25 Demo: Visual proof of how persistent memory transforms a generic chatbot into a company-specific strategist.
          </p>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            "AI Agents are trending. What should we post?",
            "What should our brand post about AI Coding?",
            "How can we join the new Edge AI trend?",
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(promptText);
                handleRunComparison(promptText);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#101623] hover:bg-[#161f30] text-slate-300 border border-white/5 transition-all"
            >
              {promptText.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a strategic marketing question..."
          className="flex-1 w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => handleRunComparison()}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-900/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Run Side-by-Side Comparison</span>
        </button>
      </div>

      {/* Side-by-Side Cards */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mode A: Stateless / No Memory */}
          <div className="glass-card rounded-2xl p-6 border border-rose-500/20 space-y-4 relative overflow-hidden bg-gradient-to-b from-[#141219] to-[#0c0d13]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mode A: Stateless AI</h3>
                  <span className="text-[10px] text-rose-400 font-mono">Zero Memory Retained</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Generic LLM Prompt
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/10 space-y-1">
                <span className="text-slate-400 text-[11px] block font-semibold">Recommended Angle:</span>
                <p className="text-slate-200">{data.mode_a_no_memory.recommended_angle}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/10 space-y-1">
                <span className="text-slate-400 text-[11px] block font-semibold">Why It Recommended This:</span>
                <p className="text-slate-300 leading-relaxed">{data.mode_a_no_memory.why_it_matters}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/10 space-y-1">
                <span className="text-slate-400 text-[11px] block font-semibold">Sample Hook & CTA:</span>
                <p className="text-slate-300 italic">&ldquo;{data.mode_a_no_memory.hook}&rdquo;</p>
                <p className="text-slate-400 text-[11px] mt-1">CTA: {data.mode_a_no_memory.cta}</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300/90 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Flaw:</strong> Has no idea that Acme ran a generic AI commentary 3 weeks ago that failed at 0.4x median. 
                  Repeats the same low-performing strategy.
                </span>
              </div>
            </div>
          </div>

          {/* Mode B: With Hindsight Persistent Memory */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/40 space-y-4 relative overflow-hidden bg-gradient-to-b from-[#0c1825] to-[#09111b] glow-cyan">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Mode B: ContentIQ + Hindsight</h3>
                  <span className="text-[10px] text-cyan-300 font-mono">Bank: contentiq::acme-tech</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                Evidence-Based Learning
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                <span className="text-cyan-400 text-[11px] block font-semibold">Recommended Strategic Angle:</span>
                <p className="text-white font-semibold">{data.mode_b_with_hindsight.recommended_angle}</p>
                <span className="text-[11px] text-slate-300 block">
                  Format: <strong>{data.mode_b_with_hindsight.format}</strong> on <strong>{data.mode_b_with_hindsight.platform}</strong>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#09121d] border border-white/5 space-y-1.5">
                <span className="text-violet-400 text-[11px] block font-semibold">Recalled Memory Evidence:</span>
                <div className="space-y-1">
                  {data.mode_b_with_hindsight.historical_memory.slice(0, 3).map((mem, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{mem}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#09121d] border border-white/5 space-y-1">
                <span className="text-cyan-300 text-[11px] block font-semibold">Differentiated High-Intent Hook:</span>
                <p className="text-slate-100 font-mono italic text-[11px]">&ldquo;{data.mode_b_with_hindsight.hook}&rdquo;</p>
                <p className="text-slate-300 text-[11px] mt-1">CTA: {data.mode_b_with_hindsight.cta}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Advantage:</strong> Leverages the historical 3.2x tutorial win, respects developer audience code expectations, 
                  and fills the unaddressed security content gap.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Strategic Differences Card */}
      {data && (
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Why Hindsight Memory Matters: Key Differentiators</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {data.key_differences.map((diff, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#101622] border border-white/5 flex items-start gap-2.5 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-violet-600/30 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{diff}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
