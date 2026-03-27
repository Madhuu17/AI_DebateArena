'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { AgentType, ToneType, FallacyTag, AGENT_PERSONAS } from '../types';
import ScoreBar from './ScoreBar';
import { Brain, Quote, AlertTriangle, Fingerprint, Scale } from 'lucide-react';

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

const TONE_THEMES: Record<ToneType, { label: string; icon: string; color: string; border: string }> = {
  aggressive: { label: 'Sharp', icon: '⚡', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
  neutral: { label: 'Neutral', icon: '⚖️', color: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)' },
  confident: { label: 'Dominant', icon: '🔥', color: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)' },
  emotional: { label: 'Nuanced', icon: '🌊', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  logical: { label: 'Analytical', icon: '🧠', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
};

const DEFAULT_TONE_THEME = TONE_THEMES.neutral;

const FALLACY_COLORS: Record<string, string> = {
  strawman: '#f97316',
  false_cause: '#a855f7',
  emotional_appeal: '#ec4899',
  ad_hominem: '#ef4444',
  slippery_slope: '#f59e0b',
  false_dichotomy: '#06b6d4',
  hasty_generalization: '#84cc16',
  nirvana_fallacy: '#8b5cf6',
};

const THEME_COLORS: Record<string, { border: string; bg: string; icon: string; cursorColor: string }> = {
  pro: { border: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.05)', icon: 'text-pro-primary', cursorColor: 'var(--pro-primary)' },
  con: { border: 'rgba(244, 63, 94, 0.4)', bg: 'rgba(244, 63, 94, 0.05)', icon: 'text-con-primary', cursorColor: 'var(--con-primary)' },
  judge: { border: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.05)', icon: 'text-judge-primary', cursorColor: 'var(--judge-primary)' },
  human: { border: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.05)', icon: 'text-accent-purple', cursorColor: 'var(--accent-purple)' },
};

const DEFAULT_THEME = THEME_COLORS.judge;

const cursorTransition = { duration: 0.5, repeat: Infinity, ease: 'linear' as const };
const cursorAnimate = { opacity: [1, 0] };

export default function ChatBubble({
  agent, text, score, tone, fallacies = [], roundLabel, isStreaming = false, index = 0
}: ChatBubbleProps) {
  const persona = AGENT_PERSONAS[agent];
  const toneTheme = TONE_THEMES[tone] ?? DEFAULT_TONE_THEME;
  const themeColors = THEME_COLORS[agent ?? 'judge'] ?? DEFAULT_THEME;
  const safeFallacies = Array.isArray(fallacies) ? fallacies : [];
  const safeText = text ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'relative group rounded-[2rem] p-8 shadow-2xl overflow-hidden',
        agent === 'pro' && 'border-l-4 rounded-tl-none',
        agent === 'con' && 'border-r-4 rounded-tr-none',
        agent === 'judge' && 'border-t-4 rounded-t-none mx-auto'
      )}
      style={{
        borderLeftColor: agent === 'pro' ? 'var(--pro-primary)' : undefined,
        borderRightColor: agent === 'con' ? 'var(--con-primary)' : undefined,
        borderColor: agent === 'judge' ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)',
        background: themeColors.bg,
        backdropFilter: 'blur(16px)',
        border: agent !== 'pro' && agent !== 'con' ? `1px solid ${themeColors.border}` : undefined,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.025] select-none pointer-events-none">
        {agent === 'pro' ? <Brain size={120} /> : agent === 'con' ? <Fingerprint size={120} /> : <Scale size={120} />}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${themeColors.icon}`}>
            {agent === 'judge' ? <Scale size={14} /> : <Quote size={14} />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            {roundLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border"
            style={{ backgroundColor: toneTheme.color, borderColor: toneTheme.border, color: '#fff' }}
          >
            {toneTheme.icon} {toneTheme.label}
          </span>
        </div>
      </div>

      {/* Main Argument Text */}
      <div className="relative z-10">
        <p
          className="text-lg font-medium text-white leading-[1.75] tracking-tight mb-8"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {safeText}
          {isStreaming && (
            <motion.span
              animate={cursorAnimate}
              transition={cursorTransition}
              className="ml-[3px] inline-block w-[3px] h-[1.1em] rounded-full align-middle"
              style={{ backgroundColor: themeColors.cursorColor, verticalAlign: 'text-bottom' }}
            />
          )}
        </p>
      </div>

      {/* Footer Metrics — hidden while streaming */}
      {!isStreaming && (
        <div className="flex flex-col gap-6 pt-6 border-t border-white/5 relative z-10">
          {score > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Argument Weight</span>
                <span className="mono text-text-main">{score}/100</span>
              </div>
              <ScoreBar score={score} agentColor={agent === 'pro' ? 'blue' : agent === 'con' ? 'red' : 'amber'} />
            </div>
          )}

          <AnimatePresence>
            {safeFallacies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {safeFallacies.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-xl border"
                    style={{
                      backgroundColor: `${FALLACY_COLORS[f.type] || '#fff'}10`,
                      borderColor: `${FALLACY_COLORS[f.type] || '#fff'}30`,
                      color: FALLACY_COLORS[f.type] || '#fff'
                    }}
                    title={f.description}
                  >
                    <AlertTriangle size={10} />
                    <span className="uppercase tracking-widest">{f.type.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
