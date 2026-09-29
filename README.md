# ContentIQ 🧠

> **An AI Content Strategist That Remembers, Learns and Spots What's Next.**  
> *Built for HackwithHyderabad 3.0 &middot; Official Challenge: «AI Agents That Learn Using Hindsight»*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.138.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Hindsight](https://img.shields.io/badge/Memory_Layer-Hindsight_Client-blueviolet.svg)](https://github.com/vectorize-io/hindsight)
[![Groq](https://img.shields.io/badge/LLM-Groq_Llama_3.3_70B-orange.svg)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔗 **Content Submission Links**: All 4 team member technical articles, LinkedIn social posts, and YouTube demo video are organized in [**`SUBMISSION_LINKS.md`**](SUBMISSION_LINKS.md).

---

## 📌 Executive Summary

Most AI content tools generate content based exclusively on the current prompt. They are completely amnesic:
- They forget which topics were already covered.
- They forget which angles failed.
- They repeat generic commentary that previously underperformed.
- They have no recollection of audience preferences, brand voice, or historical campaign ROI.

**ContentIQ** is not another generic copy generator. It is an **AI Content Strategy Agent** that behaves like a marketing strategist who has worked with your company for months. 

Powered by **Hindsight** as its persistent memory engine, ContentIQ remembers past content outcomes, retrieves historical benchmarks, detects real-time trends, and continuously refines its recommendations based on real-world marketing feedback.

```
«We tried something similar three weeks ago. It underperformed because the angle was too generic (0.4x median). 
Our technical version performed significantly better (3.2x median), so I recommend a practical technical 
sandboxing angle this time to address our unrepresented content gap.»
```

---

## 🌟 Core Hindsight Capabilities

ContentIQ does NOT hide Hindsight as an implementation detail. The UI explicitly visualizes the three core Hindsight operations:

```
┌─────────────────────────────────────────────────────────────┐
│                           RETAIN                            │
│  Remember content, results, decisions, and failure lessons  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                           RECALL                            │
│    Retrieve relevant historical benchmarks and brand rules  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          REFLECT                            │
│  Reason over accumulated experience to formulate strategy   │
└─────────────────────────────────────────────────────────────┘
```

- **RETAIN**: When content is published, actual impressions, engagements, and shares are captured. ContentIQ computes relative performance against the company median and commits durable learning units to Hindsight.
- **RECALL**: When evaluating a new trend on the Trend Radar, ContentIQ retrieves relevant historical campaign benchmarks before generating ideas.
- **REFLECT**: Synthesizes higher-order reasoning across accumulated memories to explain *why* a particular angle is prescribed.

---

## 🚀 Key Features

1. **🔥 Trend Radar**: Real-time signal tracking categorized into lifecycle stages: `EMERGING` &rarr; `RISING` &rarr; `TRENDING` &rarr; `SATURATED` &rarr; `DECLINING` with momentum and velocity scoring.
2. **⚖️ "Without Memory vs. With Memory" Demo**: Direct side-by-side comparison proving how persistent Hindsight memory transforms a generic response into a tailored, evidence-backed strategic roadmap.
3. **⏳ The 5-Step "Learning Over Time" Simulation**: Controlled simulation showing how the agent learns across 5 interactions—from a generic baseline in Step 1 to compound strategic mastery in Step 5.
4. **🧠 Memory Explorer ("What My Agent Remembers")**: Transparent memory browser exposing categorized knowledge: Content Learnings, Performance Benchmarks, Audience Insights, Brand Voice, Trend History, and Strategic Decisions.
5. **🎯 Content Gap & Fatigue Detection**: Automatically detects oversaturated topics (e.g., 7 generic news posts in a row) and surfaces unaddressed high-intent opportunities (e.g., *AI Agent Security & Sandboxing*).
6. **📝 7-Day Strategy Generator**: Generates day-by-day sequenced execution plans justified by historical memory, complete with proven hooks, CTAs, and multi-channel copy drafts (LinkedIn, Twitter, Newsletter).
7. **❓ "Why?" & "What Did You Learn?" Explainer**: Every recommendation includes a breakdown revealing the exact memory trace, trend signals, and audience insights used.

---

## 🏗 System Architecture

```
contentiq/
├── frontend/                     # Next.js 16 + React 19 + TypeScript + Tailwind CSS
│   ├── app/                      # App router (page.tsx, layout.tsx, globals.css)
│   ├── components/               # Navbar, Dashboard, TrendRadar, MemoryExplorer, ModeComparison, etc.
│   └── lib/                      # Typed API client connecting to FastAPI backend
│
├── backend/                      # Async FastAPI Architecture
│   ├── app/
│   │   ├── core/                 # Config, Async SQLAlchemy Database, Logging
│   │   ├── models/               # SQLAlchemy Models (Org, Content, Metrics, Trends, Runs)
│   │   ├── schemas/              # Pydantic Schemas (Retain, Recall, Reflect, Strategy)
│   │   ├── memory/               # Official Hindsight Client Integration (aretain, arecall, areflect)
│   │   ├── providers/            # Groq LLM Provider & Trend Radar Provider
│   │   ├── agents/               # 7 Specialized Agents & StrategyOrchestrator
│   │   ├── analytics/            # Content Gap & Fatigue Detection
│   │   ├── services/             # Post-Publish Learning Loop & Outcome Ingestion
│   │   ├── api/                  # REST API Endpoints (/api/memory, /api/trends, /api/strategy)
│   │   └── main.py               # FastAPI App Entrypoint
│   └── tests/                    # Integration Test Suite
│
├── demo-data/                    # Realistic synthetic dataset for AcmeAI (30+ items, campaigns, audience)
├── docs/                         # Hackathon deliverables (Article, Social Post, Video Script, Architecture)
├── docker-compose.yml            # PostgreSQL & Redis infrastructure
├── .env.example                  # Environment configuration template
└── README.md
```

### Specialized Multi-Agent Orchestrator
- **Strategy Agent**: Coordinates the intent and orchestrates the agent pipeline.
- **Memory Agent**: Interfaces with Hindsight for `aretain`, `arecall`, and `areflect`.
- **Trend Agent**: Identifies lifecycle stage, velocity, and multi-source public signals.
- **Performance Agent**: Evaluates historical multipliers (e.g. 3.2x median benchmark).
- **Brand Agent**: Enforces technical, concise, engineer-to-engineer brand guidelines.
- **Content Opportunity Agent**: Cross-references trend signals against content library gaps.
- **Content Agent**: Drafts final multi-channel copy and 7-day tactical roadmap.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Memory Engine** | **Hindsight** (`hindsight-client`) | Primary persistent memory layer (`aretain`, `arecall`, `areflect`) |
| **LLM Provider** | **Groq** (`llama-3.3-70b-versatile`) | Fast inference with contextual strategy fallback |
| **Backend** | **Python 3.14 & FastAPI** | Asynchronous, high-throughput REST API |
| **Database** | **PostgreSQL / Async SQLite** | Structured application metadata, runs, and metrics |
| **Frontend** | **Next.js 16 (App Router)** | Modern SaaS dashboard (React 19, TypeScript) |
| **Styling** | **Tailwind CSS v4 & Framer Motion** | Obsidian dark-first design, glassmorphism & glows |
| **Icons & Charts**| **Lucide React & Recharts** | Polished visual analytics |

---

## ⚙️ Quickstart & Local Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/contentiq.git
cd contentiq
```

### 3. Backend Setup
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install hindsight-client fastapi uvicorn pydantic pydantic-settings sqlalchemy aiosqlite asyncpg redis groq python-dotenv httpx

# (Optional) Copy environment variables
cp ../.env.example .env

# Run the test suite to verify Hindsight retain, recall, reflect, and strategy generation
python tests/test_hindsight_and_strategy.py

# Start FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```

Open **`http://localhost:3000`** in your browser to experience ContentIQ!

---

## 🧪 Running Automated Tests

Run the comprehensive test suite verifying the complete Hindsight loop:
```bash
cd backend
python tests/test_hindsight_and_strategy.py
```
**Test Coverage Includes:**
- [PASS] Hindsight `aretain`, `arecall`, and `areflect`
- [PASS] Strategy generation with 7-day sequenced plan
- [PASS] Side-by-side Mode A (No Memory) vs Mode B (With Hindsight)
- [PASS] Multi-stage Trend Radar
- [PASS] Post-publish learning loop ($3.2\times$ calculation and retention)
- [PASS] 5-step learning timeline simulation

---

## 🎬 3-Minute Hackathon Demo Script

1. **The Problem**: Show that most AI content tools forget past failures and generate generic commentary.
2. **The Memory**: Open the **"Memory Explorer"** to show what ContentIQ remembers in Hindsight bank `contentiq::acme-tech`.
3. **The Trend**: Open **"Trend Radar"** and select `AI Agents & Multi-Agent Workflows` (RISING stage, 94.5 momentum).
4. **Before vs. After**: Click **"Memory vs Stateless"** to show Mode A (generic advice) vs Mode B (cites historical 3.2x tutorial win and targets the unaddressed security gap).
5. **The Strategy**: Click **"What Should We Post Next?"** to generate the 7-day tactical plan. Click **"Why Did I Recommend This?"** to reveal the memory trace.
6. **The Learning Loop**: Click **"Post & Learn"**, enter actual impressions ($12,400$) and engagements ($680$). Watch ContentIQ compute the $2.7\times$ multiplier and retain the validated outcome into Hindsight!

---

## 📚 Official Hindsight References

- **Hindsight Official Repository**: [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Hindsight Client PyPI**: `pip install hindsight-client`
- **Challenge**: HackwithHyderabad 3.0 — *AI Agents That Learn Using Hindsight*

---

## 📄 Hackathon Deliverables

- 📰 [Article: How Persistent AI Memory Changes Content Strategy](docs/HACKATHON_ARTICLE.md)
- 📢 [Social Media / Build-in-Public Launch Post](docs/SOCIAL_MEDIA_POST.md)
- 🎥 [180-Second Video Demo Script](docs/VIDEO_SCRIPT.md)
- 📐 [Technical System Architecture](docs/ARCHITECTURE.md)
- 📊 [Synthetic AcmeAI Demo Dataset](demo-data/acme_ai_dataset.json)

---

## ⚖️ License
Released under the [MIT License](LICENSE).
