# ⚖️ AI Debate Arena

A multi-agent AI system where Pro, Con, and Judge AI agents conduct a structured 3-round debate on any topic. Humans can submit evidence and questions without directly debating.

## 🚀 Tech Stack
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

## 🏗️ Project Structure
```
ai-debate-arena/
├── frontend/          # Next.js app
└── backend/           # FastAPI server
```

## ⚡ Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

**backend/.env**
```
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
MONGODB_URI=mongodb+srv://...
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📡 API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/debate/start` | Start a new debate session |
| GET | `/debate/{id}/stream` | SSE stream of debate events |
| POST | `/debate/{id}/human` | Inject human statement/question |
| POST | `/evidence/submit` | Verify URL evidence |
| POST | `/evidence/submit-file` | Verify image/doc evidence |
