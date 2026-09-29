"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Database, 
  User, 
  Bot, 
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { getSimulationStep } from "../lib/api";

export const LearningEvolutionView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [stepData, setStepData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const steps = [
    { num: 1, title: "1. Stateless Baseline", desc: "Generic prompt without memory" },
    { num: 2, title: "2. Teaching Feedback", desc: "User inputs audience learning" },
    { num: 3, title: "3. Recalling Feedback", desc: "Recalls learning for AI Agents" },
    { num: 4, title: "4. Measuring Outcome", desc: "3.2x win retained in Hindsight" },
    { num: 5, title: "5. Compound Intelligence", desc: "Synthesizes complete experience" },
  ];

  const loadStep = async (stepNum: number) => {
    setActiveStep(stepNum);
    setLoading(true);
    try {
      const res = await getSimulationStep(stepNum);
      setStepData(res);
    } catch (e) {
      console.error("Failed to load step:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStep(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold text-white">The Learning Over Time Simulation</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 26 Demo: Watch the agent evolve from a generic baseline in Interaction 1 to an evidence-backed marketing strategist in Interaction 5.
          </p>
        </div>

        <button
          onClick={() => loadStep(1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#121927] hover:bg-[#1a2337] text-slate-300 border border-white/5 transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((st) => {
          const isActive = activeStep === st.num;
          const isCompleted = activeStep > st.num;
          return (
            <button
              key={st.num}
              onClick={() => loadStep(st.num)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? "bg-violet-950/40 border-violet-500 shadow-md glow-purple"
                  : isCompleted
                  ? "bg-[#0d131f] border-cyan-500/30 text-slate-300"
                  : "bg-[#0b0e17] border-white/5 text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold ${isActive ? "text-cyan-300" : isCompleted ? "text-cyan-400" : "text-slate-500"}`}>
                  Step {st.num}
                </span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <h4 className="text-xs font-semibold text-slate-100 truncate">{st.title.replace(/^\d+\.\s*/, "")}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{st.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Step Interaction Container */}
      {stepData && (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Simulation Stage {activeStep} of 5
              </span>
              <h3 className="text-base font-bold text-white">{stepData.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Hindsight: contentiq::acme-tech</span>
            </div>
          </div>

          {/* User Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <User className="w-4 h-4 text-cyan-400" />
              <span>User Interaction:</span>
            </div>
            <div className="p-4 rounded-xl bg-[#090d16] border border-white/10 text-xs font-mono text-cyan-200">
              &laquo;{stepData.user_prompt}&raquo;
            </div>
          </div>

          {/* Agent Response */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
              <Bot className="w-4 h-4" />
              <span>ContentIQ Response:</span>
            </div>
            <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-line ${
              stepData.is_generic 
                ? "bg-black/40 border-rose-500/20 text-slate-300 italic" 
                : "bg-violet-950/30 border-violet-500/30 text-slate-100"
            }`}>
              {stepData.agent_response}
            </div>
          </div>

          {/* Learning State & Impact */}
          <div className="p-3.5 rounded-xl bg-[#0b101a] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300">
                <strong>Learning State: </strong>
                {stepData.learning_status}
              </span>
            </div>

            {activeStep < 5 ? (
              <button
                onClick={() => loadStep(activeStep + 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md shadow-violet-900/30 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <span>Proceed to Step {activeStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Continuous Learning Loop Demonstrated!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
