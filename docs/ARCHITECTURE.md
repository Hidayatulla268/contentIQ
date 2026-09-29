# ContentIQ System Architecture

## 1. High-Level Architecture Overview

ContentIQ connects frontend presentation, asynchronous agent orchestration, and persistent semantic memory through Hindsight:

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                       │
│  - Trend Radar UI           - Memory Explorer               │
│  - Mode A vs Mode B Demo    - 7-Day Strategy Blueprint      │
│  - Interactive Chat         - Post & Learn Simulator        │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON HTTP / REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Router                   │
│  - /api/trends              - /api/memory/explorer          │
│  - /api/strategy/generate   - /api/performance/learn        │
│  - /api/strategy/compare    - /api/demo/timeline            │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│   StrategyOrchestrator    │         │       MemoryService       │
│  ├── MemoryAgent          │         │  (Hindsight Python SDK)   │
│  ├── TrendAgent           │◄───────►│  ├── aretain(...)         │
│  ├── PerformanceAgent     │         │  ├── arecall(...)         │
│  ├── BrandAgent           │         │  └── areflect(...)        │
│  ├── ContentOpportunity   │         └─────────────┬─────────────┘
│  └── ContentAgent         │                       │
└───────────┬───────────────┘                       │
            │                                       ▼
            ▼                       ┌─────────────────────────────┐
┌───────────────────────────┐       │   Hindsight Memory Bank     │
│       Groq Provider       │       │    contentiq::{org_id}      │
│ (Llama 3.3 70B / Fallback)│       └─────────────────────────────┘
└───────────────────────────┘
```

---

## 2. Hindsight Memory Bank Isolation

All organizational memories are cryptographically and logically isolated into tenant-specific banks:

$$\text{Bank ID} = \text{contentiq::}\{\text{organization\_slug}\}$$

For our primary HackwithHyderabad demo:
- Organization: `AcmeAI Technologies`
- Isolated Bank: `contentiq::acme-tech`

No memories leak across organizational boundaries.

---

## 3. Retain, Recall, Reflect Lifecycle

### A. RETAIN
Durable knowledge is committed using:
```python
await client.aretain(
    bank_id=bank_id,
    content=content,
    context=context,
    metadata=metadata,
    tags=tags,
    document_id=doc_id,
)
```
Categories retained:
- `content`: Content log benchmarks
- `performance`: Relative multipliers (e.g. 3.2x median)
- `learning`: Strategic axioms derived from campaigns
- `brand_voice`: Style principles and words to avoid
- `audience_insight`: Preferred formats and pain points
- `trend`: Past trend timing and ROI
- `decision`: Audit trail of strategic choices
- `experiment`: A/B variant outcomes

### B. RECALL
Semantic vector retrieval matches the active trend and strategic context:
```python
memories = await client.arecall(
    bank_id=bank_id,
    query=query,
    tags=tags,
    max_tokens=4096,
    budget="mid",
    trace=True
)
```

### C. REFLECT
Synthesizes higher-order reasoning across accumulated facts:
```python
synthesis = await client.areflect(
    bank_id=bank_id,
    query=query,
    context=context,
    budget="low"
)
```

---

## 4. Multi-Agent Orchestration Flow

When a user asks: *"How can we become part of this trend?"*

1. **Strategy Agent** coordinates intent.
2. **Trend Agent** inspects lifecycle stage (e.g. RISING), velocity (+2.8x), and momentum.
3. **Memory Agent** executes `arecall` for previous related campaigns and failures.
4. **Performance Agent** verifies engagement rate benchmarks.
5. **Brand Agent** enforces tone rules (engineer-to-engineer, no clickbait).
6. **Content Opportunity Agent** cross-references content library gaps (e.g. 0% coverage on Agent Security).
7. **Memory Agent** calls `areflect` to formulate the strategic hypothesis.
8. **Content Agent** drafts the multi-channel brief and 7-day tactical roadmap.
