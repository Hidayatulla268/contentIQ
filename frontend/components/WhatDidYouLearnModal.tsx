"use client";

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  X, 
  TrendingUp, 
  Target, 
  Megaphone, 
  Flame, 
  RefreshCw 
} from "lucide-react";
import { getMemoryInsights } from "../lib/api";

interface WhatDidYouLearnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatDidYouLearnModal: React.FC<WhatDidYouLearnModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadInsights();
    }
  }, [isOpen]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await getMemoryInsights();
      setData(res);
    } catch (e) {
      console.error("Failed to load insights:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-violet-500/40 space-y-5 glow-purple max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">What Did ContentIQ Learn?</h3>
              <p className="text-[11px] text-slate-400">Section 49: Executive synthesis of accumulated experience in Hindsight</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Synthesizing memories with Hindsight areflect()...</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Hindsight Bank Synthesis */}
            <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-2">
              <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider block">
                Hindsight Reflect Synthesis:
              </span>
              <p className="text-slate-200 leading-relaxed whitespace-pre-line font-mono text-[11px]">
                {data?.insights || "Synthesized 8 durable memories across campaigns, failures, and audience signals."}
              </p>
            </div>

            {/* Core Pillars Learned */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0e1524] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Successful Playbook</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Technical code walkthroughs &amp; architecture carousels deliver <strong>2.4x–3.2x median engagement</strong> with a 3.6x save rate.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1524] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>Failed Patterns (Avoid)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Generic AI news commentary failed at <strong>0.4x median</strong> (0 shares). Developer audiences dismiss broad speculation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1524] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Target className="w-4 h-4" />
                  <span>Audience Reality</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Engineers respond to production sandboxing, Docker configs, and memory isolation. Requires 3 educational posts before any CTA.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1524] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Flame className="w-4 h-4" />
                  <span>Trend Timing Rule</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Join in the <strong>Rising phase (Days 3–7)</strong> with an uncontested technical security angle for peak distribution.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-900/30"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
