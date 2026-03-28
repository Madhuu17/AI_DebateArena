import json
import uuid
from datetime import datetime
from app.config import UNIVERSAL_API_KEY, DEMO_MODE
from app.agents.prompts import JUDGE_SYSTEM_PROMPT, VERDICT_SYSTEM_PROMPT
from app.agents.topic_engine import get_debate_content, get_verdict
from app.models.schemas import ArgumentResponse, VerdictResponse, FallacyTag


async def run_judge_agent(
    topic: str,
    round_num: int,
    pro_arg: ArgumentResponse,
    con_arg: ArgumentResponse,
) -> ArgumentResponse:
    if DEMO_MODE or not UNIVERSAL_API_KEY:
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

    user_msg = f"""Topic: "{topic}" \u2014 Round {round_num} Analysis

PRO argument: {pro_arg.text}
CON argument: {con_arg.text}

Analyze both arguments and return your evaluation as valid JSON only."""

    from app.agents.topic_engine import call_llm
    response = await call_llm(
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    data = json.loads(response.choices[0].message.content)
    if isinstance(data, list) and len(data) > 0:
        data = data[0]

    fallacies = [
        FallacyTag(name=f.get("name", "Generic Fallacy"), description=f.get("description", ""))
        for f in data.get("fallacies", [])
    ]

    return ArgumentResponse(
        id=str(uuid.uuid4()),
        agent="judge",
        round=round_num,
        round_type=["opening", "rebuttal", "closing"][round_num - 1],
        text=data.get("analysis", data.get("text", "No analysis provided.")),
        score=float(data.get("score", 0.5)),
        tone=data.get("tone", "neutral"),
        fallacies=fallacies,
        timestamp=datetime.utcnow()
    )


async def run_verdict(topic: str, all_arguments: list, evidence_summary: str = "") -> VerdictResponse:
    if DEMO_MODE or not UNIVERSAL_API_KEY:
        pro_scores = [a["score"] for a in all_arguments if a["agent"] == "pro"]
        con_scores = [a["score"] for a in all_arguments if a["agent"] == "con"]
        v = get_verdict(topic, pro_scores, con_scores)
        return VerdictResponse(**v)

    transcript = "\n\n".join([
        f"[Round {a['round']} - {a['agent'].upper()}] (Score: {a['score']})\n{a['text']}"
        for a in all_arguments
    ])

    user_msg = f"""Topic: "{topic}"

Full debate transcript:
{transcript}

Evidence submitted: {evidence_summary or 'No external evidence submitted.'}

Deliver your final verdict as valid JSON only."""

    from app.agents.topic_engine import call_llm
    response = await call_llm(
        messages=[
            {"role": "system", "content": VERDICT_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    data = json.loads(response.choices[0].message.content)
    if isinstance(data, list) and len(data) > 0:
        data = data[0]

    return VerdictResponse(
        winner=data.get("winner", "neutral") if data.get("winner") in ["pro", "con", "neutral"] else "neutral",
        confidence=int(float(data.get("confidence", 0.5)) * 100) if float(data.get("confidence", 0.5)) <= 1.0 else int(data.get("confidence", 50)),
        explanation=data.get("explanation", ""),
        pro_summary=data.get("pro_summary", ""),
        con_summary=data.get("con_summary", ""),
        consensus_conclusion=data.get("consensus", ""),
        evidence_summary=data.get("evidence", ""),
        pro_total_score=float(data.get("pro_score", 0)),
        con_total_score=float(data.get("con_score", 0))
    )
