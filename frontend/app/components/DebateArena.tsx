'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Lightbulb } from 'lucide-react';
import { DebateState, EvidenceItem, AGENT_PERSONAS } from '../types';
import AgentCard from './AgentCard';
import ChatBubble from './ChatBubble';
import EvidencePanel from './EvidencePanel';
import JudgeVerdict from './JudgeVerdict';
import RoundTracker from './RoundTracker';

const ROUND_LABELS: Record<number, string> = {
  1: 'Opening',
  2: 'Rebuttal',
  3: 'Closing',
};

interface DebateArenaProps {
  state: DebateState;
  onHumanSubmit: (content: string, type: 'statement' | 'question') => Promise<void>;
  onEvidenceAdd: (item: EvidenceItem) => void;
  onReset: () => void;
}

export default function DebateArena({ state, onHumanSubmit, onEvidenceAdd, onReset }: DebateArenaProps) {
  const [humanStatement, setHumanStatement] = useState('');
  const proEndRef = useRef<HTMLDivElement>(null);
  const conEndRef = useRef<HTMLDivElement>(null);
  const judgeEndRef = useRef<HTMLDivElement>(null);

  const proArgs = useMemo(() => state.arguments.filter(a => a.agent === 'pro'), [state.arguments]);
  const conArgs = useMemo(() => state.arguments.filter(a => a.agent === 'con'), [state.arguments]);
  const judgeArgs = useMemo(() => state.arguments.filter(a => a.agent === 'judge'), [state.arguments]);

  const proAvgScore = proArgs.length ? Math.round(proArgs.reduce((s, a) => s + a.score, 0) / proArgs.length) : 0;
  const conAvgScore = conArgs.length ? Math.round(conArgs.reduce((s, a) => s + a.score, 0) / conArgs.length) : 0;

  // Auto-scroll each column
  useEffect(() => { proEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [proArgs.length]);
  useEffect(() => { conEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conArgs.length]);
  useEffect(() => { judgeEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [judgeArgs.length]);

  const handleHumanSubmit = async () => {
    if (!humanStatement.trim()) return;
    await onHumanSubmit(humanStatement.trim(), 'statement');
    setHumanStatement('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] bg-grid">
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass border-b border-[rgba(255,255,255,0.07)] px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xl">⚖️</span>
            <div>
              <div className="text-sm font-black tracking-tight">
                <span className="text-pro">AI</span> <span className="text-[var(--text-primary)]">Debate Arena</span>
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate max-w-[280px]">"{state.topic}"</div>
            </div>
          </div>

          {/* Round Tracker */}
          <div className="hidden lg:block">
            <RoundTracker rounds={state.rounds} currentRound={state.currentRound} />
          </div>

          {/* Status + Reset */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {state.status === 'running' && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> LIVE
              </motion.div>
            )}
            {state.status === 'complete' && (
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}>
                ✅ COMPLETE
              </div>
            )}
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <RotateCcw size={12} /> New Debate
            </button>
          </div>
        </div>
      </header>

      {/* Mobile round tracker */}
      <div className="lg:hidden px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
        <RoundTracker rounds={state.rounds} currentRound={state.currentRound} />
      </div>

      {/* Main 4-column layout */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr_300px] gap-4">

        {/* === PRO COLUMN === */}
        <div className="flex flex-col gap-3">
          <AgentCard
            agent="pro"
            totalScore={proAvgScore}
            isActive={state.currentAgent === 'pro'}
            roundsComplete={proArgs.length}
          />
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-240px)] pr-1">
            <AnimatePresence>
              {proArgs.map((arg, i) => (
                <ChatBubble
                  key={arg.id}
                  agent="pro"
                  text={arg.text}
                  score={arg.score}
                  tone={arg.tone}
                  fallacies={arg.fallacies}
                  roundLabel={`Round ${arg.round} · ${ROUND_LABELS[arg.round]}`}
                  isStreaming={arg.isStreaming}
                  index={i}
                />
              ))}
            </AnimatePresence>
            {state.currentAgent === 'pro' && proArgs.length === 0 && <ThinkingPlaceholder color="#3b82f6" label="Advocate" />}
            <div ref={proEndRef} />
          </div>
        </div>

        {/* === JUDGE COLUMN === */}
        <div className="flex flex-col gap-3">
          <AgentCard
            agent="judge"
            totalScore={0}
            isActive={state.currentAgent === 'judge'}
            roundsComplete={judgeArgs.length}
          />
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-240px)] pr-1">
            <AnimatePresence>
              {judgeArgs.map((arg, i) => (
                <ChatBubble
                  key={arg.id}
                  agent="judge"
                  text={arg.text}
                  score={arg.score}
                  tone={arg.tone}
                  fallacies={arg.fallacies}
                  roundLabel={`Round ${arg.round} · Analysis`}
                  isStreaming={arg.isStreaming}
                  index={i}
                />
              ))}
            </AnimatePresence>

            {/* Human inputs shown in judge column */}
            {state.humanInputs.map((input) => (
              <motion.div
                key={input.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-3 glass"
                style={{ border: '1px solid rgba(168,85,247,0.3)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
                    👤 Your {input.type}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{input.content}</p>
              </motion.div>
            ))}

            {state.currentAgent === 'judge' && <ThinkingPlaceholder color="#f59e0b" label="Arbiter" />}

            {/* Verdict */}
            {state.verdict && (
              <div className="mt-2">
                <JudgeVerdict verdict={state.verdict} />
              </div>
            )}

            <div ref={judgeEndRef} />
          </div>
        </div>

        {/* === CON COLUMN === */}
        <div className="flex flex-col gap-3">
          <AgentCard
            agent="con"
            totalScore={conAvgScore}
            isActive={state.currentAgent === 'con'}
            roundsComplete={conArgs.length}
          />
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-240px)] pr-1">
            <AnimatePresence>
              {conArgs.map((arg, i) => (
                <ChatBubble
                  key={arg.id}
                  agent="con"
                  text={arg.text}
                  score={arg.score}
                  tone={arg.tone}
                  fallacies={arg.fallacies}
                  roundLabel={`Round ${arg.round} · ${ROUND_LABELS[arg.round]}`}
                  isStreaming={arg.isStreaming}
                  index={i}
                />
              ))}
            </AnimatePresence>
            {state.currentAgent === 'con' && conArgs.length === 0 && <ThinkingPlaceholder color="#ef4444" label="Challenger" />}
            <div ref={conEndRef} />
          </div>
        </div>

        {/* === EVIDENCE / HUMAN COLUMN === */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl p-4 glass flex items-center gap-3"
            style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
              👤
            </div>
            <div>
              <div className="text-sm font-bold text-purple-400">Observer</div>
              <div className="text-xs text-[var(--text-muted)]">Evidence Provider</div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            <EvidencePanel
              evidence={state.evidence}
              sessionId={state.sessionId}
              onEvidenceSubmit={onEvidenceAdd}
              humanStatement={humanStatement}
              onHumanStatementChange={setHumanStatement}
              onHumanSubmit={handleHumanSubmit}
              isDebateActive={state.status === 'running'}
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-sm font-medium z-50"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}
        >
          ⚠️ {state.error}
        </motion.div>
      )}
    </div>
  );
}

function ThinkingPlaceholder({ color, label }: { color: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl p-4 shimmer"
      style={{ border: `1px solid ${color}30`, background: `${color}08` }}
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color }}>{label} is thinking...</span>
      </div>
    </motion.div>
  );
}
