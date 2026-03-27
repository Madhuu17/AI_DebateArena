'use client';

import { motion } from 'framer-motion';
import { Award, Target, BookOpen, Lightbulb, Users, BarChart3 } from 'lucide-react';
import { VerdictResponse } from '../types';

interface JudgeVerdictProps {
  verdict: VerdictResponse;
}

export default function JudgeVerdict({ verdict }: JudgeVerdictProps) {
  const isNeutral = verdict.winner === 'neutral';
  const winnerColor = verdict.winner === 'pro' ? '#3b82f6' : verdict.winner === 'con' ? '#f43f5e' : '#f59e0b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-1 w-full bg-gradient-to-br from-judge-primary/40 to-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.15)] overflow-hidden"
    >
      <div className="bg-slate-950/90 backdrop-blur-3xl rounded-[2.9rem] p-12 relative overflow-hidden">
        {/* 🎉 Floating Confetti background effect (Subtle) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)]" />

        {/* 🏆 Header: The Final Decision */}
        <div className="flex flex-col items-center text-center relative z-10 mb-16">
          <motion.div 
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl bg-judge-primary/10 border border-judge-primary/30 flex items-center justify-center text-5xl mb-6 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
          >
            {isNeutral ? '⚖️' : '🏆'}
          </motion.div>
          <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white mb-2">
            The <span className="text-judge-primary underline decoration-4 underline-offset-8">Verdict</span>
          </h2>
          <p className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">Final Adjudication Complete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* Winner Section */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-judge-primary/20 bg-judge-primary/5">
               <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-judge-primary" />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white">Dominant Party</h3>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-6xl font-black italic uppercase tracking-tighter" style={{ color: winnerColor }}>
                    {verdict.winner}
                  </div>
                  <div className="h-16 w-px bg-white/10" />
                  <div>
                    <div className="text-3xl font-black text-white mono leading-none">{verdict.confidence}%</div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Confidence</div>
                  </div>
               </div>
               <p className="mt-8 text-lg font-medium text-text-main leading-relaxed italic">
                 "{verdict.explanation}"
               </p>
            </div>

            <div className="glass-card p-8 border-white/5 space-y-6">
               <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-text-muted" />
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Final Point Totals</h4>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span>Advocate (Pro)</span>
                        <span className="mono text-pro-primary">{verdict.pro_total_score}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${verdict.pro_total_score}%` }} className="h-full bg-pro-primary" transition={{ duration: 1.5, delay: 0.5 }} />
                     </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span>Challenger (Con)</span>
                        <span className="mono text-con-primary">{verdict.con_total_score}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${verdict.con_total_score}%` }} className="h-full bg-con-primary" transition={{ duration: 1.5, delay: 0.5 }} />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Logic Summary Section */}
          <div className="space-y-8">
             <VerdictPoint icon={<Target className="text-pro-primary" />} label="Pro Merit" content={verdict.pro_summary} />
             <VerdictPoint icon={<BookOpen className="text-con-primary" />} label="Con Point" content={verdict.con_summary} />
             
             <div className="glass-card p-8 border-accent-purple/20 bg-accent-purple/5 relative overflow-hidden group">
                <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-accent-purple/10 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">The Middle Ground</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed relative z-10">
                  {verdict.consensus_conclusion}
                </p>
             </div>
          </div>
        </div>

        {/* 📋 Evidence Audit Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col items-center">
           <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] mb-4">Evidence Audit</span>
           <p className="max-w-2xl text-[11px] text-text-muted italic opacity-70">
             {verdict.evidence_summary}
           </p>
        </div>
      </div>
    </motion.div>
  );
}

function VerdictPoint({ icon, label, content }: { icon: any; label: string; content: string }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-white/10 group">
       <div className="flex items-center gap-3 mb-3">
          {icon}
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{label}</span>
       </div>
       <p className="text-sm text-text-main font-medium leading-relaxed">{content}</p>
    </div>
  );
}
