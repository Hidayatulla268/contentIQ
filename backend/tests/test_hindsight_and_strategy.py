import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from app.memory.hindsight_service import memory_service
from app.agents.specialized_agents import strategy_orchestrator
from app.providers.trend_provider import trend_radar_service
from app.services.learning_service import learning_service
from app.schemas.schemas import ContentPublishAndLearnRequest

async def run_all_tests():
    print("\n--- 1. Testing Hindsight Retain, Recall, Reflect ---")
    org_id = "test-org"
    bank_id = memory_service.get_bank_id(org_id)
    
    # Retain learning
    ret_res = await memory_service.remember_learning(
        org_id=org_id,
        learning="Technical security tutorials for AI Agents deliver 3.2x median performance over generic news.",
        tags=["ai_agents", "security", "benchmark"],
    )
    assert ret_res["success"] is True
    print(f"[PASS] Retained learning into bank {bank_id}: {ret_res['memory_id']}")

    # Recall
    recalled = await memory_service.arecall(bank_id=bank_id, query="AI Agents security tutorial")
    assert len(recalled) > 0
    print(f"[PASS] Recalled {len(recalled)} memories. Top score: {recalled[0].score}")

    # Reflect
    reflect_res = await memory_service.areflect(bank_id=bank_id, query="What content formats work best?")
    assert "synthesis" in reflect_res
    print(f"[PASS] Hindsight Reflection synthesis verified.")

    print("\n--- 2. Testing Strategy Generation (Mode B: With Hindsight) ---")
    strat = await strategy_orchestrator.generate_strategy(
        query="What should we post about AI Agents?",
        trend_id="trend-ai-agents",
        org_id="acme-tech",
        mode="with_hindsight",
    )
    assert strat.mode == "with_hindsight"
    assert len(strat.seven_day_plan) == 7
    assert "Observed" in strat.confidence_evidence
    assert len(strat.memories_used) > 0
    print(f"[PASS] Generated strategy with 7-day plan: '{strat.recommended_angle}'")
    print(f"[PASS] Hook: {strat.hook[:60]}...")
    print(f"[PASS] Memory trace count: {len(strat.memories_used)}")

    print("\n--- 3. Testing Mode A vs Mode B Side-by-Side Comparison ---")
    comp = await strategy_orchestrator.compare_modes("AI Agents are trending. What should we post?")
    assert comp.mode_a_no_memory.mode == "no_memory"
    assert comp.mode_b_with_hindsight.mode == "with_hindsight"
    assert len(comp.key_differences) >= 4
    print(f"[PASS] Mode A vs Mode B verified. Differences: {len(comp.key_differences)}")

    print("\n--- 4. Testing Trend Radar ---")
    trends = await trend_radar_service.get_radar_trends()
    assert len(trends) >= 5
    print(f"[PASS] Trend Radar loaded {len(trends)} trends. Top: {trends[0].name} ({trends[0].lifecycle_stage})")

    print("\n--- 5. Testing Post-Publish Learning Loop ---")
    pub_req = ContentPublishAndLearnRequest(
        title="Securing Autonomous Agents in Production",
        topic="AI Agents",
        angle="Technical security tutorial",
        format="Tutorial",
        impressions=12400,
        engagements=680,
        shares=93,
        org_id="acme-tech",
    )
    learn_res = await learning_service.publish_and_learn(pub_req)
    assert learn_res.relative_performance > 2.0
    print(f"[PASS] Outcome ingested: {learn_res.relative_performance}x median. Retained: {learn_res.retained_learning[:80]}...")

    print("\n--- 6. Testing 5-Step Learning Timeline Simulation ---")
    for step in range(1, 6):
        step_res = await learning_service.run_learning_simulation_step(step=step, org_id="acme-tech")
        print(f"[PASS] Step {step}: {step_res['title']}")

    print("\n=== ALL CONTENTIQ CORE TESTS PASSED SUCCESSFULLY! ===\n")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
