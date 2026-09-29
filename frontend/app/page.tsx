"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { DashboardOverview } from "../components/DashboardOverview";
import { TrendRadarView } from "../components/TrendRadarView";
import { MemoryExplorerView } from "../components/MemoryExplorerView";
import { ModeComparisonView } from "../components/ModeComparisonView";
import { LearningEvolutionView } from "../components/LearningEvolutionView";
import { StrategyChatView } from "../components/StrategyChatView";
import { StrategyDetailModal } from "../components/StrategyDetailModal";
import { PublishAndLearnModal } from "../components/PublishAndLearnModal";
import { WhatDidYouLearnModal } from "../components/WhatDidYouLearnModal";
import { 
  DashboardData, 
  TrendItem, 
  StrategyResponse, 
  ContentPublishAndLearnResponse,
  getDashboard, 
  getTrends, 
  generateStrategy 
} from "../lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Strategy Modal state
  const [activeStrategy, setActiveStrategy] = useState<StrategyResponse | null>(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState<boolean>(false);
  const [strategyLoading, setStrategyLoading] = useState<boolean>(false);

  // Publish Modal state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [publishModalData, setPublishModalData] = useState<{
    title: string;
    topic: string;
    angle: string;
    format: string;
  } | undefined>(undefined);

  // What Did You Learn Modal state
  const [isLearnModalOpen, setIsLearnModalOpen] = useState<boolean>(false);

  // Load initial data
  const loadDashboard = async () => {
    try {
      const d = await getDashboard();
      setDashboardData(d);
      setTrends(d.trend_radar);
    } catch (e) {
      console.error("Dashboard load failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Trigger strategy generation
  const handleTriggerStrategy = async (trendId?: string) => {
    setStrategyLoading(true);
    try {
      const res = await generateStrategy("What should we post next?", trendId, "with_hindsight");
      setActiveStrategy(res);
      setIsStrategyModalOpen(true);
    } catch (e) {
      console.error("Failed to generate strategy:", e);
    } finally {
      setStrategyLoading(false);
    }
  };

  // Open Publish Modal with pre-filled content
  const handleOpenPublishModal = (
    title?: string,
    topic?: string,
    angle?: string,
    format?: string
  ) => {
    if (title && topic && angle && format) {
      setPublishModalData({ title, topic, angle, format });
    } else {
      setPublishModalData(undefined);
    }
    setIsPublishModalOpen(true);
  };

  // Refresh dashboard upon publishing and retaining learning
  const handlePublishSuccess = (res: ContentPublishAndLearnResponse) => {
    loadDashboard();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWhatDidYouLearn={() => setIsLearnModalOpen(true)}
        onOpenPublishModal={() => handleOpenPublishModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "dashboard" && (
          <DashboardOverview
            data={dashboardData}
            loading={loading}
            onSelectTrend={(trend) => {
              setActiveTab("trends");
            }}
            onTriggerStrategy={(trendId) => handleTriggerStrategy(trendId)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "trends" && (
          <TrendRadarView
            trends={trends}
            onTriggerStrategy={(trendId) => handleTriggerStrategy(trendId)}
          />
        )}

        {activeTab === "memory" && (
          <MemoryExplorerView />
        )}

        {activeTab === "compare" && (
          <ModeComparisonView />
        )}

        {activeTab === "evolution" && (
          <LearningEvolutionView />
        )}

        {activeTab === "chat" && (
          <StrategyChatView
            onTriggerFullStrategy={(trend) => handleTriggerStrategy()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ContentIQ &middot; HackwithHyderabad 3.0 &middot; Core Challenge: AI Agents That Learn Using Hindsight</span>
          <span className="font-mono text-cyan-400/80">Hindsight Bank: contentiq::acme-tech</span>
        </div>
      </footer>

      {/* Strategy Detail Modal (7-Day Plan + Why? Explainer) */}
      <StrategyDetailModal
        strategy={activeStrategy}
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onOpenPublishModal={(title, topic, angle, format) => {
          handleOpenPublishModal(title, topic, angle, format);
        }}
      />

      {/* Post & Learn Outcome Ingestion Modal */}
      <PublishAndLearnModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        initialData={publishModalData}
        onSuccess={handlePublishSuccess}
      />

      {/* What Did You Learn? Executive Synthesis Modal */}
      <WhatDidYouLearnModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
      />

      {/* Loading Overlay for Strategy Generation */}
      {strategyLoading && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-white">Synthesizing Hindsight Memories & Trend Signals...</p>
          <p className="text-xs text-slate-400">Recalling historical benchmarks, audience rules, and content gaps</p>
        </div>
      )}
    </div>
  );
}
