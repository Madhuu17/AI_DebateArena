import json
import uuid
from datetime import datetime
from app.config import OPENAI_API_KEY, DEMO_MODE
from app.agents.prompts import PRO_SYSTEM_PROMPT
from app.models.schemas import ArgumentResponse

# Mock responses for DEMO_MODE
MOCK_PRO_ARGS = {
    1: {
        "text": "Artificial intelligence has demonstrated remarkable capabilities in medical diagnosis, often matching or exceeding specialist accuracy. A landmark Stanford study showed AI detecting diabetic retinopathy with 90%+ accuracy — surpassing board-certified ophthalmologists. In a world where 57% of countries face critical physician shortages, AI doesn't just augment doctors; it democratizes access to expert-level care for billions who currently have none.",
        "score": 82,
        "tone": "confident"
    },
    2: {
        "text": "The opposition raises concerns about AI errors, yet human doctors misdiagnose at a staggering 10-15% rate across specialties. AI systems like IBM Watson for Oncology have already shown they catch cases human oncologists miss. The question isn't whether AI is perfect — it's whether it's better than the alternative of no care at all for underserved populations.",
        "score": 78,
        "tone": "logical"
    },
    3: {
        "text": "History shows that technology does not eliminate professions — it transforms them. Just as calculators made mathematicians more powerful, AI will elevate doctors to focus on what humans do best: empathy, complex ethical reasoning, and patient relationships. The evidence overwhelmingly supports AI integration as the defining medical advancement of our century.",
        "score": 85,
        "tone": "confident"
    }
}

MOCK_PRO_ARGS_GENERIC = {
    "text": "The evidence strongly supports this position. Multiple peer-reviewed studies demonstrate significant benefits, and leading experts in the field have reached strong consensus on this matter. The data clearly shows positive outcomes that cannot be ignored.",
    "score": 75,
    "tone": "confident"
}


async def run_pro_agent(topic: str, round_num: int, debate_history: list, human_context: str = "") -> ArgumentResponse:
    if DEMO_MODE or not OPENAI_API_KEY:
        mock = MOCK_PRO_ARGS.get(round_num, MOCK_PRO_ARGS_GENERIC)
        return ArgumentResponse(
            id=str(uuid.uuid4()),
            agent="pro",
            round=round_num,
            round_type=["opening", "rebuttal", "closing"][round_num - 1],
            text=mock["text"],
            score=mock["score"],
            tone=mock["tone"],
            fallacies=[],
            timestamp=datetime.utcnow()
        )

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    round_types = {1: "opening statement", 2: "rebuttal", 3: "closing argument"}
    history_str = "\n".join([f"[{a['agent'].upper()}]: {a['text']}" for a in debate_history[-6:]])
    human_str = f"\nHuman observer added: {human_context}" if human_context else ""

    user_msg = f"""Topic: "{topic}"
Round {round_num} — Your {round_types[round_num]}

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
        score=min(100, max(0, int(data.get("score", 70)))),
        tone=data.get("tone", "neutral"),
        fallacies=[],
        timestamp=datetime.utcnow()
    )
