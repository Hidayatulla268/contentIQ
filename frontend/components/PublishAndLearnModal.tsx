"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  BarChart3, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  X,
  Share2,
  Eye,
  MessageSquare
} from "lucide-react";
import { ContentPublishAndLearnRequest, ContentPublishAndLearnResponse, publishAndLearn } from "../lib/api";

interface PublishAndLearnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    title: string;
    topic: string;
    angle: string;
    format: string;
  };
  onSuccess: (res: ContentPublishAndLearnResponse) => void;
}

export const PublishAndLearnModal: React.FC<PublishAndLearnModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const [title, setTitle] = useState<string>(initialData?.title || "How to Secure Your First Production AI Agent");
  const [topic, setTopic] = useState<string>(initialData?.topic || "AI Agents");
  const [angle, setAngle] = useState<string>(initialData?.angle || "Technical Step-by-Step Tutorial");
  const [format, setFormat] = useState<string>(initialData?.format || "Technical Tutorial & Code Carousel");
  const [impressions, setImpressions] = useState<number>(12400);
  const [engagements, setEngagements] = useState<number>(680);
  const [shares, setShares] = useState<number>(93);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ContentPublishAndLearnResponse | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: ContentPublishAndLearnRequest = {
        title,
        topic,
        angle,
        format,
        impressions,
        engagements,
        shares,
        org_id: "acme-tech",
      };
      const res = await publishAndLearn(payload);
      setResult(res);
      onSuccess(res);
    } catch (err) {
      console.error("Failed to publish and learn:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 border border-emerald-500/40 space-y-5 glow-emerald max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Post-Publish Learning Loop</h3>
              <p className="text-[11px] text-slate-400">Section 35: Measure outcome &rarr; Retain learning in Hindsight</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Post Title */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#0a0f19] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Topic & Angle */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full bg-[#0a0f19] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Angle</label>
                <input
                  type="text"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  required
                  className="w-full bg-[#0a0f19] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Format</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                required
                className="w-full bg-[#0a0f19] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Performance Input Row */}
            <div className="p-3.5 rounded-xl bg-[#0e1625] border border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Recorded Campaign Metrics
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Impressions
                  </span>
                  <input
                    type="number"
                    value={impressions}
                    onChange={(e) => setImpressions(Number(e.target.value))}
                    required
                    className="w-full bg-[#070b13] border border-white/10 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-violet-400" /> Engagements
                  </span>
                  <input
                    type="number"
                    value={engagements}
                    onChange={(e) => setEngagements(Number(e.target.value))}
                    required
                    className="w-full bg-[#070b13] border border-white/10 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-emerald-400" /> Shares
                  </span>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    required
                    className="w-full bg-[#070b13] border border-white/10 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                <span>Analyze & Retain into Hindsight</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Outcome Success State */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Outcome Ingested & Retained into Hindsight!</span>
              </div>
              <div className="flex items-center gap-4 text-slate-200 pt-1">
                <span>Engagement Rate: <strong className="text-white font-mono">{result.engagement_rate}%</strong></span>
                <span>Relative Performance: <strong className="text-emerald-400 font-mono">{result.relative_performance}x Median</strong></span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090e18] border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Analysis:</span>
              <p className="text-slate-200 leading-relaxed">{result.performance_analysis}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1">
              <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                Permanent Hindsight Memory Retained:
              </span>
              <p className="text-slate-100 font-mono text-[11px] leading-relaxed">&laquo;{result.retained_learning}&raquo;</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setResult(null);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
