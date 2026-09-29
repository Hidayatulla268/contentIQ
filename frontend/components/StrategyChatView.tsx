"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Bot, 
  AlertCircle,
  Lightbulb,
  Zap,
  ArrowRight
} from "lucide-react";
import { AgentChatResponse, sendAgentChat, MemoryItem } from "../lib/api";

interface MessageBubble {
  id: string;
  sender: "user" | "agent";
  text: string;
  memoriesRetrieved?: MemoryItem[];
  memoryRetained?: string;
  decision?: string;
  time: string;
}

interface StrategyChatViewProps {
  onTriggerFullStrategy?: (trend?: string) => void;
}

export const StrategyChatView: React.FC<StrategyChatViewProps> = ({
  onTriggerFullStrategy,
}) => {
  const [messages, setMessages] = useState<MessageBubble[]>([
    {
      id: "msg-welcome",
      sender: "agent",
      text: "Hello! I am ContentIQ, your marketing strategist powered by persistent Hindsight memory. Ask me what to post next, review campaign learnings, check audience fatigue, or teach me new brand rules.",
      time: "Just now",
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What should we post today?",
    "What did we learn from our last campaign?",
    "What topics have we ignored?",
    "What should we stop posting?",
    "Remember that our audience prefers technical code examples.",
    "Why did our previous AI Agent post perform well?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: MessageBubble = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res: AgentChatResponse = await sendAgentChat(query, "with_hindsight");
      const agentMsg: MessageBubble = {
        id: `agt-${Date.now()}`,
        sender: "agent",
        text: res.reply,
        memoriesRetrieved: res.memories_retrieved,
        memoryRetained: res.memory_retained,
        decision: res.decision,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          text: "I encountered an error querying the memory service. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Interactive Strategy Chat</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 31: Conversational strategist with continuous memory recall, intent synthesis, and live knowledge retention.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-[#0f1624] px-3 py-1.5 rounded-xl border border-cyan-500/20">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hindsight Mode: Active & Retentive</span>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-[#101726] hover:bg-[#182338] text-slate-300 border border-white/5 transition-all flex items-center gap-1.5"
          >
            <Lightbulb className="w-3 h-3 text-yellow-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[600px] overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
            >
              {m.sender === "agent" && (
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-violet-900/30"
                      : "bg-[#101725] border border-white/10 text-slate-100 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>

                {/* Section 28 & 29: Memory Trace Drawer for Agent Messages */}
                {m.sender === "agent" && m.memoriesRetrieved && m.memoriesRetrieved.length > 0 && (
                  <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs space-y-1.5 max-w-xl">
                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1">
                      <Brain className="w-3 h-3 text-cyan-400" />
                      Hindsight Memory Trace ({m.memoriesRetrieved.length} units retrieved)
                    </span>
                    <div className="space-y-1">
                      {m.memoriesRetrieved.slice(0, 3).map((mem, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{mem.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retained Memory Notification */}
                {m.memoryRetained && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Committed to Memory:</strong> {m.memoryRetained}</span>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block px-1">{m.time}</span>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-cyan-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#101725] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <span className="animate-pulse">Recalling historical memories & reasoning...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-[#0a0e17] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ContentIQ or teach it a new brand preference..."
              className="flex-1 bg-[#101622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
