'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ScoreBarProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  agentColor?: 'blue' | 'red' | 'amber';
}

export default function ScoreBar({ score, showLabel = true, size = 'md', agentColor }: ScoreBarProps) {
  const getScoreColor = (s: number) => {
    if (s >= 75) return '#22c55e';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const color = agentColor === 'blue' ? '#3b82f6' : agentColor === 'red' ? '#f43f5e' : agentColor === 'amber' ? '#f59e0b' : getScoreColor(score);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">Strength</span>
          <span className="mono text-xs font-bold" style={{ color }}>{score}/100</span>
        </div>
      )}
      <div className={clsx('w-full bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden', heightClass)}>
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
