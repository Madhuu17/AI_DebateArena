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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* 🌌 CYBERPUNK/INDUSTRIAL BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Sharp Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        
        {/* Industrial Glows */}
        <div className="absolute top-0 left-[20%] w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 right-[20%] w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)] mix-blend-screen pointer-events-none" />
        
        <FloatingQuotes />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        


        {/* 🎆 Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-7xl md:text-[140px] font-black italic tracking-tighter uppercase leading-[0.85] mb-8 relative flex items-center justify-center gap-4 md:gap-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/20 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">AI</span> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-cyan-500 to-blue-600 drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]">ARENA</span>
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
          {/* Industrial Cyber Focus Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-[3rem] blur-xl opacity-20 group-focus-within:opacity-70 transition duration-500" />
          
          <div className="relative flex items-center p-2.5 bg-[#0a0a0b]/80 backdrop-blur-3xl border border-cyan-500/30 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group-focus-within:border-cyan-400/80 transition-colors duration-500">
            <div className="pl-8 text-cyan-400 opacity-80 animate-pulse">
              <Zap size={24} />
            </div>
            <input
              autoFocus
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ENTER DEBATE PARAMETERS..."
              className="flex-1 bg-transparent px-6 py-6 text-xl md:text-2xl text-cyan-50 placeholder:text-cyan-500/30 font-mono tracking-widest focus:outline-none focus:ring-0 uppercase"
            />
            <button
              type="submit"
              disabled={topic.trim().length < 5}
              className="mr-2 h-[72px] px-12 rounded-[2.2rem] bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/50 text-cyan-300 font-black uppercase tracking-[0.3em] text-sm md:text-base flex items-center gap-3 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:bg-cyan-900/40 hover:text-cyan-100 transition-all duration-300 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
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
           <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              <Globe size={16} /> 
              TRENDING_PARAMETERS
           </div>
           <div className="h-12 overflow-hidden relative w-full flex justify-center items-center bg-black/40 border border-white/5 rounded-full backdrop-blur-sm">
             <AnimatePresence mode="wait">
               <motion.button
                 key={exampleIndex}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.4 }}
                 onClick={() => setTopic(EXAMPLES[exampleIndex])}
                 className="text-sm md:text-lg font-mono text-white/50 hover:text-cyan-300 transition-colors cursor-pointer text-center tracking-widest w-full px-8 uppercase"
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
    <div className={`p-8 rounded-[2rem] bg-[#0a0a0b]/60 backdrop-blur-xl border border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]`}>
       <div className={`absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${color}`} />
       <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:border-cyan-500/50 transition-colors duration-500">
         {icon}
       </div>
       <h3 className="text-xl font-black text-white mb-3 tracking-wide">{title}</h3>
       <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function FloatingQuotes() {
  const quotes = [
    { text: "He who knows only his own side of the case knows little of that.", author: "J.S. Mill", top: "15%", left: "5%", delay: 0 },
    { text: "Truth springs from argument amongst friends.", author: "David Hume", top: "60%", left: "8%", delay: 3 },
    { text: "It is better to debate a question without settling it than to settle a question without debating it.", author: "Joseph Joubert", top: "25%", right: "5%", delay: 1.5 },
    { text: "The unexamined life is not worth living.", author: "Socrates", top: "70%", right: "8%", delay: 4.5 }
  ];

  return (
    <>
      {quotes.map((q, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-30, 30, -30], 
            x: [-15, 15, -15],
            opacity: [0.02, 0.08, 0.02],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 20 + i * 3, repeat: Infinity, ease: "easeInOut", delay: q.delay }}
          className="absolute hidden xl:block pointer-events-none select-none z-0"
          style={{ top: q.top, left: q.left, right: q.right }}
        >
          <div className="max-w-[400px]">
            <p className="text-white font-serif italic text-3xl md:text-5xl leading-[1.2] tracking-tight drop-shadow-2xl">
              "{q.text}"
            </p>
            <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] mt-8 ml-6 drop-shadow-lg">
              — {q.author}
            </p>
          </div>
        </motion.div>
      ))}
    </>
  );
}
