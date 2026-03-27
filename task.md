# AI Debate Arena - Build Checklist

## Stage 1: Project Setup
- [ ] Check Git config and clone/init repo
- [ ] Scaffold Next.js frontend
- [ ] Scaffold FastAPI backend
- [ ] Create folder structure as designed

## Stage 2: Frontend UI (Next.js + Tailwind)
- [ ] Install dependencies (Tailwind, framer-motion, shadcn/ui, etc.)
- [ ] Build `globals.css` design system (colors, fonts, tokens)
- [ ] Build `TopicInput` component (hero section)
- [ ] Build `DebateArena` layout (3-column: Pro, Judge, Con)
- [ ] Build `ChatBubble` component (with tone/emotion tags)
- [ ] Build `AgentCard` component (persona header)
- [ ] Build `ScoreBar` component (0-100 animated strength bar)
- [ ] Build `EvidencePanel` component (upload + status labels)
- [ ] Build `JudgeVerdict` component (final verdict card)
- [ ] Build `RoundTracker` component (round progress indicator)
- [ ] Wire up `useDebate` hook (API calls + state)
- [ ] Wire up `api.ts` (fetch wrappers)
- [ ] Define `types/index.ts`
- [ ] Push frontend to GitHub

## Stage 3: Backend (FastAPI + LangGraph)
- [ ] Setup FastAPI `main.py` with CORS and routers
- [ ] Define `schemas.py` (Pydantic models)
- [ ] Write `prompts.py` (system prompts for Pro, Con, Judge)
- [ ] Build `pro_agent.py`
- [ ] Build `con_agent.py`
- [ ] Build `judge_agent.py`
- [ ] Build `debate_graph.py` (LangGraph state machine)
- [ ] Build `scoring.py` service
- [ ] Build `fallacy.py` service
- [ ] Build `evidence.py` service (image + URL)
- [ ] Build `search.py` (Tavily integration)
- [ ] Build `debate.py` route
- [ ] Build `evidence.py` route
- [ ] Push backend to GitHub

## Stage 4: Database
- [ ] Setup `mongo.py` (MongoDB connection)
- [ ] Setup `chroma.py` (ChromaDB connection)
- [ ] Push DB layer to GitHub

## Stage 5: Integration & Polish
- [ ] Connect frontend to backend APIs
- [ ] Test full debate flow end-to-end
- [ ] Final GitHub push with README
