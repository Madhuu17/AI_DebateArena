from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
import uuid


class TopicRequest(BaseModel):
    topic: str = Field(..., min_length=5, max_length=500, description="The debate topic")


class FallacyTag(BaseModel):
    type: str
    description: str


class ArgumentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent: Literal["pro", "con", "judge"]
    round: int
    round_type: Literal["opening", "rebuttal", "closing"]
    text: str
    score: float = Field(ge=0.0, le=1.0)
    tone: Literal["aggressive", "neutral", "confident", "emotional", "logical"]
    fallacies: List[FallacyTag] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HumanInputRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    type: Literal["statement", "question"] = "statement"


class EvidenceRequest(BaseModel):
    session_id: str
    type: Literal["url", "text"]
    content: str


class EvidenceResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["verified", "uncertain", "false"]
    explanation: str
    sources: Optional[List[str]] = []


class VerdictResponse(BaseModel):
    winner: Literal["pro", "con", "neutral"]
    confidence: int = Field(ge=0, le=100)
    explanation: str
    pro_summary: str
    con_summary: str
    pro_draft: str = ""
    con_draft: str = ""
    consensus_conclusion: str
    evidence_summary: str
    pro_total_score: float
    con_total_score: float


class DebateSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic: str
    status: Literal["running", "complete", "error"] = "running"
    current_round: int = 1
    arguments: List[ArgumentResponse] = []
    verdict: Optional[VerdictResponse] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class StartDebateResponse(BaseModel):
    session_id: str
    topic: str
    message: str = "Debate started successfully"
