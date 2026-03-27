'use client';

import { motion } from 'framer-motion';
import { Award, Target, BookOpen, Lightbulb, Users, BarChart3, FileText, Zap, Shield } from 'lucide-react';
import { VerdictResponse } from '../types';

interface JudgeVerdictProps {
  verdict: VerdictResponse;
}

export default function JudgeVerdict({ verdict }: JudgeVerdictProps) {
  const isNeutral = verdict.winner === 'neutral';
  const winnerColor = verdict.winner === 'pro' ? '#3b82f6' : verdict.winner === 'con' ? '#f43f5e' : '#f59e0b';
  const winnerLabel = verdict.winner === 'pro' ? 'PRO ADVOCATE' : verdict.winner === 'con' ? 'CON CHALLENGER' : 'DRAW';

  const proTotal = verdict.pro_total_score;
  const conTotal = verdict.con_total_score;
  const grandTotal = proTotal + conTotal;
  const proPercent = grandTotal > 0 ? Math.round((proTotal / grandTotal) * 100) : 50;
  const conPercent = 100 - proPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* ===== WINNER BANNER ===== */}
      <div
        className="rounded-[2rem] p-1 mb-6 shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${winnerColor}60, ${winnerColor}20)` }}
      >
        <div className="bg-slate-950/95 backdrop-blur-3xl rounded-[1.8rem] p-10 flex flex-col items-center text-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
            style={{ background: `${winnerColor}15`, border: `1px solid ${winnerColor}40` }}
          >
            {isNeutral ? '⚖️' : '🏆'}
          </motion.div>

          <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">Final Adjudication</p>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">The <span style={{ color: winnerColor }} className="underline decoration-4 underline-offset-8">Verdict</span></h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-4xl font-black italic" style={{ color: winnerColor }}>{winnerLabel}</div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black mono text-white">{verdict.confidence}%</div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Confidence</div>
            </div>
          </div>

          <p className="max-w-3xl text-base font-medium text-text-muted leading-relaxed italic">"{verdict.explanation}"</p>
        </div>
      </div>

      {/* ===== SCORECARD ===== */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-text-muted" />
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Performance Scorecard</h3>
        </div>

        {/* PRO Score Bar */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pro-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Pro Advocate</span>
            </div>
            <span className="text-sm font-black mono" style={{ color: '#3b82f6' }}>{proTotal} pts ({proPercent}%)</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proPercent}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
            />
          </div>
        </div>

        {/* CON Score Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-con-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Con Challenger</span>
            </div>
            <span className="text-sm font-black mono" style={{ color: '#f43f5e' }}>{conTotal} pts ({conPercent}%)</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${conPercent}%` }}
              transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }}
            />
          </div>
        </div>
      </div>

      {/* ===== ARGUMENT SUMMARIES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* PRO Summary */}
        <div className="rounded-2xl p-6 border border-pro-primary/20" style={{ background: 'rgba(59,130,246,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Zap className="w-4 h-4 text-pro-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Argument Summary</p>
              <h4 className="text-xs font-black uppercase tracking-wider text-pro-primary">PRO ADVOCATE</h4>
            </div>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{verdict.pro_summary}</p>
        </div>

        {/* CON Summary */}
        <div className="rounded-2xl p-6 border border-con-primary/20" style={{ background: 'rgba(244,63,94,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,63,94,0.1)' }}>
              <Shield className="w-4 h-4 text-con-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Argument Summary</p>
              <h4 className="text-xs font-black uppercase tracking-wider text-con-primary">CON CHALLENGER</h4>
            </div>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{verdict.con_summary}</p>
        </div>
      </div>

      {/* ===== CONSENSUS ===== */}
      <div className="rounded-2xl p-6 border border-accent-purple/20 mb-5" style={{ background: 'rgba(139,92,246,0.04)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-accent-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">The Middle Ground</h3>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">{verdict.consensus_conclusion}</p>
      </div>

      {/* ===== EVIDENCE AUDIT ===== */}
      <div className="rounded-2xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-text-muted" />
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Evidence Audit</span>
        </div>
        <p className="text-[11px] text-text-muted italic">{verdict.evidence_summary}</p>
      </div>
    </motion.div>
  );
}
