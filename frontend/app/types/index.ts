export type AgentType = 'pro' | 'con' | 'judge' | 'human';
export type RoundType = 'opening' | 'rebuttal' | 'closing';
export type ToneType = 'aggressive' | 'neutral' | 'confident' | 'emotional' | 'logical';
export type EvidenceStatus = 'verified' | 'uncertain' | 'false' | 'pending' | 'analyzing';
export type VerdictType = 'pro' | 'con' | 'neutral';
export type RoundStatus = 'pending' | 'active' | 'complete';

export interface FallacyTag {
  type: string;
  description: string;
}

export interface Argument {
  id: string;
  agent: AgentType;
  round: number;
  roundType: RoundType;
  text: string;
  score: number;
  tone: ToneType;
  fallacies: FallacyTag[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface EvidenceItem {
  id: string;
  type: 'image' | 'url' | 'text';
  content: string;
  fileName?: string;
  status: EvidenceStatus;
  explanation?: string;
  sources?: string[];
  timestamp: Date;
}

export interface HumanInput {
  id: string;
  type: 'statement' | 'question' | 'evidence';
  content: string;
  timestamp: Date;
}

export interface RoundInfo {
  number: number;
  type: RoundType;
  label: string;
  status: RoundStatus;
}

export interface Verdict {
  winner: VerdictType;
  confidence: number;
  explanation: string;
  proSummary: string;
  conSummary: string;
  consensusConclusion: string;
  evidenceSummary: string;
  proTotalScore: number;
  conTotalScore: number;
}

export interface DebateState {
  sessionId: string | null;
  topic: string;
  status: 'idle' | 'running' | 'judging' | 'complete' | 'error';
  currentRound: number;
  currentAgent: AgentType | null;
  rounds: RoundInfo[];
  arguments: Argument[];
  evidence: EvidenceItem[];
  humanInputs: HumanInput[];
  verdict: Verdict | null;
  isLoading: boolean;
  error: string | null;
}

export interface AgentPersona {
  type: AgentType;
  name: string;
  style: string;
  icon: string;
  color: string;
  description: string;
}

export const AGENT_PERSONAS: Record<AgentType, AgentPersona> = {
  pro: {
    type: 'pro',
    name: 'Advocate',
    style: 'Evidence-Based',
    icon: '⚡',
    color: 'blue',
    description: 'Defends the proposition with data-driven logic',
  },
  con: {
    type: 'con',
    name: 'Challenger',
    style: 'Critical Thinker',
    icon: '🔥',
    color: 'red',
    description: 'Opposes the proposition with ethical scrutiny',
  },
  judge: {
    type: 'judge',
    name: 'Arbiter',
    style: 'Impartial Evaluator',
    icon: '⚖️',
    color: 'amber',
    description: 'Evaluates arguments, detects fallacies, verifies facts',
  },
  human: {
    type: 'human',
    name: 'Observer',
    style: 'Evidence Provider',
    icon: '👤',
    color: 'purple',
    description: 'Provides evidence and questions without debating',
  },
};

export const ROUND_INFO: RoundInfo[] = [
  { number: 1, type: 'opening', label: 'Opening Statements', status: 'pending' },
  { number: 2, type: 'rebuttal', label: 'Rebuttals', status: 'pending' },
  { number: 3, type: 'closing', label: 'Final Arguments', status: 'pending' },
];

export const FALLACY_DESCRIPTIONS: Record<string, string> = {
  'strawman': 'Misrepresenting opponent\'s argument',
  'false_cause': 'Assuming causation from correlation',
  'emotional_appeal': 'Using emotion instead of evidence',
  'ad_hominem': 'Attacking the person, not the argument',
  'slippery_slope': 'Assuming extreme outcomes without evidence',
  'false_dichotomy': 'Presenting only two options when more exist',
  'hasty_generalization': 'Drawing broad conclusions from limited examples',
};
