'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Swords, Scale, Zap, Globe, Lock } from 'lucide-react';

const EXAMPLES = [
  "Universal Basic Income is necessary in the age of AI",
  "Genetic engineering in humans should be banned",
  "Social media does more harm than good to democracy",
  "Space exploration is a waste of resources",
  "Nuclear energy is the only solution to climate change"
];

interface TopicInputProps {
  onSubmit: (topic: string) => void;
}

export default function TopicInput({ onSubmit }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (topic.trim().length >= 5) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#02040a]">
      {/* 🌌 CINEMATIC ANIMATED BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Core Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50], scale: [1, 1.2, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ x: [100, -100, 100], y: [50, -50, 50], scale: [1, 1.5, 1] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[30%] right-[15%] w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ y: [0, -100, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[40%] w-[400px] h-[400px] bg-pink-600/15 blur-[120px] rounded-full mix-blend-screen"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* 🏅 Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 flex items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-[#02040a] flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(59,130,246,0.5)]">P</div>
            <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-[#02040a] flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(244,63,94,0.5)]">C</div>
            <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-[#02040a] flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">J</div>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.4em] text-white/50">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">The Future of Debate</span>
          </span>
        </motion.div>

        {/* 🎆 Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-7xl md:text-[140px] font-black italic tracking-tighter uppercase leading-[0.85] mb-8 relative">
            <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">AI</span> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] ml-4 md:ml-8">ARENA</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-blue-100/60 font-medium leading-relaxed">
            Summon autonomous intelligences to battle over truth, logic, and ethics in real-time.
          </p>
        </motion.div>

        {/* 🚀 GLOWING INPUT TERMINAL */}
        <motion.form
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="w-full max-w-4xl relative group z-20"
        >
          {/* Intense Focus Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[3rem] blur-xl opacity-20 group-focus-within:opacity-60 transition duration-500" />
          
          <div className="relative flex items-center p-2.5 bg-[#050814]/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="pl-8 text-3xl opacity-80">⚖️</div>
            <input
              autoFocus
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., Universal Basic Income is necessary..."
              className="flex-1 bg-transparent px-6 py-6 text-xl md:text-3xl text-white placeholder:text-white/30 font-medium focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={topic.trim().length < 5}
              className="mr-2 h-[72px] px-12 rounded-[2.2rem] bg-white text-black font-black uppercase tracking-[0.2em] text-sm md:text-base flex items-center gap-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-lg"
            >
              INITIALIZE <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        {/* 🔮 Examples Ticker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-5 w-full max-w-2xl"
        >
           <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-white/30">
              <Sparkles size={16} className="text-purple-400" /> 
              Trending Prompts
           </div>
           <div className="h-12 overflow-hidden relative w-full flex justify-center items-center bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
             <AnimatePresence mode="wait">
               <motion.button
                 key={exampleIndex}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.4 }}
                 onClick={() => setTopic(EXAMPLES[exampleIndex])}
                 className="text-sm md:text-lg font-bold text-white/70 hover:text-white transition-colors cursor-pointer text-center italic tracking-wide w-full px-8"
               >
                 "{EXAMPLES[exampleIndex]}"
               </motion.button>
             </AnimatePresence>
           </div>
        </motion.div>

        {/* 🏛️ GLASSMORPHIC FEATURE CARDS (Filling the void) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        >
           <FeatureCard 
             icon={<Swords className="w-8 h-8 text-blue-400" />} 
             title="Autonomous Duel" 
             desc="Watch purely autonomous agents debate dynamically using custom adversarial prompting."
             color="from-blue-500/20 to-transparent border-blue-500/20"
           />
           <FeatureCard 
             icon={<Globe className="w-8 h-8 text-purple-400" />} 
             title="Live Web Data" 
             desc="Agents pull real-time surveys and datasets from the web to cite strictly verifiable facts."
             color="from-purple-500/20 to-transparent border-purple-500/20"
           />
           <FeatureCard 
             icon={<Scale className="w-8 h-8 text-amber-400" />} 
             title="Impartial Judge" 
             desc="A sovereign third-agent arbitrates logic, calls out fallacies, and drafts the final synthesis."
             color="from-amber-500/20 to-transparent border-amber-500/20"
           />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <div className={`p-8 rounded-[2rem] bg-white/[0.02] border backdrop-blur-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ${color}`}>
       <div className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${color}" />
       <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
         {icon}
       </div>
       <h3 className="text-xl font-black text-white mb-3 tracking-wide">{title}</h3>
       <p className="text-white/50 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
