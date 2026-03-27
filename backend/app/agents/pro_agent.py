import uuid
from datetime import datetime
from app.config import OPENAI_API_KEY, DEMO_MODE
from app.agents.prompts import PRO_SYSTEM_PROMPT
from app.agents.topic_engine import get_debate_content
from app.models.schemas import ArgumentResponse


async def run_pro_agent(topic: str, round_num: int, debate_history: list, human_context: str = "") -> ArgumentResponse:
    if DEMO_MODE or not OPENAI_API_KEY:
        content = get_debate_content(topic, round_num, "pro")
        return ArgumentResponse(
            id=str(uuid.uuid4()),
            agent="pro",
            round=round_num,
            round_type=["opening", "rebuttal", "closing"][round_num - 1],
            text=content["text"],
            score=content["score"],
            tone=content["tone"],
            fallacies=[],
            timestamp=datetime.utcnow()
        )

    import json
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    round_types = {1: "opening statement", 2: "rebuttal", 3: "closing argument"}
    history_str = "\n".join([f"[{a['agent'].upper()}]: {a['text']}" for a in debate_history[-6:]])
    human_str = f"\nHuman observer added: {human_context}" if human_context else ""

    from app.services.search_service import fetch_realtime_data
    research_context = await fetch_realtime_data(topic, "pro/support arguments facts")

    user_msg = f"""Topic: "{topic}"
Round {round_num} — Your {round_types[round_num]}

Real-time Search Context (Latest Studies & Data):
{research_context}

Debate history so far:
{history_str}{human_str}

Generate your {round_types[round_num]} as the PRO advocate. Return valid JSON only."""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": PRO_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    data = json.loads(response.choices[0].message.content)
    return ArgumentResponse(
        id=str(uuid.uuid4()),
        agent="pro",
        round=round_num,
        round_type=["opening", "rebuttal", "closing"][round_num - 1],
        text=data.get("text", ""),
        score=min(1.0, max(0.0, float(data.get("score", 0.7)))),
        tone=data.get("tone", "neutral"),
        fallacies=[],
        timestamp=datetime.utcnow()
    )
