import json
import uuid
from datetime import datetime
from app.config import OPENAI_API_KEY, DEMO_MODE
from app.agents.prompts import CON_SYSTEM_PROMPT
from app.models.schemas import ArgumentResponse

MOCK_CON_ARGS = {
    1: {
        "text": "The proposition ignores a fundamental truth: medicine is not data retrieval — it is human judgment under uncertainty. AI systems trained on historical datasets perpetuate systemic biases. Amazon scrapped their AI hiring tool because it discriminated against women. Medical AI trained predominantly on Western, affluent datasets will fail catastrophically for underrepresented populations, creating a two-tiered healthcare system worse than what we have today.",
        "score": 79,
        "tone": "aggressive"
    },
    2: {
        "text": "The Pro side conveniently cites best-case scenarios while ignoring a critical 2021 Nature Medicine study showing AI diagnostic tools had 30% higher error rates on patients of color. Furthermore, who is liable when an AI kills a patient? Current legal frameworks have no answer. Replacing doctors with AI before solving accountability, bias, and liability is reckless experimentation on human lives.",
        "score": 81,
        "tone": "logical"
    },
    3: {
        "text": "True healthcare requires trust — the kind built over years between a patient and their physician. Studies show patients are 70% less likely to follow treatment plans when they don't trust their provider. An AI cannot build that trust. The evidence consistently shows that while AI excels as a tool, it devastates as a replacement. The risks to human dignity, equity, and accountability are unjustifiable.",
        "score": 83,
        "tone": "emotional"
    }
}

MOCK_CON_ARGS_GENERIC = {
    "text": "This position overlooks significant risks and unintended consequences. Historical evidence demonstrates that such sweeping changes consistently harm vulnerable populations disproportionately. The ethical implications alone should give us serious pause before proceeding.",
    "score": 73,
    "tone": "logical"
}


async def run_con_agent(topic: str, round_num: int, debate_history: list, human_context: str = "") -> ArgumentResponse:
    if DEMO_MODE or not OPENAI_API_KEY:
        mock = MOCK_CON_ARGS.get(round_num, MOCK_CON_ARGS_GENERIC)
        return ArgumentResponse(
            id=str(uuid.uuid4()),
            agent="con",
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

Generate your {round_types[round_num]} as the CON challenger. Return valid JSON only."""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": CON_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    data = json.loads(response.choices[0].message.content)
    return ArgumentResponse(
        id=str(uuid.uuid4()),
        agent="con",
        round=round_num,
        round_type=["opening", "rebuttal", "closing"][round_num - 1],
        text=data.get("text", ""),
        score=min(100, max(0, int(data.get("score", 70)))),
        tone=data.get("tone", "neutral"),
        fallacies=[],
        timestamp=datetime.utcnow()
    )
