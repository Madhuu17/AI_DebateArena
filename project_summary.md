#  AI Debate Arena — Hackathon Summary

## What is it?

A **real-time, multi-agent AI debate system** where two autonomous AI agents (Advocate and Challenger) argue opposing sides of any user-provided topic, moderated by a third AI Judge — all streamed live, word-by-word, to the browser.

---

##  The Big Idea (Elevator Pitch)

> "We built a multi-agent AI system that can intelligently debate **any topic you give it** — in real-time, with streaming arguments, fallacy detection, live scoring, and an evidence-backed verdict with a detailed winner breakdown."

---

##  Architecture Overview

```
User enters topic
      │
      ▼
┌─────────────┐     REST POST /debate/start
│  Next.js    │ ──────────────────────────────► FastAPI Backend
│  Frontend   │ ◄──────────────────────────────
└─────────────┘     SSE /debate/{id}/stream
      │
      │  Real-time word-by-word streaming (SSE)
      ▼
┌─────────────────────────────────────────────┐
│              LangGraph Debate Engine         │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │ PRO     │  │  CON    │  │    JUDGE     │ │
│  │ Agent   │→ │ Agent   │→ │    Agent     │ │
│  └─────────┘  └─────────┘  └─────────────┘ │
│       Round 1 → Round 2 → Round 3 → Verdict │
└─────────────────────────────────────────────┘
      │
      ▼
  MongoDB (sessions) + ChromaDB (vector memory)
```

---

## Full Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **Next.js 16** (App Router) | React framework, SSR, routing |
| **TypeScript** | Type-safe frontend code |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations, streaming cursor, transitions |
| **Server-Sent Events (SSE)** | Real-time word-by-word streaming from backend |
| **Lucide React** | Icon library |

### Backend
| Technology | Role |
|---|---|
| **FastAPI** | High-performance async Python API |
| **LangGraph** | Multi-agent orchestration graph (Pro→Con→Judge loop) |
| **OpenAI GPT-4o** | AI reasoning engine for all 3 agents (live mode) |
| **Tavily Search API** | Real-time web evidence retrieval + fact-checking |
| **MongoDB (Motor async)** | Session persistence, human input queuing |
| **ChromaDB** | Vector store for debate memory & argument embeddings |
| **Python asyncio / SSE** | Async word-by-word streaming to frontend |

### Infrastructure
| Technology | Role |
|---|---|
| **uvicorn** | ASGI server for FastAPI |
| **python-dotenv** | Environment variable management |
| **DEMO_MODE flag** | Runs full AI debate without any API keys for demos |

---

## ⚙️ Key Features (What to Explain)

### 1. Multi-Agent Orchestration via LangGraph
- Three **specialized AI agents** run in a defined graph: PRO → CON → JUDGE, repeated for 3 rounds
- Each agent has its own **persona, system prompt, and scoring logic**
- The **Judge Agent** detects logical fallacies (strawman, false cause, emotional appeal, etc.) and scores each round
- A final **Verdict Agent** reads the full transcript and declares a winner with confidence score

### 2. Word-by-Word SSE Streaming
- Arguments are **streamed word-by-word** to the frontend via Server-Sent Events
- The backend emits `argument_stream` events every 3 words, then a final [argument](file:///C:/Users/madhu/BMSCE-Hackathon/backend/app/db/chroma.py#28-39) event with full scored data
- The frontend renders a **blinking typewriter cursor** during streaming
- Scores and fallacy tags are revealed only after each argument completes

### 3. Dynamic Topic Engine (DEMO_MODE)
- A custom [topic_engine.py](file:///C:/Users/madhu/BMSCE-Hackathon/backend/app/agents/topic_engine.py) generates **fully topic-aware arguments** for any user prompt
- Uses **MD5-seeded randomness** per (topic + round + side) — so scores and templates are consistent for the same topic but vary meaningfully between different topics
- 5 PRO templates × 5 CON templates × 3 JUDGE templates — each with `{topic}` injection
- Verdict is computed from **actual accumulated argument scores**, not hardcoded — so CON can genuinely beat PRO depending on the topic seed

### 4. Evidence System
- Users can submit **URLs or text** as evidence mid-debate
- URLs are fact-checked via **Tavily Search** and labeled verified/uncertain/false
- Images are analyzed via **GPT-4o Vision**

### 5. Human-in-the-Loop
- Users can inject **statements or questions** into the live debate
- The next agent reads the human input and incorporates it into their argument

### 6. Verdict with Dual Summaries
- Winner declared with **confidence percentage** (computed from score margins)
- **PRO Summary** and **CON Summary** cards showing each side's core argument in brief
- **Weighted score bars** (PRO % vs CON % of grand total)
- **Middle Ground consensus** paragraph — what both sides could agree on

---

##  Project Structure

```
BMSCE-Hackathon/
├── frontend/                      # Next.js app
│   ├── app/
│   │   ├── components/
│   │   │   ├── DebateArena.tsx    # Main 3-column stage layout
│   │   │   ├── ChatBubble.tsx     # Argument cards with streaming cursor
│   │   │   ├── JudgeVerdict.tsx   # Final verdict with summaries + scorecard
│   │   │   └── ScoreBar.tsx       # Animated score bars
│   │   ├── hooks/
│   │   │   └── useDebate.ts       # SSE + state management hook
│   │   ├── lib/api.ts             # Backend API client
│   │   └── types/index.ts         # Shared TypeScript types
│   └── .env.local                 # NEXT_PUBLIC_API_URL
│
└── backend/                       # FastAPI app
    ├── app/
    │   ├── agents/
    │   │   ├── pro_agent.py       # PRO Advocate agent
    │   │   ├── con_agent.py       # CON Challenger agent
    │   │   ├── judge_agent.py     # Judge + Verdict agents
    │   │   ├── topic_engine.py    # Dynamic topic-aware content generator
    │   │   └── prompts.py         # All system prompts
    │   ├── graph/
    │   │   └── debate_graph.py    # LangGraph SSE streaming orchestrator
    │   ├── db/
    │   │   └── mongo.py           # MongoDB + in-memory session store
    │   ├── models/schemas.py      # Pydantic data models
    │   ├── config.py              # DEMO_MODE, API keys
    │   └── main.py                # FastAPI app + routes
    └── .env                       # OPENAI_API_KEY, DEMO_MODE=True, etc.
```

---

##  Running the Project

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install --prefer-binary -r requirements.txt
# Set DEMO_MODE=True in .env (no API keys needed)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
# .env.local → NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```


##  Production Path 

- Connect real **OpenAI GPT-4o keys** → live, unrestricted debates
- Add **user login** + debate history timeline
- Add **audience voting** (WebSockets for multi-user)
- **Export debate transcript** as PDF or shareable link
- **Multi-language** debate support
