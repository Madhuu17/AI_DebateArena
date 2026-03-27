'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { AgentType, ToneType, FallacyTag, AGENT_PERSONAS } from '../types';
import ScoreBar from './ScoreBar';

interface ChatBubbleProps {
  agent: AgentType;
  text: string;
  score: number;
  tone: ToneType;
  fallacies: FallacyTag[];
  roundLabel: string;
  isStreaming?: boolean;
  index?: number;
}

const TONE_CONFIG: Record<ToneType, { label: string; icon: string; color: string }> = {
  aggressive: { label: 'Aggressive', icon: '🔴', color: 'rgba(239,68,68,0.15)' },
  neutral: { label: 'Neutral', icon: '⚪', color: 'rgba(148,163,184,0.15)' },
  confident: { label: 'Confident', icon: '🟢', color: 'rgba(34,197,94,0.15)' },
  emotional: { label: 'Emotional', icon: '🟡', color: 'rgba(245,158,11,0.15)' },
  logical: { label: 'Logical', icon: '🔵', color: 'rgba(59,130,246,0.15)' },
};

const FALLACY_COLORS: Record<string, string> = {
  strawman: '#f97316',
  false_cause: '#a855f7',
  emotional_appeal: '#ec4899',
  ad_hominem: '#ef4444',
  slippery_slope: '#f59e0b',
  false_dichotomy: '#06b6d4',
  hasty_generalization: '#84cc16',
};

export default function ChatBubble({
  agent, text, score, tone, fallacies, roundLabel, isStreaming = false, index = 0
}: ChatBubbleProps) {
  const persona = AGENT_PERSONAS[agent];
  const toneConfig = TONE_CONFIG[tone];

  const borderColor =
    agent === 'pro' ? 'var(--pro-border)' :
    agent === 'con' ? 'var(--con-border)' :
    'var(--judge-border)';

  const glowClass =
    agent === 'pro' ? 'pro-glow' :
    agent === 'con' ? 'con-glow' :
    'judge-glow';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className={clsx('rounded-xl p-4 glass', glowClass)}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{persona.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            {roundLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Tone badge */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: toneConfig.color, color: 'var(--text-primary)' }}
          >
            {toneConfig.icon} {toneConfig.label}
          </span>
        </div>
      </div>

      {/* Argument Text */}
      <div className="text-sm text-[var(--text-primary)] leading-relaxed mb-4 min-h-[40px]">
        {isStreaming ? (
          <span>
            {text}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="ml-1 inline-block w-0.5 h-4 bg-current align-middle"
            />
          </span>
        ) : text}
      </div>

      {/* Score Bar */}
      {!isStreaming && score > 0 && (
        <ScoreBar score={score} agentColor={persona.color as 'blue' | 'red' | 'amber'} />
      )}

      {/* Fallacy Tags */}
      {fallacies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-xs text-[var(--text-muted)] mr-1">⚠️ Fallacies:</span>
          {fallacies.map((f, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${FALLACY_COLORS[f.type] || '#6366f1'}25`,
                color: FALLACY_COLORS[f.type] || '#6366f1',
                border: `1px solid ${FALLACY_COLORS[f.type] || '#6366f1'}40`,
              }}
              title={f.description}
            >
              {f.type.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          <span className="text-xs text-[var(--text-muted)] ml-1">Generating...</span>
        </div>
      )}
    </motion.div>
  );
}
