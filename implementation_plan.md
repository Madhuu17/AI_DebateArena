# AI Debate Arena — Implementation Plan

A multi-agent AI system where Pro, Con, and Judge AI agents conduct a structured 3-round debate on any topic. Humans can intervene with evidence and questions (but cannot debate). The Judge scores, detects fallacies, verifies evidence, and delivers a final verdict.

## User Review Required

> [!IMPORTANT]
> **API Keys Required:** Before the backend can run, you must add the following keys to `backend/.env`:
> - `OPENAI_API_KEY` — Powers all 3 agents + Vision
> - `TAVILY_API_KEY` — Powers the Judge's real-time fact-checking
> - `MONGODB_URI` — Your MongoDB Atlas (or local) connection string

> [!WARNING]
> **GitHub Pushes:** After each stage (Frontend, Backend, DB), we will push to `https://github.com/Madhuu17/AI_DebateArena.git`. Make sure you have git credentials configured on this machine.

---

## Proposed Changes

### Stage 1 — Project Scaffold

#### [NEW] Project Root in `c:/Users/madhu/BMSCE-Hackathon`
- Initialize git, connect to remote repo
- Create `frontend/` via `create-next-app`
- Create `backend/` folder with Python virtual environment
- Create `README.md`

---

### Stage 2 — Frontend (Next.js + Tailwind)

#### [NEW] `frontend/src/app/globals.css`
Design system: custom CSS variables for agent colors (Pro = blue, Con = red, Judge = gold), dark theme base, font imports (Inter from Google Fonts), animation keyframes for score bars.

#### [NEW] `frontend/src/types/index.ts`
TypeScript interfaces: `DebateState`, `Argument`, `EvidenceResult`, `FallacyTag`, `Verdict`, `AgentPersona`.

#### [NEW] `frontend/src/lib/api.ts`
Fetch wrappers for all backend endpoints: `startDebate()`, `submitEvidence()`, `getUserTurn()`, `getVerdict()`. Uses SSE/polling for real-time updates.

#### [NEW] `frontend/src/hooks/useDebate.ts`
Central React state hook: manages `topic`, `rounds`, `arguments[]`, `evidenceResults[]`, `verdict`, `currentRound`, `isLoading`.

#### [NEW] `frontend/src/components/TopicInput.tsx`
Hero section. Full-width, animated input where user types the debate topic and hits "Start Debate." Includes animated placeholder examples.

#### [NEW] `frontend/src/components/DebateArena.tsx`
Main 3-column layout: Pro (left, blue), Judge (center, gold), Con (right, red). Renders rounds and arguments from state. Handles SSE streaming updates.

#### [NEW] `frontend/src/components/AgentCard.tsx`
Header card for each agent showing: avatar icon, persona name, reasoning style tag (Logical / Emotional / Ethical), live round score.

#### [NEW] `frontend/src/components/ChatBubble.tsx`
Individual argument card. Contains: argument text, animated `ScoreBar`, fallacy warning badges (if any), emotion/tone tag (Aggressive 🔴 / Neutral ⚪ / Confident 🟢).

#### [NEW] `frontend/src/components/ScoreBar.tsx`
Animated 0–100 strength bar with color gradient (red→yellow→green). Uses CSS transitions to animate on mount.

#### [NEW] `frontend/src/components/EvidencePanel.tsx`
Sticky side panel with: file upload (image/document), URL text input, submit button. Displays evidence verification results with status labels (✅ Verified / ⚠️ Uncertain / ❌ False).

#### [NEW] `frontend/src/components/RoundTracker.tsx`
Top progress component showing Round 1 / 2 / 3 status with animated transitions between rounds.

#### [NEW] `frontend/src/components/JudgeVerdict.tsx`
Final verdict card (shown after Round 3). Displays: Pro/Con/Neutral verdict badge, confidence % gauge, detailed reasoning text, evidence validation summary.

#### [NEW] `frontend/src/app/page.tsx`
Root page. Conditionally renders `TopicInput` (before debate starts) or `DebateArena` + `EvidencePanel` (during debate).

---

### Stage 3 — Backend (FastAPI + LangGraph)

#### [NEW] `backend/app/main.py`
FastAPI app with CORS configured for `localhost:3000`. Mounts `/debate` and `/evidence` routers. Includes SSE streaming endpoint.

#### [NEW] `backend/app/config.py`
Loads `.env` variables: OpenAI key, Tavily key, MongoDB URI, Chroma path.

#### [NEW] `backend/app/models/schemas.py`
Pydantic models: `TopicRequest`, `ArgumentResponse`, `EvidenceRequest`, `EvidenceResponse`, `VerdictResponse`, `DebateState`.

#### [NEW] `backend/app/agents/prompts.py`
System prompt templates for:
- **Pro Agent** (Logical/evidence-driven persona)
- **Con Agent** (Ethical/emotional counter-reasoning persona)
- **Judge Agent** (Strict evaluator — must output structured JSON with `score`, `fallacies[]`, `tone`, `fact_check`)

#### [NEW] `backend/app/agents/pro_agent.py`
LangChain runnable. Given debate history + round context, generates the Pro argument. Uses OpenAI GPT-4o.

#### [NEW] `backend/app/agents/con_agent.py`
Same pattern as Pro Agent, opposite persona.

#### [NEW] `backend/app/agents/judge_agent.py`
Most complex agent. Given a list of arguments, outputs structured JSON. Has access to Tavily search tool for fact-checking. Uses GPT-4o Vision for image evidence.

#### [NEW] `backend/app/graph/debate_graph.py`
LangGraph `StateGraph` defining the debate loop:
- **Nodes:** `pro_node`, `con_node`, `judge_node`, `human_node`, `verdict_node`
- **Edges:** Enforces strict round order. Conditional edge after Round 3 → `verdict_node`.
- **State:** `DebateState` (typed dict with history, round number, scores, etc.)

#### [NEW] `backend/app/services/scoring.py`
Parses Judge JSON output. Calculates final weighted score (logic 40%, evidence 40%, clarity 20%).

#### [NEW] `backend/app/services/fallacy.py`
Post-processing helper. Maps raw fallacy strings from Judge to structured `FallacyTag` objects with descriptions.

#### [NEW] `backend/app/services/evidence.py`
Handles file uploads. Dispatches to GPT-4o Vision (images) or text extraction (documents/URLs) before passing to Judge.

#### [NEW] `backend/app/services/search.py`
Tavily API wrapper. Given a claim string, returns top-3 credible source summaries for the Judge to use.

#### [NEW] `backend/app/routes/debate.py`
- `POST /debate/start` — Starts a new debate session
- `GET /debate/{session_id}/stream` — SSE stream of debate events
- `POST /debate/{session_id}/human` — Injects human statement/question

#### [NEW] `backend/app/routes/evidence.py`
- `POST /evidence/submit` — Accepts file or URL, runs verification, returns result

---

### Stage 4 — Databases

#### [NEW] `backend/app/db/mongo.py`
MongoDB async client (Motor). Collection: `debates`. Stores full debate document per session.

#### [NEW] `backend/app/db/chroma.py`
ChromaDB client. Collection: `debate_arguments`. Embeds each argument using OpenAI `text-embedding-3-small`. Used by Judge to detect cross-round contradictions.

---

## Verification Plan

### Automated Tests
None for hackathon (time constraint). We will rely on manual flow testing.

### Manual Verification (Stage by Stage)

**Frontend (Stage 2):**
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000`. Verify:
- [ ] Topic input renders, animations fire on typing
- [ ] "Start Debate" button transitions to DebateArena view
- [ ] All 3 columns visible (Pro/Judge/Con)
- [ ] ScoreBar animates from 0 → score on mount
- [ ] EvidencePanel renders and file upload input works
- [ ] RoundTracker shows correct round
- [ ] JudgeVerdict card renders with mock data

**Backend (Stage 3):**
```bash
cd backend
uvicorn app.main:app --reload
```
Open `http://localhost:8000/docs`. Verify:
- [ ] `POST /debate/start` returns a session ID
- [ ] `GET /debate/{id}/stream` returns SSE events
- [ ] `POST /evidence/submit` with a test image URL returns `{ status: "Verified" }`

**Full Integration (Stage 5):**
Run both servers simultaneously. Enter topic "AI will replace doctors" and verify complete 3-round debate flows to a final verdict.
