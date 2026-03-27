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


async def _stream_text_event(arg_dict: dict, delay_per_word: float = 0.07):
    """
    Yields intermediate 'argument_stream' events, delivering one word at a time,
    followed by a final 'argument' event with the complete argument.
    """
    words = arg_dict["text"].split()
    accumulated = ""
    partial = dict(arg_dict)

    # Chunk into groups of 3–4 words for smoother streaming
    chunk_size = 3
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        accumulated += ("" if i == 0 else " ") + chunk
        partial = {**arg_dict, "text": accumulated, "is_streaming": True, "score": 0}
        yield {"event": "argument_stream", "data": json.dumps(partial)}
        await asyncio.sleep(delay_per_word)

    # Final complete event
    yield {"event": "argument", "data": json.dumps({**arg_dict, "is_streaming": False})}


async def run_debate_graph(
    session_id: str,
    topic: str,
) -> AsyncGenerator[dict, None]:
    """
    LangGraph-style debate orchestration with word-by-word streaming.
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

    from app.db.mongo import get_human_inputs

    for round_num in range(1, 4):
        state["current_round"] = round_num

        yield {"event": "round_change", "data": json.dumps({"round": round_num, "status": "started"})}
        await asyncio.sleep(0.5)

        # Fetch any queued human inputs
        human_inputs = await get_human_inputs(session_id)
        if human_inputs:
            state["human_context"] = " | ".join(human_inputs)

        # --- PRO NODE (with streaming) ---
        pro_arg = await run_pro_agent(
            topic=state["topic"],
            round_num=round_num,
            debate_history=state["arguments"],
            human_context=state["human_context"]
        )
        pro_dict = pro_arg.model_dump(mode="json")
        async for event in _stream_text_event(pro_dict):
            yield event
        state["arguments"].append(pro_dict)
        await asyncio.sleep(1.0)

        # --- CON NODE (with streaming) ---
        con_arg = await run_con_agent(
            topic=state["topic"],
            round_num=round_num,
            debate_history=state["arguments"],
            human_context=state["human_context"]
        )
        con_dict = con_arg.model_dump(mode="json")
        async for event in _stream_text_event(con_dict):
            yield event
        state["arguments"].append(con_dict)
        await asyncio.sleep(1.0)

        # --- JUDGE NODE (with streaming) ---
        judge_arg = await run_judge_agent(
            topic=state["topic"],
            round_num=round_num,
            pro_arg=pro_arg,
            con_arg=con_arg
        )
        judge_dict = judge_arg.model_dump(mode="json")
        async for event in _stream_text_event(judge_dict, delay_per_word=0.05):
            yield event
        state["arguments"].append(judge_dict)
        await asyncio.sleep(0.8)

        yield {"event": "round_change", "data": json.dumps({"round": round_num + 1, "status": "complete"})}
        await asyncio.sleep(0.5)

    # --- VERDICT ---
    yield {"event": "round_change", "data": json.dumps({"round": 4, "status": "judging"})}
    await asyncio.sleep(1.5)

    verdict = await run_verdict(
        topic=state["topic"],
        all_arguments=state["arguments"],
        evidence_summary=state["evidence_summary"]
    )
    state["verdict"] = verdict.model_dump()
    yield {"event": "verdict", "data": json.dumps(verdict.model_dump())}
