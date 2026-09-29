"use client";

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  BarChart3, 
  Users, 
  Megaphone, 
  Flame, 
  Lightbulb, 
  FlaskConical, 
  FileText, 
  Search, 
  Clock, 
  ShieldCheck, 
  Database, 
  Sparkles,
  ChevronRight,
  Terminal,
  Layers
} from "lucide-react";
import { MemoryExplorerData, MemoryItem, getMemoryExplorer } from "../lib/api";

export const MemoryExplorerView: React.FC = () => {
  const [data, setData] = useState<MemoryExplorerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("learning");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMemoryExplorer();
        setData(res);
        if (res.categories.length > 0) {
          const firstWithMem = res.categories.find(c => c.memories.length > 0) || res.categories[0];
          setSelectedCategory(firstWithMem.id);
          if (firstWithMem.memories.length > 0) {
            setSelectedMemory(firstWithMem.memories[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load memory explorer:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading Hindsight memory bank...</p>
      </div>
    );
  }

  const currentCategoryObj = data.categories.find(c => c.id === selectedCategory);
  const memoriesList = currentCategoryObj?.memories || [];

  const filteredMemories = searchQuery
    ? memoriesList.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : memoriesList;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "learning": return <Brain className="w-4 h-4 text-violet-400" />;
      case "performance": return <BarChart3 className="w-4 h-4 text-cyan-400" />;
      case "audience_insight": return <Users className="w-4 h-4 text-indigo-400" />;
      case "brand_voice": return <Megaphone className="w-4 h-4 text-amber-400" />;
      case "trend": return <Flame className="w-4 h-4 text-rose-400" />;
      case "decision": return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case "experiment": return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case "content": return <FileText className="w-4 h-4 text-blue-400" />;
      default: return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold text-white">What My Agent Remembers</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual inspection of durable knowledge, benchmarks, failure memories, and decisions retained in Hindsight.
          </p>
        </div>

        {/* Bank Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1420] border border-cyan-500/20 text-xs">
          <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">Bank: <strong className="text-cyan-300 font-mono">{data.bank_id}</strong></span>
          <span className="ml-2 px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-semibold text-[10px]">
            {data.total_memories} Units
          </span>
        </div>
      </div>

      {/* Main Grid: Categories on Left, List in Center, Inspector on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Categories (Section 27) */}
        <div className="md:col-span-3 space-y-1.5">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Memory Categories</h2>
          {data.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.memories.length > 0) {
                    setSelectedMemory(cat.memories[0]);
                  } else {
                    setSelectedMemory(null);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-violet-600/30 text-cyan-300 border border-violet-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getCategoryIcon(cat.id)}
                  <span className="truncate">{cat.title.replace(/^[^\w\s]+\s*/, "")}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}

          {/* Memory Evolution Timeline (Section 48) */}
          <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Evolution Timeline</h2>
            <div className="space-y-2 text-[11px] text-slate-400">
              {data.evolution_timeline.map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-[#0e1420] border border-white/5">
                  <span className="font-bold text-cyan-400">{item.day}: </span>
                  <span className="text-slate-300">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Memory Items List */}
        <div className="md:col-span-4 glass-panel rounded-2xl p-4 border border-white/10 space-y-3 flex flex-col h-[650px]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search recalled memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0f19] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMemories.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No memories stored in this category.</p>
            ) : (
              filteredMemories.map((mem) => {
                const isSelected = selectedMemory?.id === mem.id;
                return (
                  <div
                    key={mem.id}
                    onClick={() => setSelectedMemory(mem)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-xs ${
                      isSelected
                        ? "bg-violet-950/40 border-violet-500/50 shadow-md"
                        : "bg-[#111724]/70 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <p className="text-slate-200 line-clamp-3 leading-relaxed">{mem.content}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Clock className="w-3 h-3" />
                        <span>Indexed</span>
                      </span>
                      <span className="font-mono text-violet-300">ID: {mem.id.slice(0, 8)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Memory Inspector Details (Section 27) */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col h-[650px] overflow-y-auto">
          {selectedMemory ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Memory Unit Inspection</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {selectedMemory.category?.toUpperCase()}
                </span>
              </div>

              {/* What Was Remembered */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">What Was Remembered</span>
                <div className="p-3.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-slate-100 leading-relaxed font-mono">
                  {selectedMemory.content}
                </div>
              </div>

              {/* Why It Matters */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">Why It Matters</span>
                <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-200 leading-relaxed">
                  {selectedMemory.why_it_matters || "Serves as an empirical strategic benchmark to avoid repeating past generic failures."}
                </div>
              </div>

              {/* Where It Was Used / Agent Impact */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Where It Was Used</span>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed">
                  Automatically recalled in the <strong>Strategy Orchestrator</strong> when evaluating upcoming AI Agent and developer campaigns to mandate code tutorials.
                </div>
              </div>

              {/* Metadata & Tags */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Hindsight Memory ID</span>
                  <span className="font-mono text-slate-300">{selectedMemory.id}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Storage Engine</span>
                  <span className="text-cyan-300 font-semibold">Hindsight aretain() Vector Store</span>
                </div>
                {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemory.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <Brain className="w-8 h-8 text-slate-600 mb-2" />
              <span>Select a memory unit on the left to inspect its details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
