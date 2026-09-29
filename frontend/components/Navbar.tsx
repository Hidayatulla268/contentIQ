"use client";

import React from "react";
import { 
  Brain, 
  Flame, 
  Layers, 
  Sparkles, 
  GitCompare, 
  History, 
  MessageSquare, 
  PlusCircle,
  Database
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenWhatDidYouLearn: () => void;
  onOpenPublishModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWhatDidYouLearn,
  onOpenPublishModal,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "trends", label: "Trend Radar", icon: Flame },
    { id: "memory", label: "Memory Explorer", icon: Brain },
    { id: "compare", label: "Memory vs Stateless", icon: GitCompare },
    { id: "evolution", label: "Learning Timeline", icon: History },
    { id: "chat", label: "Strategy Chat", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[2px] glow-purple">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Content<span className="text-cyan-400">IQ</span></span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Hindsight 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              An AI Content Strategist That Remembers, Learns and Spots What&apos;s Next
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101623]/80 p-1.5 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/30 text-cyan-300 border border-violet-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Triggers & Bank Status */}
        <div className="flex items-center gap-2.5">
          {/* Section 49: What Did You Learn Button */}
          <button
            onClick={onOpenWhatDidYouLearn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-900/30 transition-all border border-violet-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>What Did You Learn?</span>
          </button>

          {/* Post & Learn outcome simulator */}
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162032] hover:bg-[#1f2d47] text-slate-200 border border-slate-700 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Post & Learn</span>
          </button>

          {/* Isolated Hindsight Bank Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0a0f19] border border-cyan-500/20 text-[11px] text-cyan-300">
            <Database className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>contentiq::acme-tech</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex lg:hidden overflow-x-auto gap-2 mt-3 pt-2 border-t border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
                isActive ? "bg-violet-600/40 text-cyan-300 border border-violet-500/30" : "text-slate-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
