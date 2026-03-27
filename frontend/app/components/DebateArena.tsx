'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, MessageSquare, ShieldCheck, Scale, Info } from 'lucide-react';
import { DebateState, EvidenceItem } from '../types';
import AgentCard from './AgentCard';
import ChatBubble from './ChatBubble';
import EvidencePanel from './EvidencePanel';
import JudgeVerdict from './JudgeVerdict';
import RoundTracker from './RoundTracker';

const ROUND_LABELS: Record<number, string> = {
  1: 'Opening Statements',
  2: 'Rebuttals & Cross',
  3: 'Closing Arguments',
};

interface DebateArenaProps {
  state: DebateState;
  onHumanSubmit: (content: string, type: 'statement' | 'question') => Promise<void>;
  onEvidenceAdd: (item: EvidenceItem) => void;
  onReset: () => void;
}

export default function DebateArena({ state, onHumanSubmit, onEvidenceAdd, onReset }: DebateArenaProps) {
  const [activeTab, setActiveTab] = useState<'arena' | 'evidence' | 'analysis'>('arena');
  const [humanStatement, setHumanStatement] = useState('');
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Sorting arguments chronologically for the central feed
  const sortedArgs = useMemo(() => {
    return [...state.arguments].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [state.arguments]);

  const proArgs = state.arguments.filter(a => a.agent === 'pro');
  const conArgs = state.arguments.filter(a => a.agent === 'con');
  const judgeArgs = state.arguments.filter(a => a.agent === 'judge');

  const proAvgScore = proArgs.length ? Math.round(proArgs.reduce((s, a) => s + a.score, 0) / proArgs.length) : 0;
  const conAvgScore = conArgs.length ? Math.round(conArgs.reduce((s, a) => s + a.score, 0) / conArgs.length) : 0;

  // Auto-scroll the feed
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedArgs.length, state.humanInputs.length]);

  const handleHumanSubmit = async () => {
    if (!humanStatement.trim()) return;
    await onHumanSubmit(humanStatement.trim(), 'statement');
    setHumanStatement('');
  };

  return (
    <div className="min-h-screen flex flex-col mesh-bg selection:bg-pro-primary/30">
      <div className="fixed inset-0 grad-pro opacity-30 pointer-events-none" />
      <div className="fixed inset-0 grad-con opacity-30 pointer-events-none" />

      {/* 🏟️ NEW HIGH-FIDELITY HEADER (Scoreboard) */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/10 px-8 py-4">
        <div className="max-w-[1800px] mx-auto grid grid-cols-3 items-center gap-8">
          {/* Logo & Topic */}
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">⚖️</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase italic">
                <span className="text-pro-primary">AI</span> Arena
              </span>
              <span className="text-xs text-text-muted font-medium truncate max-w-[250px] uppercase tracking-widest leading-none mt-1">
                {state.topic}
              </span>
            </div>
          </div>

          {/* Centered Scoreboard */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-10">
               <div className="flex flex-col items-center">
                  <div className="text-2xl font-black text-pro-primary mono tracking-tighter">{proAvgScore}</div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Logic</div>
               </div>
               <div className="h-12 w-px bg-white/10" />
               <div className="flex flex-col items-center">
                  <RoundTracker rounds={state.rounds} currentRound={state.currentRound} />
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2">
                    {ROUND_LABELS[state.currentRound] || 'Judging'}
                  </div>
               </div>
               <div className="h-12 w-px bg-white/10" />
               <div className="flex flex-col items-center">
                  <div className="text-2xl font-black text-con-primary mono tracking-tighter">{conAvgScore}</div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Ethics</div>
               </div>
            </div>
          </div>

          {/* Action & Status */}
          <div className="flex items-center justify-end gap-4">
            <AnimatePresence>
              {state.status === 'running' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 text-green-400 text-[10px] font-black tracking-[0.2em] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" /> LIVE BATTLE
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={onReset}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <RotateCcw className="w-5 h-5 text-text-muted group-hover:text-text-main group-hover:rotate-[-90deg] transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* 🎭 THE ARENA (Spacious Stage) */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-8 py-10">
        <div className="grid grid-cols-12 gap-10 items-start h-[calc(100vh-180px)]">
          
          {/* ⬅️ PRO PROFILE WING (Stationary) */}
          <section className="col-span-3 h-full flex flex-col gap-6">
            <AgentCard 
              agent="pro" 
              totalScore={proAvgScore} 
              isActive={state.currentAgent === 'pro'} 
              roundsComplete={proArgs.length}
            />
            <div className="glass-card flex-1 p-6 flex flex-col gap-6 overflow-hidden">
               <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShieldCheck className="w-4 h-4 text-pro-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Pro Strategy</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted">Persuasion</span>
                    <span className="text-xs font-bold text-pro-primary mono">{proAvgScore > 50 ? 'EXCEPTIONAL' : 'AVERAGE'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted">Evidence Depth</span>
                    <span className="text-xs font-bold text-pro-primary mono">{proArgs.length * 4}% Full</span>
                  </div>
               </div>
               <div className="mt-auto h-32 w-full bg-pro-primary/5 rounded-2xl border border-pro-primary/10 flex items-center justify-center italic text-[10px] text-pro-primary/60 text-center px-4">
                  "Data is the foundation of truth. I build upon the bedrock of verified consensus."
               </div>
            </div>
          </section>

          {/* ⚔️ CENTRAL STAGE (Chronorable Battle Feed) */}
          <section className="col-span-6 h-full flex flex-col glass-card p-0 overflow-hidden relative border-white/10">
            {/* Feed Tabs */}
            <div className="flex border-b border-white/10 sticky top-0 bg-bg-dark/80 backdrop-blur-md z-10 p-2 gap-2">
               <TabButton active={activeTab === 'arena'} icon={<Scale className="w-4 h-4" />} label="Debate Stage" onClick={() => setActiveTab('arena')} />
               <TabButton active={activeTab === 'analysis'} icon={<Info className="w-4 h-4" />} label="Live Analysis" onClick={() => setActiveTab('analysis')} />
               <TabButton active={activeTab === 'evidence'} icon={<MessageSquare className="w-4 h-4" />} label="Witness Box" onClick={() => setActiveTab('evidence')} />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">
               <AnimatePresence mode="popLayout">
                 {activeTab === 'arena' && (
                   <motion.div
                    key="arena-feed"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-10"
                   >
                     {sortedArgs.map((arg, i) => (
                       <div key={`${arg.id}`} className={`flex w-full ${arg.agent === 'con' ? 'justify-end' : 'justify-start'}`}>
                          <div className={arg.agent === 'judge' ? 'w-full px-4' : 'max-w-[88%]'}>
                            <ChatBubble
                              {...arg}
                              roundLabel={arg.agent === 'judge' ? 'Arbiter Review' : `Round ${arg.round} · ${arg.round_type?.toUpperCase() ?? ''}`}
                              index={i}
                            />
                          </div>
                       </div>
                     ))}
                     {/* Only show ThinkingPlaceholder when agent has no streaming arg yet */}
                     {(() => {
                       const streamingAgent = state.currentAgent;
                       if (!streamingAgent || streamingAgent === 'human') return null;
                       const alreadyStreaming = sortedArgs.some(a => a.agent === streamingAgent && a.isStreaming);
                       if (alreadyStreaming) return null;
                       return (
                         <div key="thinking" className={`flex w-full ${streamingAgent === 'con' ? 'justify-end' : 'justify-start'}`}>
                           <ThinkingPlaceholder color={streamingAgent === 'pro' ? '#3b82f6' : streamingAgent === 'con' ? '#f43f5e' : '#f59e0b'} />
                         </div>
                       );
                     })()}
                     {state.verdict && (
                        <motion.div key="verdict" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-10">
                            <JudgeVerdict verdict={state.verdict} />
                        </motion.div>
                     )}
                     <div ref={feedEndRef} />
                   </motion.div>
                 )}

                 {activeTab === 'analysis' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                       <h3 className="text-xl px-2">Judge's Comprehensive Review</h3>
                       {judgeArgs.map((arg, i) => (
                         <ChatBubble key={arg.id} {...arg} roundLabel={`Round ${arg.round} Analysis`} index={i} />
                       ))}
                       {judgeArgs.length === 0 && <p className="text-text-muted italic p-10 text-center">No analysis available yet.</p>}
                    </motion.div>
                 )}

                 {activeTab === 'evidence' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                       <EvidencePanel 
                          evidence={state.evidence} 
                          sessionId={state.sessionId || ''} 
                          onEvidenceSubmit={onEvidenceAdd}
                          humanStatement={humanStatement}
                          onHumanStatementChange={setHumanStatement}
                          onHumanSubmit={handleHumanSubmit}
                          isDebateActive={state.status === 'running'}
                       />
                       <div className="mt-8 space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">Human Interventions</h4>
                          {state.humanInputs.map(input => (
                            <div key={input.id} className="p-4 rounded-2xl bg-white/5 border border-purple-500/20 text-sm">
                               <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">PROMPTER</span>
                               {input.content}
                            </div>
                          ))}
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </section>

          {/* ➡️ CON PROFILE WING (Stationary) */}
          <section className="col-span-3 h-full flex flex-col gap-6">
            <AgentCard 
              agent="con" 
              totalScore={conAvgScore} 
              isActive={state.currentAgent === 'con'} 
              roundsComplete={conArgs.length}
            />
            <div className="glass-card flex-1 p-6 flex flex-col gap-6 overflow-hidden">
               <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShieldCheck className="w-4 h-4 text-con-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Con Strategy</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted">Critical Edge</span>
                    <span className="text-xs font-bold text-con-primary mono">{conAvgScore > 50 ? 'SHARP' : 'STABLE'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted">Fallacy Detection</span>
                    <span className="text-xs font-bold text-con-primary mono">ACTIVE</span>
                  </div>
               </div>
               <div className="mt-auto h-32 w-full bg-con-primary/5 rounded-2xl border border-con-primary/10 flex items-center justify-center italic text-[10px] text-con-primary/60 text-center px-4">
                  "Progress without caution is peril. I reveal the shadows cast by the opposition's light."
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* ⚠️ ERRORS */}
      <AnimatePresence>
        {state.error && (
          <motion.div 
            initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl bg-con-primary border border-white/20 text-white font-bold shadow-2xl z-[100]"
          >
            SYSTEM ERROR: {state.error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
        active 
          ? 'bg-white/10 text-white shadow-lg' 
          : 'text-text-muted hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ThinkingPlaceholder({ color }: { color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i} 
              className="w-2 h-2 rounded-full" 
              style={{ background: color }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
      </div>
      <span className="text-[10px] uppercase tracking-widest font-black" style={{ color }}>Transmitting Argument...</span>
    </motion.div>
  );
}
