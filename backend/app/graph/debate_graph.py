import asyncio
import json
from typing import TypedDict, List, Optional, AsyncGenerator
from app.agents.pro_agent import run_pro_agent
from app.agents.con_agent import run_con_agent
from app.agents.judge_agent import run_judge_agent, run_verdict
from app.models.schemas import ArgumentResponse, VerdictResponse


class DebateStateDict(TypedDict):
    session_id: str
    topic: str
    current_round: int
    arguments: List[dict]
    human_context: str
    evidence_summary: str
    verdict: Optional[dict]
    status: str


async def run_debate_graph(
    session_id: str,
    topic: str,
) -> AsyncGenerator[dict, None]:
    """
    LangGraph-style debate orchestration.
    Yields SSE-ready event dicts for each step.
    """
    state: DebateStateDict = {
        "session_id": session_id,
        "topic": topic,
        "current_round": 1,
        "arguments": [],
        "human_context": "",
        "evidence_summary": "",
        "verdict": None,
        "status": "running",
    }

    # Check for queued human inputs from DB
    from app.db.mongo import get_human_inputs
    
    for round_num in range(1, 4):
        state["current_round"] = round_num

        # Notify round start
        yield {"event": "round_change", "data": {"round": round_num, "status": "started"}}
        await asyncio.sleep(0.5)

        # Fetch any queued human inputs
        human_inputs = await get_human_inputs(session_id)
        if human_inputs:
            state["human_context"] = " | ".join(human_inputs)

        # --- PRO NODE ---
        pro_arg = await run_pro_agent(
            topic=state["topic"],
            round_num=round_num,
            debate_history=state["arguments"],
            human_context=state["human_context"]
        )
        state["arguments"].append(pro_arg.model_dump(mode="json"))
        yield {"event": "argument", "data": pro_arg.model_dump(mode="json")}
        await asyncio.sleep(1.5)

        # --- CON NODE ---
        con_arg = await run_con_agent(
            topic=state["topic"],
            round_num=round_num,
            debate_history=state["arguments"],
            human_context=state["human_context"]
        )
        state["arguments"].append(con_arg.model_dump(mode="json"))
        yield {"event": "argument", "data": con_arg.model_dump(mode="json")}
        await asyncio.sleep(1.5)

        # --- JUDGE NODE ---
        judge_arg = await run_judge_agent(
            topic=state["topic"],
            round_num=round_num,
            pro_arg=pro_arg,
            con_arg=con_arg
        )
        state["arguments"].append(judge_arg.model_dump(mode="json"))
        yield {"event": "argument", "data": judge_arg.model_dump(mode="json")}
        await asyncio.sleep(1)

        # Notify round complete
        yield {"event": "round_change", "data": {"round": round_num + 1, "status": "complete"}}
        await asyncio.sleep(0.5)

    # --- VERDICT NODE ---
    yield {"event": "round_change", "data": {"round": 4, "status": "judging"}}
    await asyncio.sleep(1)

    verdict = await run_verdict(
        topic=state["topic"],
        all_arguments=state["arguments"],
        evidence_summary=state["evidence_summary"]
    )
    state["verdict"] = verdict.model_dump()
    yield {"event": "verdict", "data": verdict.model_dump()}
