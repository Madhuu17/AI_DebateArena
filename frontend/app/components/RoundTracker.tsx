'use client';

import { motion } from 'framer-motion';
import { RoundInfo } from '../types';
import { clsx } from 'clsx';

interface RoundTrackerProps {
  rounds: RoundInfo[];
  currentRound: number;
}

export default function RoundTracker({ rounds, currentRound }: RoundTrackerProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {rounds.map((round, i) => {
        const isComplete = round.status === 'complete';
        const isActive = round.status === 'active';
        const isPending = round.status === 'pending';

        return (
          <div key={round.number} className="flex items-center">
            {/* Connector line (before first item excluded) */}
            {i > 0 && (
              <div className="relative w-16 h-px mx-1">
                <div className="absolute inset-0 bg-[rgba(255,255,255,0.1)]" />
                {isComplete && (
                  <motion.div
                    className="absolute inset-0 bg-green-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{ transformOrigin: 'left' }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            )}

            {/* Round badge */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                  isComplete && 'border-green-500 bg-green-500/20 text-green-400',
                  isActive && 'border-blue-400 bg-blue-500/20 text-blue-400',
                  isPending && 'border-[var(--text-muted)] bg-transparent text-[var(--text-muted)]',
                )}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isComplete ? '✓' : round.number}
              </motion.div>
              <div className="text-center">
                <div className={clsx(
                  'text-xs font-semibold whitespace-nowrap',
                  isActive && 'text-blue-400',
                  isComplete && 'text-green-400',
                  isPending && 'text-[var(--text-muted)]',
                )}>
                  {round.label}
                </div>
                {isActive && (
                  <motion.div
                    className="text-xs text-[var(--text-muted)] text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    In Progress
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Final: Verdict badge */}
      <div className="flex items-center">
        <div className="relative w-16 h-px mx-1">
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.1)]" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center text-lg border-2',
            currentRound > 3
              ? 'border-amber-400 bg-amber-500/20 text-amber-400'
              : 'border-[var(--text-muted)] bg-transparent text-[var(--text-muted)]'
          )}>
            ⚖️
          </div>
          <div className={clsx(
            'text-xs font-semibold',
            currentRound > 3 ? 'text-amber-400' : 'text-[var(--text-muted)]'
          )}>
            Verdict
          </div>
        </div>
      </div>
    </div>
  );
}
