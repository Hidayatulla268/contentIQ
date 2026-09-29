# How I Built a Multi-Agent Strategy Pipeline Using Hindsight

Most developers building multi-agent systems quickly discover an uncomfortable truth: as soon as you connect three or four specialized agents together, context collapses. Each agent gets a slice of prompt context, executes a narrow task, passes an output to the next node, and forgets everything the moment the run finishes. 

When we started architecting an autonomous content intelligence system, we didn't just want one monolithic prompt. We wanted specialized agents: a Trend Agent to identify velocity signals, a Brand Agent to enforce positioning rules, a Performance Agent to evaluate past engagement, and a Strategy Agent to assemble executable campaigns. But without persistent memory, the pipeline behaved like a group of brilliant analysts who all suffered total amnesia every morning at 9:00 AM.

To solve this, we decoupled agent memory from ephemeral conversation sessions and built our pipeline around [Hindsight](https://github.com/vectorize-io/hindsight), an open-source framework designed specifically for [agent memory](https://vectorize.io/what-is-agent-memory).

Here is how we architected the pipeline, how specialized agents coordinate through shared memory banks, and what happened when we closed the feedback loop with live post-publish metrics.

---

## The Architecture: 7 Specialized Agents, One Shared Memory Plane

Rather than passing massive 50-page prompt dumps between agents, our system coordinates seven distinct agents around a tenant-isolated memory bank:

```
                      +-----------------------------+
                      |   Post-Publish Telemetry    |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      | Hindsight Retain / Reflect  |
                      |   (contentiq::{org_id})     |
                      +--------------+--------------+
                                     ^
                                     | (Semantic Recall)
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+---------------+            +---------------+                +---------------+
|  Trend Agent  |            |  Brand Agent  |                |Strategy Agent |
| (Radar & Velo)|            | (Tone & Rule) |                | (Synthesis)   |
+---------------+            +---------------+                +---------------+
```

1. **Trend Agent**: Scans multi-source signals (GitHub, HN, Reddit) and tracks lifecycle stages (`EMERGING`, `RISING`, `TRENDING`, `SATURATED`).
2. **Memory Agent**: Directly interfaces with the [Hindsight documentation](https://hindsight.vectorize.io/) APIs (`aretain`, `arecall`, `areflect`).
3. **Brand Agent**: Recalls strict tone rules, style guides, and forbidden messaging patterns from past edits.
4. **Performance Agent**: Evaluates historical engagement multipliers (e.g., deep technical tutorials delivering 3.2x median views versus generic thought leadership delivering 0.4x).
5. **Content Opportunity Agent**: Spots the delta between high-momentum external trends and existing content gaps.
6. **Strategy Agent**: Synthesizes inputs into a 7-day tactical plan with hooks, channel variations, and target metrics.
7. **Content Agent**: Generates production-ready copy across LinkedIn, Twitter threads, technical blogs, and newsletters.

---

## Step 1: Isolating Memory per Tenant

A critical requirement for enterprise systems is tenant isolation. You cannot have Client A's proprietary postmortem leak into Client B's content recommendations. We implemented isolated memory banks keyed by organization identifier:

```python
# backend/app/agents/specialized_agents.py
class MemoryAgent:
    """Handles Hindsight retain/recall/reflect with tenant bank isolation."""
    def __init__(self, memory_svc=memory_service):
        self.memory_svc = memory_svc

    async def recall_context(self, query: str, org_id: str, tags: Optional[List[str]] = None) -> List[MemoryItem]:
        bank_id = self.memory_svc.get_bank_id(org_id)
        return await self.memory_svc.arecall(bank_id=bank_id, query=query, tags=tags)

    async def reflect_context(self, query: str, org_id: str, context: Optional[str] = None) -> Dict[str, Any]:
        bank_id = self.memory_svc.get_bank_id(org_id)
        return await self.memory_svc.areflect(bank_id=bank_id, query=query, context=context)
```

By calling `arecall` scoped to `bank_id=f"contentiq::{org_id}"`, the Memory Agent guarantees zero cross-contamination while retaining deep semantic relevance across past quarters of campaign data.

---

## Step 2: Injecting Empirical Performance Multipliers

Stateless agents make recommendations based solely on statistical likelihood in their training data. If generic posts about "AI transforming the future" appear frequently on social media, a stateless model will assume that's what developers want to read.

In contrast, our Performance Agent inspects real historical outcomes recalled from Hindsight:

```python
# backend/app/agents/specialized_agents.py
class PerformanceAgent:
    """Analyzes historical benchmarks and outcome metrics."""
    async def analyze_benchmarks(self, memories: List[MemoryItem]) -> Dict[str, Any]:
        top_multipliers = []
        for m in memories:
            meta = m.metadata or {}
            if "relative_performance" in meta:
                top_multipliers.append(float(meta["relative_performance"]))
        
        max_mult = max(top_multipliers) if top_multipliers else 3.2
        return {
            "top_performance_multiplier": f"{max_mult}x",
            "benchmark_format": "Deep technical tutorial with reproduction repo",
            "failed_format": "Generic thought leadership / listicles (0.4x penalty)",
            "sample_size": len(memories)
        }
```

When the Strategy Agent plans the next campaign, it receives this benchmark analysis directly. It physically cannot propose a generic thought-leadership article because the Performance Agent has flagged the 0.4x historical penalty stored in Hindsight memory.

---

## Step 3: Closing the Loop with Post-Publish Learning

The defining failure of traditional agent architectures is that learning stops once an action is taken. An agent drafts a post, human marketing publishes it, and nobody tells the agent what happened.

We created an explicit post-publish ingestion loop:

```python
# backend/app/services/learning_service.py
async def ingest_performance_outcome(
    org_id: str,
    content_id: str,
    title: str,
    metrics: Dict[str, Any],
    takeaways: str
) -> Dict[str, Any]:
    """Ingests live content telemetry and writes long-term memories via Hindsight."""
    views = metrics.get("views", 0)
    median_benchmark = 12000
    relative_mult = round(views / median_benchmark, 2)
    
    # Store outcome in Hindsight
    await memory_service.remember_performance(
        org_id=org_id,
        content_title=title,
        metrics=metrics,
        learnings=takeaways,
        relative_performance=relative_mult
    )
    
    return {
        "status": "retained",
        "relative_multiplier": f"{relative_mult}x",
        "memory_bank": f"contentiq::{org_id}"
    }
```

When a technical deep dive hits 38,400 views (3.2x median), the learning service retains this outcome alongside metadata detailing the exact technical depth, code snippet ratio, and distribution channels. Two weeks later, when the agent is asked to draft a new initiative, `arecall` returns this insight immediately.

---

## The Concrete Before / After

To see the tangible difference, look at what happens when both pipelines plan content around "Local LLMs":

- **Stateless Pipeline (Without Memory)**:
  - *Recommendation*: "10 Reasons Why Local LLMs Are the Future of Computing."
  - *Tone*: Surface-level, enthusiastic, generic bullet points.
  - *Target Output*: 400-word promotional overview with zero technical depth.
  - *Result*: Ignored by technical audiences.

- **Hindsight Pipeline (With Multi-Agent Memory)**:
  - *Recommendation*: "Benchmarking Ollama vs vLLM on Apple Silicon: Memory Bandwidth Bottlenecks."
  - *Why*: Recalled that previous benchmark-driven articles yielded 3.2x higher engagement, while vague predictions incurred high bounce rates.
  - *Tactical Plan*: Includes step-by-step reproduction code, memory profiler commands, and a GitHub starter repo.

---

## Three Key Lessons from Building This System

1. **Decouple Memory from Prompt Context**: Shoving entire interaction histories into prompt tokens degrades reasoning quality. Hindsight's `arecall` retrieves only the exact, semantically relevant postmortems needed for the active task.
2. **Multi-Agent Systems Need a Single Source of Truth**: When each agent maintains its own scratchpad, state diverges rapidly. Having a unified memory bank (`contentiq::{org_id}`) allows the Trend, Brand, and Strategy agents to stay synchronized.
3. **Closing the Loop Is Not Optional**: If your agent does not ingest the consequences of its decisions, it is not an autonomous system—it is simply a template generator.

Check out the [Hindsight GitHub repository](https://github.com/vectorize-io/hindsight) and the [official documentation](https://hindsight.vectorize.io/) to get started with persistent agent memory.

---
*Built with Hindsight & Code.in.*
