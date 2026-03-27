# ⚖️ AI Debate Arena

A multi-agent AI system where Pro, Con, and Judge AI agents conduct a structured 3-round debate on any topic. Humans can submit evidence and questions without directly debating.

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + Tailwind CSS + Framer Motion |
| Backend | FastAPI (Python) |
| AI Orchestration | LangGraph |
| LLM + Vision | OpenAI GPT-4o |
| Search / Fact-check | Tavily |
| Database | MongoDB |
| Vector DB | ChromaDB |

## 🎯 Features
- **3-Round Debate**: Opening → Rebuttal → Closing
- **Argument Scoring**: 0–100 real-time strength score
- **Fallacy Detection**: Strawman, false cause, emotional appeal, etc.
- **Evidence Verification**: Image (GPT-4o Vision) + URL fact-checking (Tavily)
- **Emotion/Tone Tags**: Aggressive, Confident, Neutral, Logical
- **Final Verdict**: Pro / Con / Neutral + confidence % + balanced conclusion
- **Human Intervention**: Submit evidence & questions (non-debating role)



