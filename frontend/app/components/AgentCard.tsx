'use client';

import { motion } from 'framer-motion';
import { AgentType, AGENT_PERSONAS } from '../types';
import { Trophy, Activity, Zap, Shield } from 'lucide-react';

interface AgentCardProps {
  agent: AgentType;
  totalScore: number;
  isActive: boolean;
  roundsComplete: number;
}

const AGENT_THEMES: Record<AgentType, { 
  primary: string; glow: string; icon: any; shadow: string;
}> = {
  pro: { 
    primary: '#3b82f6', 
    glow: 'rgba(59, 130, 246, 0.8)', 
    icon: <Zap className="w-4 h-4" />, 
    shadow: 'shadow-[0_0_60px_-10px_rgba(59,130,246,0.3)]'
  },
  con: { 
    primary: '#f43f5e', 
    glow: 'rgba(244, 63, 94, 0.8)', 
    icon: <Shield className="w-4 h-4" />, 
    shadow: 'shadow-[0_0_60px_-10px_rgba(244,63,94,0.3)]'
  },
  judge: { 
    primary: '#f59e0b', 
    glow: 'rgba(245, 158, 11, 0.8)', 
    icon: <Activity className="w-4 h-4" />, 
    shadow: 'shadow-[0_0_60px_-10px_rgba(245,158,11,0.3)]'
  },
  human: { 
    primary: '#a855f7', 
    glow: 'rgba(168, 85, 247, 0.8)', 
    icon: <Trophy className="w-4 h-4" />, 
    shadow: 'shadow-[0_0_60px_-10px_rgba(168,85,247,0.3)]'
  },
};

export default function AgentCard({ agent, totalScore, isActive, roundsComplete }: AgentCardProps) {
  const persona = AGENT_PERSONAS[agent];
  const theme = AGENT_THEMES[agent];

  return (
    <motion.div
      initial={{ opacity: 0, x: agent === 'pro' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative glass-card overflow-hidden group ${isActive ? theme.shadow : ''}`}
      style={{ 
        border: isActive ? `1px solid ${theme.primary}50` : '1px solid rgba(255,255,255,0.05)',
        background: isActive ? `${theme.primary}05` : 'rgba(255,255,255,0.02)'
      }}
    >
      {/* Top Accent Bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1 transition-all duration-500"
        style={{ 
          background: isActive ? `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` : 'transparent',
          opacity: isActive ? 1 : 0
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Header: Icon + Name */}
        <div className="flex items-center gap-4">
           <motion.div 
             animate={isActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
             transition={{ duration: 4, repeat: Infinity }}
             className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl relative"
             style={{ background: `${theme.primary}20`, border: `1px solid ${theme.primary}40` }}
           >
              {persona.icon}
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: theme.primary }} />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: theme.primary }} />
                </span>
              )}
           </motion.div>
           
           <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
                    {agent.toUpperCase()}
                 </span>
                 {theme.icon}
              </div>
              <h3 className="text-xl font-black text-white leading-none mt-0.5">{persona.name}</h3>
           </div>
        </div>

        {/* Persona Style Tag */}
        <div className="px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 inline-block">
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">
             Personality: <span className="text-text-main">{persona.style}</span>
           </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
           <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Impact</span>
              <div className="flex items-end gap-1">
                 <span className="text-2xl font-black mono text-white leading-none">
                   {totalScore > 0 ? totalScore : '--'}
                 </span>
                 <span className="text-[10px] font-bold text-text-muted mb-1">PTS</span>
              </div>
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Round Activity</span>
              <div className="flex items-end gap-1">
                 <span className="text-2xl font-black mono text-white leading-none">{roundsComplete}</span>
                 <span className="text-[10px] font-bold text-text-muted mb-1">/ 3</span>
              </div>
           </div>
        </div>
      </div>

      {/* Background Graphic */}
      <div className="absolute -bottom-6 -right-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
         <div className="text-8xl font-black select-none pointer-events-none">{persona.icon}</div>
      </div>
    </motion.div>
  );
}
