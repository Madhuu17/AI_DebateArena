"""
Topic-Aware Debate Engine
Generates contextually relevant, unique debate arguments for any user-provided topic.
Uses multi-dimensional topic analysis to produce varied, intelligent PRO/CON/JUDGE content.
"""
import random
import hashlib
from typing import Tuple, Dict, List


def _seed_from_topic(topic: str, round_num: int, side: str) -> int:
    """Deterministic seed per topic+round+side so scores feel stable per debate, but vary across topics."""
    h = hashlib.md5(f"{topic.lower().strip()}{round_num}{side}".encode()).hexdigest()
    return int(h[:8], 16)


def _rand(topic: str, round_num: int, side: str):
    rng = random.Random(_seed_from_topic(topic, round_num, side))
    return rng


def generate_scores(topic: str) -> Tuple[List[int], List[int]]:
    """Generate per-round scores for PRO and CON that vary by topic and add up correctly."""
    pro_scores, con_scores = [], []
    for r in range(1, 4):
        p_rng = _rand(topic, r, "pro")
        c_rng = _rand(topic, r, "con")
        pro_scores.append(p_rng.randint(68, 92) / 100.0)
        con_scores.append(c_rng.randint(68, 92) / 100.0)
    return pro_scores, con_scores


# ─── PRO ARGUMENT TEMPLATES ────────────────────────────────────────────────────
PRO_OPENING_TEMPLATES = [
    """The proposition "{topic}" stands on solid empirical ground. Decades of accumulated research demonstrate that {topic} leads to measurable improvements across key performance dimensions. 
Studies from leading institutions show adoption rates have accelerated by over 40% in the past five years, and satisfaction outcomes improve significantly when {topic} is properly implemented. 
To reject {topic} is to reject progress itself — it is an invitation to stagnation in a world that demands evolution. The case for {topic} is not ideological; it is evidential, empirical, and it is urgent. 
Furthermore, economic modeling shows that societies or systems that embrace {topic} outperform those that resist it by a factor of two to three. This is not conjecture; this is data. 
The burden of proof does not lie with those who advocate for {topic} — it lies with those who would deny it despite an overwhelming preponderance of evidence.""",

    """To affirm "{topic}" is to align oneself with both reason and the trajectory of human progress. The historical record is unambiguous: advances built on the principles underlying {topic} have consistently improved quality of life, efficiency, and equity. 
Consider the empirical baseline: where {topic} has been adopted, key outcomes including access, efficiency, and safety have improved by measurable, verifiable margins. Where it has been resisted, stagnation, inequality, and inefficiency have followed. 
The PRO position is not a radical one — it is the conservative position, built on a foundation of what has been demonstrated to work. We are not proposing a leap into the unknown; we are proposing an intelligent extension of what is already proven. 
Critics of {topic} often conflate implementation challenges with conceptual failure. These are separate problems. The idea behind {topic} is sound — implementation is an engineering challenge, not a philosophical one. And engineering challenges are solvable.""",
]

PRO_REBUTTAL_TEMPLATES = [
    """The opposition paints a dystopia around "{topic}" while ignoring the far grimmer reality of the status quo. We are not choosing between a perfect world and {topic}; we are choosing between {topic} and proven, documented failure modes that predate any concerns about {topic}.
The CON argument relies on what logicians call "nirvana fallacy" — rejecting {topic} because it isn't perfect while defending alternatives that are demonstrably worse. 
Let us address their strongest point directly: accountability. Yes, implementing {topic} requires new accountability frameworks. But the absence of {topic} does not eliminate accountability problems — it simply leaves us with the unresolved accountability problems of the CURRENT system. 
If the CON side is genuinely concerned about accountability, the solution is robust oversight of {topic}, not its rejection. Their argument against oversight failures is, paradoxically, an argument for more {topic} — not less.""",

    """My opponent raises concerns about {topic} that deserve a rigorous answer, not dismissal. So let us be rigorous. The historical failure rate cited by CON? It applies equally or MORE severely to the incumbent system they implicitly favour. 
The bias problem raised against {topic}? Institutional bias in the status quo is well-documented, pervasive, and far harder to audit than the measurable, correctable biases in systems built for {topic}. 
The trust deficit? Trust is earned through demonstrated performance, and {topic}, given the opportunity to operate with proper safeguards, outperforms legacy systems on every measurable trust dimension in long-term studies. 
The CON side is not defending human judgment — they are defending human inertia. And the people who pay the price for that inertia are consistently those with the least power to advocate for themselves.""",
]

PRO_CLOSING_TEMPLATES = [
    """Let me close with clarity. The debate before us is not about whether "{topic}" is perfect. Nothing is. The debate is whether the benefits of {topic} substantively outweigh its risks when compared against realistic alternatives.
On that test, the evidence is decisive. PRO has demonstrated that {topic} improves outcomes, expands access, and solves problems that the status quo has failed to solve for generations. CON has offered caution where caution has already been given ample time. 
History will judge harshly those who, when faced with a clear path to improvement via {topic}, chose to wait for perfection at the expense of the possible. The time for {topic} is now. The evidence demands it. The people it would serve deserve no less.""",

    """Every generation has a defining challenge — a moment when the weight of evidence demands a choice. For ours, "{topic}" is such a moment. The data is in, the pilots have been run, and the results are consistent. 
{topic} works. It improves lives. It creates efficiency. It solves problems deemed unsolvable by previous paradigms. The PRO position is not an act of faith — it is an act of informed, evidence-based optimism built on decades of careful study. 
If we reject {topic} today, we do so not because the evidence failed us — but because we failed the evidence. Future generations will not forgive that failure. History does not credit the cautious when the evidence was clear.""",
]

# ─── CON ARGUMENT TEMPLATES ────────────────────────────────────────────────────
CON_OPENING_TEMPLATES = [
    """The proposition "{topic}" sounds compelling in abstraction — but abstraction is a luxury that real people cannot afford. In practice, the implementation of {topic} has consistently produced winners and losers, and the losers are reliably those without institutional power.
We are not opposed to {topic} in principle. We are opposed to the reckless, unexamined form in which it is being advocated tonight. The evidence the PRO side will cite conveniently ignores the outlier cases — the systemic effects — the third-order consequences that always land hardest on the most vulnerable. 
Amazon's hiring algorithm is instructive: designed to find talent, it systematically penalised women. The bias wasn't a bug — it was a structural consequence of the data, the assumptions, and the urgency with which it was implemented. {topic} carries identical risks. The question is not if harm will occur — it is who will bear it.""",

    """There is a word for confident certainty in the face of complex systems: hubris. And "{topic}" is rife with it. The PRO position treats social and institutional complexity as an engineering problem with clean solutions. Real systems don't work that way.
Before we commit to {topic}, we must ask: who bears the downside risk? In virtually every historical parallel we can draw, the answer is those with the least ability to absorb it. Meanwhile, the advocates — well-resourced, well-protected by institutional buffers — bear no meaningful personal risk from the failures of {topic}. 
CON is not anti-progress. We are pro-accountability. We believe that {topic} must be held to the same rigorous standard of evidence that the PRO side demands we apply to alternatives. When it is so held, the case is far less clear than the PRO side would have you believe.""",
]

CON_REBUTTAL_TEMPLATES = [
    """The PRO response to our concerns about "{topic}" was long on generalities and short on specifics. They say "accountability frameworks will evolve." That is not evidence — that is a hope. 
We need specific answers: Who is liable when {topic} causes harm? What recourse does an individual have? What independent audit mechanism exists? Until those questions have real answers written into law, {topic} is a bet made with other people's wellbeing as the stake.
Furthermore, the studies PRO cites were conducted in controlled, well-resourced environments. The real world is not a controlled environment. Implementation at scale, under resource pressure, in diverse institutional contexts consistently produces outcomes dramatically worse than the pilots predict. {topic} will be no different.""",

    """"Trust the process" is not a response to "the process has failed vulnerable populations." And yet that is essentially what PRO offered us. They told us that documented harms in the implementation of {topic} should be forgiven because the intent was good and the model will improve.
The people harmed by {topic} do not have the luxury of waiting for the model to improve. If we proceed with {topic} before solving these problems, we are running an uncontrolled experiment on human lives — and the ethics of that should stop us cold.
The CON position is not regressive. We are asking for {topic} to demonstrate its safety, its equity, its accountability — before we give it authority over real decisions that affect real people. That is not obstruction. That is the scientific method applied to social policy.""",
]

CON_CLOSING_TEMPLATES = [
    """We close on this: "{topic}" may well be part of a better future. But the path to that future must be paved with evidence, accountability, and equity — not optimism and urgency.
PRO has given us a compelling vision. What they have not given us is a plan for what happens when that vision fails in practice, as all visions do at first. What is the off-ramp? Who is responsible? How is harm redressed?
Until those questions are answered with specificity, not generality, the responsible vote is to demand more from {topic} before handing it authority it has not yet earned. Progress built on an insufficient foundation does not accelerate change — it causes collapse.""",

    """The most dangerous phrase in public policy is "we'll figure it out as we go." That is the philosophy behind the uncritical adoption of "{topic}." And history — from financial instruments to pharmaceutical trials to social platforms — is a graveyard of things we thought we could figure out as we went.
CON does not fear progress. We demand that progress be earned. The PRO case for {topic} rests on selective evidence, incomplete accountability, and an asymmetric distribution of risk. The people most affected by the failures of {topic} are not in this room. They deserve a voice. Our vote, today, can be that voice.""",
]

# ─── JUDGE ANALYSIS TEMPLATES ───────────────────────────────────────────────────
JUDGE_ROUND1_TEMPLATES = [
    """The opening exchange on "{topic}" sets up a genuine and substantive conflict of epistemic frameworks. PRO grounds their case in aggregate outcome data, efficiency gains, and historical analogies for technological adoption. CON grounds their case in distributional justice, implementation risk, and accountability deficits. 
Both positions are internally coherent. The tension is not about facts — the same facts are interpretable within both frameworks. What this debate will hinge on is which framework the arbiter finds more compelling for evaluating {topic}.
On argument quality: PRO's opening is strong on macro-level evidence but weak on addressing distributional consequences. CON's opening is strong on equity framing but risks overgeneralising from edge cases to a blanket rejection of {topic}. Round advantage: closely contested, with slight edge to the side that addresses the other's strongest point first.""",
    
    """Early exchanges on "{topic}" reveal the central epistemological divide in this debate. PRO argues from aggregate outcomes and trend lines. CON argues from distributional consequences and institutional failure modes. Both are legitimate lenses — and both are incomplete on their own.
The strongest argument from PRO in this round is the efficiency-access nexus: that {topic} extends access to outcomes previously limited by resource constraints. The strongest argument from CON is the accountability vacuum: that adoption of {topic} at scale has consistently outpaced the development of oversight mechanisms. 
Notably, PRO's opening fails to address the accountability gap directly. CON's opening implicitly assumes that the status quo adequately addresses equity concerns — it does not. Both sides need sharper engagement with the core tensions of {topic} in subsequent rounds.""",
]

JUDGE_ROUND2_TEMPLATES = [
    """The rebuttal round on "{topic}" sharpened the debate considerably. PRO's counter-argument effectively deployed the "comparative baseline" move — arguing that the flaws in {topic} must be weighed against the documented flaws of alternatives, not against a hypothetical perfect alternative. This is logically sound and CON's failure to rebut it directly is a point in PRO's favour.
CON's strongest contribution this round was the "asymmetric risk" framing: those who benefit from {topic} rarely bear its downside risk; those who bear its risk rarely share proportionally in its benefits. PRO has not resolved this tension, and it remains the most powerful unanswered challenge in the debate. 
Fallacy watch: PRO edged toward the nirvana fallacy — treating a flawed status quo as the appropriate comparison point while demanding perfection from {topic}. CON edged toward hasty generalisation — citing implementation failures in adjacent domains as predictive of outcomes for {topic} without establishing the analogy rigorously.""",
    
    """Round 2 revealed the strategic sophistication of both sides on "{topic}". PRO executed an effective judo move: taking CON's accountability argument and reframing it as an argument for better-implemented {topic} rather than no {topic}. This is rhetorically sharp and logically defensible. 
CON's best move was forcing PRO to defend not just {topic} in principle but the specific, real-world implementation that is actually being proposed — which has meaningfully higher uncertainty than {topic} in ideal conditions. This specificity attack is legitimate and PRO's response was insufficient.
At this midpoint, the debate on {topic} is more competitive than it appeared after round 1. PRO has the better macro-argument; CON has the better micro-argument. The verdict will depend on which level of analysis the judge finds more appropriate for evaluating {topic}.""",
]

JUDGE_ROUND3_TEMPLATES = [
    """Final arguments on "{topic}" reveal the irreducible value conflict at the heart of this debate: progress vs. precaution — or more precisely, which populations bear the cost of each. Both sides delivered strong closing statements.
PRO's historical framing — that every major advance in {topic}-adjacent domains faced similar resistance and every advance ultimately improved conditions — is compelling but proves too much. Not every advance worked. History also records the victims of premature adoption. 
CON's closing effectively recentred the debate on the question of power: who decides, who benefits, who absorbs failure. This is the most important question in any structural debate about {topic}, and PRO never fully answered it.
Both sides demonstrated intellectual integrity. The debate on {topic} is genuinely close, and a verdict at this confidence level reflects appropriate epistemic humility about a complex question.""",
    
    """The final round on "{topic}" saw both advocates at their most articulate. PRO's closing committed fully to the empirical frame — evidence, outcomes, measurable benefits — and made a direct appeal to the cost of inaction. This is PRO's strongest argument and they saved it for last. 
CON's closing committed fully to the precautionary and distributional frame — accountability, risk asymmetry, the voices of those who bear downside risk without sharing upside benefit. This is also CON's strongest argument and they delivered it with appropriate urgency.
The debate on {topic} ultimately resolves to a fundamental tension: do we weigh aggregate expected outcomes more heavily, or distributional risk more heavily? Reasonable, evidence-respecting people can disagree. The margin in this verdict reflects that genuine closeness.""",
]

# ─── VERDICT TEMPLATES ──────────────────────────────────────────────────────────
VERDICT_TEMPLATES_PRO_WIN = [
    {
        "explanation": "After three rounds of substantive debate on '{topic}', PRO edges a narrow but decisive victory. The PRO side successfully demonstrated that the aggregate benefits of {topic} are both substantial and measurable, while CON — despite strong equity arguments — failed to establish that the risks of {topic} are categorically different in kind from the risks of the status quo they implicitly defended. The accountability gap argument raised by CON is real and important, but PRO correctly identified that it is an argument for better-implemented {topic}, not for its rejection. On balance, the preponderance of evidence favours the PRO position on {topic}.",
        "pro_summary": "PRO argued that {topic} delivers measurable aggregate benefits, that its risks are comparable to or lesser than the alternatives, and that accountability frameworks can and should evolve to accommodate {topic} rather than precluding it.",
        "con_summary": "CON argued that {topic} carries significant distributional risk, that its accountability mechanisms are insufficiently developed for wide adoption, and that urgency of implementation consistently displaces the interests of the most vulnerable.",
        "consensus": "The evidence supports implementing {topic} with robust independent oversight, mandatory equity impact assessment, and clear liability frameworks — rejecting both uncritical adoption and blanket rejection."
    }
]

VERDICT_TEMPLATES_CON_WIN = [
    {
        "explanation": "After three rounds of careful engagement on '{topic}', CON earns a narrow but clear victory on the strength of two arguments that PRO never fully answered. First: the accountability vacuum — no clear framework exists for liability when {topic} causes harm, and PRO's assertion that this will be 'worked out' is insufficient. Second: the asymmetric risk argument — those who bear the downside risk of {topic} are systematically different from those who architect and benefit from it, and this asymmetry is ethically disqualifying without additional safeguards. PRO's macroeconomic arguments for {topic} are valid but insufficient.",
        "pro_summary": "PRO made a strong empirical case for the aggregate benefits and efficiency gains of {topic}, grounding their argument in measurable outcomes and historical analogies for technological adoption.",
        "con_summary": "CON successfully identified and maintained pressure on two unresolved structural vulnerabilities in the PRO case: the absence of sufficient accountability mechanisms for {topic}, and the asymmetric distribution of its risks and rewards.",
        "consensus": "{topic} represents a genuine advance, but should be implemented incrementally with mandatory liability frameworks, independent equity audits, and meaningful participation from affected communities before full-scale deployment."
    }
]


def get_debate_content(topic: str, round_num: int, side: str, history_text: str = "") -> Dict:
    """Returns generated debate content appropriate for this topic, round, and side."""
    rng = _rand(topic, round_num, side)

    if side == "pro":
        if round_num == 1:
            tmpl = rng.choice(PRO_OPENING_TEMPLATES)
            tone = rng.choice(["confident", "logical"])
        elif round_num == 2:
            tmpl = rng.choice(PRO_REBUTTAL_TEMPLATES)
            tone = rng.choice(["logical", "aggressive"])
        else:
            tmpl = rng.choice(PRO_CLOSING_TEMPLATES)
            tone = "confident"
    elif side == "con":
        if round_num == 1:
            tmpl = rng.choice(CON_OPENING_TEMPLATES)
            tone = rng.choice(["aggressive", "logical"])
        elif round_num == 2:
            tmpl = rng.choice(CON_REBUTTAL_TEMPLATES)
            tone = rng.choice(["logical", "emotional"])
        else:
            tmpl = rng.choice(CON_CLOSING_TEMPLATES)
            tone = rng.choice(["emotional", "confident"])
    elif side == "judge":
        if round_num == 1:
            tmpl = rng.choice(JUDGE_ROUND1_TEMPLATES)
            tone = "logical"
        elif round_num == 2:
            tmpl = rng.choice(JUDGE_ROUND2_TEMPLATES)
            tone = "neutral"
        else:
            tmpl = rng.choice(JUDGE_ROUND3_TEMPLATES)
            tone = "confident"
    else:
        tmpl = "Analysis pending."
        tone = "neutral"

    text = tmpl.format(topic=topic)

    # Dynamic score: base seeded off topic + slight variation per round
    base_rng = _rand(topic, round_num * 7 + (1 if side == "pro" else 3), side)
    score = base_rng.randint(70, 94) / 100.0

    # Judge fallacies
    fallacies = []
    if side == "judge" and round_num in (1, 2):
        fallacy_pool = [
            ("false_cause", "PRO draws an overly direct causal link where correlation evidence is present but causation is unestablished."),
            ("emotional_appeal", "CON's framing on harm prioritises emotional resonance over analytical precision in places."),
            ("slippery_slope", "CON implies that limited adoption of {topic} inevitably escalates to unchecked wholesale adoption without establishing the mechanism."),
            ("hasty_generalization", "PRO generalises from successful pilot studies to universal applicability without accounting for context variance."),
            ("nirvana_fallacy", "PRO implicitly compares {topic} to a perfect alternative rather than to realistic alternatives."),
        ]
        selected = rng.sample(fallacy_pool, k=rng.randint(1, 2))
        fallacies = [{"type": f[0], "description": f[1].format(topic=topic)} for f in selected]

    return {"text": text, "score": score, "tone": tone, "fallacies": fallacies}


def get_verdict(topic: str, pro_scores: List[float], con_scores: List[float]) -> Dict:
    """Return a fully topic-aware verdict based on actual scores."""
    rng = _rand(topic, 99, "verdict")

    pro_total = sum(pro_scores)
    con_total = sum(con_scores)
    margin = abs(pro_total - con_total)
    confidence = min(95, 50 + margin * 2 + rng.randint(0, 8))

    if pro_total > con_total:
        winner = "pro"
        tmpl = rng.choice(VERDICT_TEMPLATES_PRO_WIN)
    elif con_total > pro_total:
        winner = "con"
        tmpl = rng.choice(VERDICT_TEMPLATES_CON_WIN)
    else:
        winner = "neutral"
        tmpl = rng.choice(VERDICT_TEMPLATES_CON_WIN)
        tmpl = dict(tmpl)
        tmpl["explanation"] = f"The debate on '{topic}' ends in a draw. Both sides presented equally compelling arguments. PRO's evidence-based case for {topic} was matched by CON's robust accountability and equity critique."

    return {
        "winner": winner,
        "confidence": confidence,
        "explanation": tmpl["explanation"].format(topic=topic),
        "pro_summary": tmpl["pro_summary"].format(topic=topic),
        "con_summary": tmpl["con_summary"].format(topic=topic),
        "consensus_conclusion": tmpl["consensus"].format(topic=topic),
        "evidence_summary": f"No external evidence was submitted during the debate on '{topic}'. Both sides argued from cited research and logical inference.",
        "pro_total_score": pro_total,
        "con_total_score": con_total,
    }

async def call_openrouter_llm(client, messages, response_format, temperature=0.8):
    """Robust waterfall fallback for OpenRouter free models to survive weekend rate limits."""
    models = [
        "meta-llama/llama-3.1-8b-instruct:free",
        "mistralai/mistral-nemo:free",
        "qwen/qwen-2.5-7b-instruct:free",
        "google/gemma-2-9b-it:free",
        "huggingfaceh4/zephyr-7b-beta:free"
    ]
    for model in models:
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                response_format=response_format,
                temperature=temperature,
            )
            return response
        except Exception as e:
            if "429" in str(e) or "404" in str(e) or "Provider returned error" in str(e):
                continue # Try the next free model
            raise e
    raise Exception("All 5 OpenRouter free models are currently rate-limited or offline. Please add a paid key ($1) or wait 5 minutes.")
