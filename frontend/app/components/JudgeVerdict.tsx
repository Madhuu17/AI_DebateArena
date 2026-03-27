'use client';

import { motion } from 'framer-motion';
import { Verdict, VerdictType } from '../types';

interface JudgeVerdictProps {
  verdict: Verdict;
}

const VERDICT_CONFIG: Record<VerdictType, { label: string; color: string; bg: string; icon: string }> = {
  pro: { label: 'PRO WINS', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '⚡' },
  con: { label: 'CON WINS', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '🔥' },
  neutral: { label: 'NEUTRAL', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '⚖️' },
};

export default function JudgeVerdict({ verdict }: JudgeVerdictProps) {
  const cfg = VERDICT_CONFIG[verdict.winner];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${cfg.color}50`, boxShadow: `0 0 60px ${cfg.color}25` }}
    >
      {/* Header Banner */}
      <div className="p-6 text-center relative overflow-hidden" style={{ background: cfg.bg }}>
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            background: `radial-gradient(circle at 30% 50%, ${cfg.color}, transparent 60%), radial-gradient(circle at 70% 50%, ${cfg.color}, transparent 60%)`,
          }}
        />
        <motion.div
          className="text-5xl mb-3"
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {cfg.icon}
        </motion.div>
        <div className="relative z-10">
          <div className="text-xs tracking-widest font-medium text-[var(--text-secondary)] mb-2 uppercase">
            ⚖️ Final Verdict
          </div>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: cfg.color }}>
            {cfg.label}
          </h2>
          {/* Confidence gauge */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs text-[var(--text-muted)]">Confidence</span>
            <div className="flex-1 max-w-[120px] h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cfg.color }}
                initial={{ width: 0 }}
                animate={{ width: `${verdict.confidence}%` }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </div>
            <span className="mono text-sm font-bold" style={{ color: cfg.color }}>
              {verdict.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 bg-[var(--bg-card)] flex flex-col gap-4">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">Pro Score</div>
            <div className="mono text-2xl font-black text-blue-400">{verdict.proTotalScore}</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">Con Score</div>
            <div className="mono text-2xl font-black text-red-400">{verdict.conTotalScore}</div>
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs text-amber-400 uppercase tracking-widest font-semibold mb-2">
            🧾 Judge's Reasoning
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{verdict.explanation}</p>
        </div>

        {/* Pro / Con summaries */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="text-xs text-blue-400 font-semibold mb-1">⚡ Best Pro Argument</div>
            <p className="text-xs text-[var(--text-secondary)]">{verdict.proSummary}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="text-xs text-red-400 font-semibold mb-1">🔥 Best Con Argument</div>
            <p className="text-xs text-[var(--text-secondary)]">{verdict.conSummary}</p>
          </div>
        </div>

        {/* Consensus */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">
            🤝 Balanced Conclusion
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{verdict.consensusConclusion}</p>
        </div>

        {/* Evidence summary */}
        {verdict.evidenceSummary && (
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-2">
              📌 Evidence Summary
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{verdict.evidenceSummary}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
