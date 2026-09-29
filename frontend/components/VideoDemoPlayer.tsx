"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Brain, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Award,
  Video
} from "lucide-react";

interface Scene {
  id: number;
  timeRange: string;
  durationSeconds: number;
  title: string;
  speaker: string;
  scriptText: string;
  badge: string;
  visualType: "intro" | "problem" | "hindsight_demo" | "outcome_loop" | "conclusion";
}

export const VideoDemoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const totalDuration = 180; // 3 minutes = 180 seconds

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      timeRange: "0:00 - 0:30",
      durationSeconds: 30,
      title: "Scene 1: Team Hackers & The Core Idea",
      speaker: "Shaik Hidayatulla (Team Lead)",
      badge: "Introduction",
      visualType: "intro",
      scriptText: "Hi everyone! I am Shaik Hidayatulla, leading team Hackers alongside Shaik Ibrahim, Ch Sushanth, and Irgn Sainadh from VVIT College. If you have built AI agents, you know they all suffer from day-zero amnesia. Every time you ask a question, the model starts from scratch. We built ContentIQ, an autonomous content strategist powered by Hindsight persistent memory. Instead of generating generic copy from a blank slate, it remembers past campaign outcomes, learns from what failed, and behaves like an experienced strategist that has worked with your company for months.",
    },
    {
      id: 2,
      timeRange: "0:30 - 1:00",
      durationSeconds: 30,
      title: "Scene 2: The Problem (Stateless Agent Amnesia)",
      speaker: "Shaik Hidayatulla",
      badge: "The Problem",
      visualType: "problem",
      scriptText: "Here is the fundamental flaw with traditional AI tools. When we ask: 'AI Agents are trending. What should we post?', a stateless agent gives this generic advice: 'Create a post explaining what AI Agents are and their benefits.' Why is this a disaster? Because three weeks ago, our company published that exact generic AI piece, and it bombed—delivering a 0.4x engagement penalty and zero shares. But because standard LLMs have zero memory, they will blindly recommend the exact same failure pattern again and again.",
    },
    {
      id: 3,
      timeRange: "1:00 - 2:00",
      durationSeconds: 60,
      title: "Scene 3: Live Demo — Hindsight Retain, Recall & Reflect",
      speaker: "Shaik Hidayatulla",
      badge: "Live Hindsight Demo",
      visualType: "hindsight_demo",
      scriptText: "Now watch what happens when we add Hindsight. In our Memory Explorer, the agent accesses our tenant-isolated bank: contentiq::acme-tech. Through Hindsight's arecall(), it retrieves our historical postmortems: our technical tutorial delivered a 3.2x median engagement win, while generic commentary failed. It also notes that our developer audience hates promotional hype and wants code. When we open our Trend Radar and click 'Join Trend' on AI Agents, ContentIQ does not give generic fluff. It recommends: 'How to Secure Your First Production AI Agent' using gVisor sandboxing—directly targeting an unaddressed content gap. And when we click 'Why Did I Recommend This?', it gives us the exact mathematical breakdown: historical memory plus trend velocity equals recommendation.",
    },
    {
      id: 4,
      timeRange: "2:00 - 2:30",
      durationSeconds: 30,
      title: "Scene 4: The Closed Loop — Post & Learn",
      speaker: "Shaik Hidayatulla",
      badge: "The Learning Loop",
      visualType: "outcome_loop",
      scriptText: "Here is where ContentIQ truly compounds: the outcome loop. When we publish content, we enter real performance metrics right here. ContentIQ calculates that 680 engagements equals 2.7 times our company median. It then calls Hindsight's aretain() to commit that verified outcome permanently into memory. The next time any team member asks what to publish, that learning is already indexed. The agent gets smarter after every single post.",
    },
    {
      id: 5,
      timeRange: "2:30 - 3:00",
      durationSeconds: 30,
      title: "Scene 5: Wrap Up & Compounding Intelligence",
      speaker: "Shaik Hidayatulla",
      badge: "Conclusion",
      visualType: "conclusion",
      scriptText: "The biggest takeaway for our team building this: persistent memory changes the fundamental nature of AI. Without Hindsight, an agent is just an automated prompt. With Hindsight, it becomes an institutional strategist with compounding wisdom. A huge shoutout to my teammates Shaik Ibrahim, Ch Sushanth, and Irgn Sainadh from VVIT College. Check out our open-source repo and technical article in the description below. Thank you!",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick an English voice if available
    const voices = synthRef.current.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("Alex")));
    if (engVoice) utterance.voice = engVoice;

    synthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      speakText(scenes[currentSceneIndex].scriptText);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            stopSpeech();
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Sync scene based on currentTime
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulated += scenes[i].durationSeconds;
      if (currentTime < accumulated) {
        if (currentSceneIndex !== i) {
          setCurrentSceneIndex(i);
          if (isPlaying) {
            speakText(scenes[i].scriptText);
          }
        }
        break;
      }
    }
  }, [currentTime]);

  const handleRestart = () => {
    stopSpeech();
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Interactive AI Video Demo</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated 3-minute video presentation with synchronized speech narration &amp; UI progression for <strong>Team Hackers (VVIT College)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0e1422] p-1.5 rounded-xl border border-white/10 text-xs">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300">Shaik Hidayatulla &middot; Shaik Ibrahim &middot; Ch Sushanth &middot; Irgn Sainadh</span>
        </div>
      </div>

      {/* Main Video Frame (16:9 Aspect Ratio) */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 glass-panel shadow-2xl glow-purple bg-[#06080e] aspect-video flex flex-col justify-between p-6">
        
        {/* Top Video Overlay Bar */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {currentScene.badge}
            </span>
            <span className="text-xs text-slate-300 font-semibold">{currentScene.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
              {formatTime(currentTime)} / 3:00
            </span>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) stopSpeech();
                else if (isPlaying) speakText(currentScene.scriptText);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Dynamic Visual Stage Based on Scene */}
        <div className="my-auto py-4 z-10 max-w-4xl mx-auto w-full">
          {currentScene.visualType === "intro" && (
            <div className="text-center space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Hackers &middot; VVIT College</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Content<span className="text-cyan-400">IQ</span>
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
                An AI Content Strategist That Remembers, Learns and Spots What&apos;s Next
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-[#0e1625] border border-white/10">Shaik Hidayatulla (Lead)</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0e1625] border border-white/10">Shaik Ibrahim</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0e1625] border border-white/10">Ch Sushanth</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0e1625] border border-white/10">Irgn Sainadh</span>
              </div>
            </div>
          )}

          {currentScene.visualType === "problem" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto animate-fadeIn">
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Stateless AI Flaw</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Asked: <em>&ldquo;AI Agents are trending. What should we post?&rdquo;</em><br />
                  Output: Generic motivational commentary (&ldquo;AI is changing everything!&rdquo;)
                </p>
                <div className="p-2 rounded bg-black/40 text-[11px] text-rose-300 font-mono">
                  Result: 0.4x Median Engagement &middot; 0 Shares &middot; Flopped
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 flex flex-col justify-center text-center">
                <h4 className="text-sm font-bold text-white">Why Stateless AI Repeats Mistakes</h4>
                <p className="text-xs text-slate-400">
                  Because LLMs have zero memory across sessions, they recommend the exact same failed patterns tomorrow.
                </p>
              </div>
            </div>
          )}

          {currentScene.visualType === "hindsight_demo" && (
            <div className="space-y-3 max-w-3xl mx-auto animate-fadeIn">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Hindsight Memory Bank</span>
                  <h4 className="text-sm font-bold text-white">contentiq::acme-tech</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  3.2x Median Multiplier Recalled
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-[#0c121e] border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Trend Radar</span>
                  <strong className="text-cyan-300">AI Agents (Rising 94.5)</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#0c121e] border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Identified Gap</span>
                  <strong className="text-amber-300">Agent Security (0% Cov)</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#0c121e] border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Action</span>
                  <strong className="text-emerald-300">Code Carousel Blueprint</strong>
                </div>
              </div>
            </div>
          )}

          {currentScene.visualType === "outcome_loop" && (
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 max-w-2xl mx-auto space-y-3 text-center animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Post-Publish Ingestion</span>
              </div>
              <h3 className="text-lg font-bold text-white">12,400 Impressions &middot; 680 Engagements</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                ContentIQ computes a <strong>2.7x median multiplier</strong> and executes Hindsight <code className="text-cyan-300 font-mono">aretain()</code> to commit the verified learning permanently.
              </p>
            </div>
          )}

          {currentScene.visualType === "conclusion" && (
            <div className="text-center space-y-3 max-w-2xl mx-auto animate-fadeIn">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Memory Changes the Quality of the Agent
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Without Hindsight: A generic chatbot that forgets.<br />
                With Hindsight: A company-specific strategist that compounds intelligence with every campaign.
              </p>
              <p className="text-[11px] text-cyan-400 font-mono">
                Team Hackers &middot; VVIT College &middot; HackwithHyderabad 3.0
              </p>
            </div>
          )}
        </div>

        {/* Live Subtitle Transcript Bar */}
        <div className="p-3.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 z-10 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>SPEAKER: {currentScene.speaker.toUpperCase()}</span>
            <span>AUDIO NARRATION ACTIVE</span>
          </div>
          <p className="text-xs text-slate-100 italic leading-relaxed line-clamp-2">
            &ldquo;{currentScene.scriptText}&rdquo;
          </p>
        </div>

        {/* Video Player Controls */}
        <div className="pt-3 border-t border-white/10 z-10 flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = Math.floor((clickX / rect.width) * totalDuration);
              setCurrentTime(newTime);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white flex items-center gap-1.5 shadow-md shadow-violet-900/40"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause Video" : "Play Video Demo"}</span>
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scene Jumping Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {scenes.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    let acc = 0;
                    for (let j = 0; j < i; j++) acc += scenes[j].durationSeconds;
                    setCurrentTime(acc);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    currentSceneIndex === i
                      ? "bg-violet-600 text-white font-bold"
                      : "bg-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Scene {sc.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recording Instructions Card */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1.5">
        <span className="font-bold text-cyan-300">💡 How to Turn this into Your YouTube Video:</span>
        <p>
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">Win + Alt + R</kbd> (Windows Screen Record) or open Loom, then click <strong>&quot;Play Video Demo&quot;</strong> above. The audio will narrate aloud while the scenes transition automatically for 3 minutes!
        </p>
      </div>
    </div>
  );
};
