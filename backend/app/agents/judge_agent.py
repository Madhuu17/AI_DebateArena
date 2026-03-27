import json
import uuid
from datetime import datetime
from app.config import OPENAI_API_KEY, DEMO_MODE
from app.agents.prompts import JUDGE_SYSTEM_PROMPT, VERDICT_SYSTEM_PROMPT
from app.models.schemas import ArgumentResponse, VerdictResponse, FallacyTag

MOCK_JUDGE_ANALYSES = {
    1: {
        "text": "Both opening statements demonstrate solid foundational reasoning. The PRO argument scores highly on evidence citation, referencing a specific Stanford study with quantified results. The CON argument effectively leverages the bias narrative, though falls slightly into emotional framing. Notable: PRO's democratization argument is compelling; CON's Amazon analogy, while relevant, risks a false equivalence (hiring AI ≠ diagnostic AI).",
        "score": 80,
        "tone": "logical",
        "fallacies": [{"type": "false_cause", "description": "CON draws a direct parallel between hiring AI failure and medical AI failure without sufficient evidence of equivalence"}]
    },
    2: {
        "text": "Round 2 rebuttals show both sides sharpening their core theses. PRO's counter to the bias argument by pointing to human diagnostic error rates is logically sound. CON's citation of the Nature Medicine study is a strong factual counter-blow. However, CON's rhetorical pivot to 'reckless experimentation' edges toward emotional appeal — the legal accountability point, however, is genuinely unaddressed by PRO and stands as the round's strongest unanswered argument.",
        "score": 78,
        "tone": "neutral",
        "fallacies": [{"type": "emotional_appeal", "description": "CON's use of 'reckless experimentation on human lives' prioritizes emotional impact over analytical rigor"}]
    },
    3: {
        "text": "Final arguments reveal the core of this debate: a values conflict between equity of access (PRO) vs. equity of quality (CON). PRO's historical technology analogy is well-constructed. CON's trust and treatment adherence statistic (70%) is the debate's most human-centered point and largely unanswered. Both sides have argued with integrity. The debate now rests on which value system the judge and audience prioritize.",
        "score": 85,
        "tone": "confident",
        "fallacies": []
    }
}

MOCK_VERDICT = {
    "winner": "con",
    "confidence": 58,
    "explanation": "After evaluating all three rounds, the CON side edges a narrow win primarily due to the unresolved legal accountability gap and the bias-in-training-data argument, which PRO failed to adequately counter. While PRO's access democratization argument is compelling and morally valid, CON's empirical citation quality was marginally stronger across rounds.",
    "pro_summary": "AI can match specialist accuracy and democratize access to expert care for billions in underserved regions — a morally compelling, data-backed argument.",
    "con_summary": "AI diagnostic tools exhibit significant bias against underrepresented populations, and no legal framework exists to handle AI-caused medical harm — making full replacement premature.",
    "consensus_conclusion": "AI should be aggressively deployed as a diagnostic partner to physicians, especially in under-resourced regions, while investment in bias mitigation and medical AI liability law catches up. Full replacement in the next decade is premature; augmentation is both safer and more effective.",
    "evidence_summary": "No external evidence was submitted during this debate. Both sides relied on cited studies within their arguments.",
    "pro_total_score": 81,
    "con_total_score": 84
}


async def run_judge_agent(
    topic: str,
    round_num: int,
    pro_arg: ArgumentResponse,
    con_arg: ArgumentResponse,
) -> ArgumentResponse:
    if DEMO_MODE or not OPENAI_API_KEY:
        mock = MOCK_JUDGE_ANALYSES.get(round_num, MOCK_JUDGE_ANALYSES[1])
        return ArgumentResponse(
            id=str(uuid.uuid4()),
            agent="judge",
            round=round_num,
            round_type=["opening", "rebuttal", "closing"][round_num - 1],
            text=mock["text"],
            score=mock["score"],
            tone=mock["tone"],
            fallacies=[FallacyTag(**f) for f in mock["fallacies"]],
            timestamp=datetime.utcnow()
        )

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    user_msg = f"""Topic: "{topic}" — Round {round_num} Analysis

PRO argument: {pro_arg.text}
CON argument: {con_arg.text}

Analyze both arguments and return your evaluation as valid JSON only."""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    data = json.loads(response.choices[0].message.content)
    return ArgumentResponse(
        id=str(uuid.uuid4()),
        agent="judge",
        round=round_num,
        round_type=["opening", "rebuttal", "closing"][round_num - 1],
        text=data.get("text", ""),
        score=min(100, max(0, int(data.get("score", 75)))),
        tone=data.get("tone", "neutral"),
        fallacies=[FallacyTag(**f) for f in data.get("fallacies", [])],
        timestamp=datetime.utcnow()
    )


async def run_verdict(topic: str, all_arguments: list, evidence_summary: str = "") -> VerdictResponse:
    if DEMO_MODE or not OPENAI_API_KEY:
        return VerdictResponse(**MOCK_VERDICT)

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)

    transcript = "\n\n".join([
        f"[Round {a['round']} - {a['agent'].upper()}] (Score: {a['score']})\n{a['text']}"
        for a in all_arguments
    ])

    user_msg = f"""Topic: "{topic}"

Full debate transcript:
{transcript}

Evidence submitted: {evidence_summary or 'No external evidence submitted.'}

Deliver your final verdict as valid JSON only."""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": VERDICT_SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    data = json.loads(response.choices[0].message.content)
    return VerdictResponse(
        winner=data.get("winner", "neutral"),
        confidence=min(100, max(0, int(data.get("confidence", 50)))),
        explanation=data.get("explanation", ""),
        pro_summary=data.get("pro_summary", ""),
        con_summary=data.get("con_summary", ""),
        consensus_conclusion=data.get("consensus_conclusion", ""),
        evidence_summary=data.get("evidence_summary", ""),
        pro_total_score=min(100, max(0, int(data.get("pro_total_score", 70)))),
        con_total_score=min(100, max(0, int(data.get("con_total_score", 70)))),
    )
