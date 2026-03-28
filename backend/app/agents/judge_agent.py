import json
import uuid
from datetime import datetime
from app.config import OPENROUTER_API_KEY, DEMO_MODE
from app.agents.prompts import JUDGE_SYSTEM_PROMPT, VERDICT_SYSTEM_PROMPT
from app.agents.topic_engine import get_debate_content, get_verdict
from app.models.schemas import ArgumentResponse, VerdictResponse, FallacyTag


async def run_judge_agent(
    topic: str,
    round_num: int,
    pro_arg: ArgumentResponse,
    con_arg: ArgumentResponse,
) -> ArgumentResponse:
    if DEMO_MODE or not OPENROUTER_API_KEY:
        content = get_debate_content(topic, round_num, "judge")
        fallacies = [FallacyTag(**f) for f in content["fallacies"]]
        return ArgumentResponse(
            id=str(uuid.uuid4()),
            agent="judge",
            round=round_num,
            round_type=["opening", "rebuttal", "closing"][round_num - 1],
            text=content["text"],
            score=content["score"],
            tone=content["tone"],
            fallacies=fallacies,
            timestamp=datetime.utcnow()
        )

    from openai import AsyncOpenAI
    client = AsyncOpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    user_msg = f"""Topic: "{topic}" — Round {round_num} Analysis

PRO argument: {pro_arg.text}
CON argument: {con_arg.text}

Analyze both arguments and return your evaluation as valid JSON only."""

    from app.agents.topic_engine import call_openrouter_llm
    response = await call_openrouter_llm(
        client=client,
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    data = json.loads(response.choices[0].message.content)
    if isinstance(data, list) and len(data) > 0:
        data = data[0]
        
    return ArgumentResponse(
        id=str(uuid.uuid4()),
        agent="judge",
        round=round_num,
        round_type=["opening", "rebuttal", "closing"][round_num - 1],
        text=data.get("text", ""),
        score=min(1.0, max(0.0, float(data.get("score", 0.75)))),
        tone=data.get("tone", "neutral"),
        fallacies=[FallacyTag(**f) for f in data.get("fallacies", [])],
        timestamp=datetime.utcnow()
    )


async def run_verdict(topic: str, all_arguments: list, evidence_summary: str = "") -> VerdictResponse:
    if DEMO_MODE or not OPENROUTER_API_KEY:
        pro_scores = [a["score"] for a in all_arguments if a["agent"] == "pro"]
        con_scores = [a["score"] for a in all_arguments if a["agent"] == "con"]
        v = get_verdict(topic, pro_scores, con_scores)
        return VerdictResponse(**v)

    from openai import AsyncOpenAI
    client = AsyncOpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    transcript = "\n\n".join([
        f"[Round {a['round']} - {a['agent'].upper()}] (Score: {a['score']})\n{a['text']}"
        for a in all_arguments
    ])

    user_msg = f"""Topic: "{topic}"

Full debate transcript:
{transcript}

Evidence submitted: {evidence_summary or 'No external evidence submitted.'}

Deliver your final verdict as valid JSON only."""

    from app.agents.topic_engine import call_openrouter_llm
    response = await call_openrouter_llm(
        client=client,
        messages=[
            {"role": "system", "content": VERDICT_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    data = json.loads(response.choices[0].message.content)
    if isinstance(data, list) and len(data) > 0:
        data = data[0]
        
    return VerdictResponse(
        winner=data.get("winner", "neutral"),
        confidence=min(100, max(0, int(data.get("confidence", 50)))),
        explanation=data.get("explanation", ""),
        pro_summary=data.get("pro_summary", ""),
        con_summary=data.get("con_summary", ""),
        consensus_conclusion=data.get("consensus_conclusion", ""),
        evidence_summary=data.get("evidence_summary", ""),
        pro_total_score=min(3.0, max(0.0, float(data.get("pro_total_score", 2.1)))),
        con_total_score=min(3.0, max(0.0, float(data.get("con_total_score", 2.1)))),
    )
