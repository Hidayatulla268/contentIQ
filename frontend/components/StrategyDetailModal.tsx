"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Brain, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Share2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Target, 
  Layers, 
  TrendingUp, 
  X,
  FileText
} from "lucide-react";
import { StrategyResponse } from "../lib/api";

interface StrategyDetailModalProps {
  strategy: StrategyResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPublishModal: (title: string, topic: string, angle: string, format: string) => void;
}

export const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({
  strategy,
  isOpen,
  onClose,
  onOpenPublishModal,
}) => {
  const [showWhyExplainer, setShowWhyExplainer] = useState<boolean>(false);
  const [selectedChannelTab, setSelectedChannelTab] = useState<"linkedin" | "twitter" | "newsletter">("linkedin");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !strategy) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-4xl w-full rounded-2xl p-6 border border-cyan-500/40 space-y-6 max-h-[92vh] overflow-y-auto glow-purple">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Strategic Campaign Blueprint
              </span>
              <span className="text-xs text-slate-400">Trend: <strong className="text-slate-200">{strategy.trend}</strong></span>
              <span className="text-xs text-violet-300 font-mono">bank: contentiq::acme-tech</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{strategy.recommended_angle}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 50: The "WHY?" Button Bar */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 to-cyan-950/40 border border-violet-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Hindsight Memory Synthesis
              </h3>
            </div>
            <button
              onClick={() => setShowWhyExplainer(!showWhyExplainer)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-violet-600/30 hover:bg-violet-600/50 text-cyan-300 border border-violet-500/40 transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showWhyExplainer ? "Hide Why?" : "Why Did I Recommend This?"}</span>
              {showWhyExplainer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Section 50 & 51 Confidence Evidence Accordion */}
          {showWhyExplainer ? (
            <div className="pt-2 border-t border-white/10 space-y-2.5 text-xs animate-fadeIn">
              <p className="text-slate-300 leading-relaxed">
                <strong>Formula:</strong> Historical Memory + Current Trend + Audience Evidence + Performance Benchmark = Recommendation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(strategy.confidence_evidence || {}).map(([key, val], idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0a0f1a] border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">{key}</span>
                    <p className="text-slate-300 leading-snug">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-300/90 leading-relaxed">
              &laquo;We tried something similar three weeks ago. It underperformed because the angle was too generic (0.4x median). 
              Our technical tutorial on AI agents outperformed by 3.2x because developers crave implementation details. 
              I recommend a technical sandboxing angle this time to fill our unrepresented content gap.&raquo;
            </p>
          )}
        </div>

        {/* Section 32 Tactical Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0e1422] border border-white/5">
            <span className="text-slate-400 block text-[11px]">Format & Channel</span>
            <strong className="text-white text-xs">{strategy.format} on {strategy.platform}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0e1422] border border-white/5">
            <span className="text-slate-400 block text-[11px]">Recommended Timing</span>
            <strong className="text-cyan-300 text-xs">{strategy.timing}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0e1422] border border-white/5">
            <span className="text-slate-400 block text-[11px]">Content Gap Aligned</span>
            <strong className="text-amber-300 text-xs">{strategy.content_gap}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0e1422] border border-white/5">
            <span className="text-slate-400 block text-[11px]">Success Benchmark Target</span>
            <strong className="text-emerald-300 text-xs">{strategy.success_metric}</strong>
          </div>
        </div>

        {/* Hook and CTA Card */}
        <div className="p-4 rounded-xl bg-[#0b101c] border border-white/10 space-y-2 text-xs">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              High-Conversion Opening Hook (Aligned with Historical 3.6x Save Multiplier):
            </span>
            <p className="text-slate-100 font-mono italic text-xs leading-relaxed bg-[#060910] p-3 rounded-lg border border-white/5">
              &ldquo;{strategy.hook}&rdquo;
            </p>
          </div>
          <div className="text-slate-300 pt-1">
            <strong>Call to Action (CTA): </strong> {strategy.cta}
          </div>
        </div>

        {/* Section 33: 7-Day Strategy Generator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">7-Day Sequenced Content Plan</h3>
            </div>
            <span className="text-xs text-slate-400">Justified by Historical Memory</span>
          </div>

          <div className="space-y-2">
            {strategy.seven_day_plan.map((day) => (
              <div
                key={day.day}
                className="p-3 rounded-xl bg-[#0e1524] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-12 py-1 rounded-lg bg-violet-600/30 text-cyan-300 font-bold text-center shrink-0 font-mono">
                    Day {day.day}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{day.title}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">{day.format}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{day.objective}</p>
                  </div>
                </div>
                <div className="text-[11px] text-cyan-400/90 font-mono italic max-w-xs truncate">
                  &ldquo;{day.hook}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 34: Multi-Channel Content Copy Tabs */}
        {strategy.generated_content && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Generated Content Drafts</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0a0f19] p-1 rounded-lg border border-white/5">
                {(["linkedin", "twitter", "newsletter"] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannelTab(ch)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                      selectedChannelTab === ch
                        ? "bg-violet-600/40 text-cyan-300 border border-violet-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-[#070b13] border border-white/10 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {strategy.generated_content[selectedChannelTab]}
              </pre>
              <button
                onClick={() => handleCopy(strategy.generated_content![selectedChannelTab])}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Strategy approved & stored in decision log</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPublishModal(
                  strategy.recommended_angle,
                  strategy.trend || "AI Agents",
                  "Technical Tutorial",
                  strategy.format
                );
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate Publishing & Measure Outcome</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
