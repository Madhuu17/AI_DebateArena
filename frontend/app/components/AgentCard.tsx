'use client';

import { motion } from 'framer-motion';
import { AgentType, AGENT_PERSONAS } from '../types';

interface AgentCardProps {
  agent: AgentType;
  totalScore: number;
  isActive: boolean;
  roundsComplete: number;
}

const AGENT_STYLE: Record<AgentType, {
  bg: string; border: string; glow: string; nameColor: string;
}> = {
  pro: {
    bg: 'rgba(59,130,246,0.08)',
    border: 'var(--pro-border)',
    glow: '0 0 40px rgba(59,130,246,0.25)',
    nameColor: 'var(--pro-primary)',
  },
  con: {
    bg: 'rgba(239,68,68,0.08)',
    border: 'var(--con-border)',
    glow: '0 0 40px rgba(239,68,68,0.25)',
    nameColor: 'var(--con-primary)',
  },
  judge: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'var(--judge-border)',
    glow: '0 0 40px rgba(245,158,11,0.25)',
    nameColor: 'var(--judge-primary)',
  },
  human: {
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.4)',
    glow: '0 0 40px rgba(168,85,247,0.25)',
    nameColor: '#a855f7',
  },
};

export default function AgentCard({ agent, totalScore, isActive, roundsComplete }: AgentCardProps) {
  const persona = AGENT_PERSONAS[agent];
  const style = AGENT_STYLE[agent];

  return (
    <motion.div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: isActive ? style.glow : 'none',
      }}
      animate={isActive ? { boxShadow: [style.glow, '0 0 20px transparent', style.glow] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Active pulse ring */}
      {isActive && (
        <motion.div
          className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: style.nameColor }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${style.nameColor}20`, border: `1px solid ${style.border}` }}
          animate={isActive ? { rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {persona.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Role label */}
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-0.5 font-medium">
            {agent === 'pro' ? 'PRO SIDE' : agent === 'con' ? 'CON SIDE' : agent === 'judge' ? 'ARBITER' : 'OBSERVER'}
          </div>
          {/* Name */}
          <h3 className="text-lg font-bold leading-tight" style={{ color: style.nameColor }}>
            {persona.name}
          </h3>
          {/* Style tag */}
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
            style={{ background: `${style.nameColor}20`, color: style.nameColor }}
          >
            {persona.style}
          </span>
        </div>
      </div>

      {/* Stats row */}
      {agent !== 'human' && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="text-center">
            <div className="mono text-lg font-bold" style={{ color: style.nameColor }}>
              {totalScore > 0 ? Math.round(totalScore) : '—'}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="mono text-lg font-bold text-[var(--text-primary)]">{roundsComplete}</div>
            <div className="text-xs text-[var(--text-muted)]">Rounds</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)]'}`}>
              {isActive ? '● LIVE' : 'IDLE'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
