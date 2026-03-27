'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Swords, Scale } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden mesh-bg p-8">
      {/* 🎭 THEATRICAL AMBIANCE */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pro-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-con-primary/10 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 flex items-center gap-3 shadow-2xl"
        >
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-pro-primary border-2 border-slate-950 flex items-center justify-center text-[10px]">P</div>
            <div className="w-6 h-6 rounded-full bg-con-primary border-2 border-slate-950 flex items-center justify-center text-[10px]">C</div>
            <div className="w-6 h-6 rounded-full bg-judge-primary border-2 border-slate-950 flex items-center justify-center text-[10px]">J</div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap text-text-muted">
            The Future of <span className="text-white">Structured Debate</span>
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] mb-6">
            <span className="text-white">AI</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pro-primary via-accent-purple to-con-primary">ARENA</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-text-muted font-medium leading-relaxed">
            Witness an autonomous intellectual battleground where titan intelligences collide.
          </p>
        </motion.div>

        {/* 🚀 THE INPUT CORE */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pro-primary to-con-primary rounded-[3rem] blur opacity-10 group-focus-within:opacity-30 transition duration-1000 group-focus-within:duration-200" />
          
          <div className="relative flex items-center p-2 bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="pl-6 text-2xl">⚔️</div>
            <input
              autoFocus
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Summon a topic for debate..."
              className="flex-1 bg-transparent px-6 py-8 text-xl md:text-2xl text-white placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={topic.trim().length < 5}
              className="mr-2 h-16 px-10 rounded-[1.8rem] bg-white text-black font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-pro-primary hover:text-white transition-all disabled:opacity-20 disabled:grayscale"
            >
              INITIALIZE <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        {/* Examples Ticker */}
        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-text-muted opacity-50">
              <Sparkles size={14} className="text-pro-primary" /> 
              Instant Prompts
           </div>
           <div className="h-10 overflow-hidden relative w-full flex justify-center">
             <AnimatePresence mode="wait">
               <motion.button
                 key={exampleIndex}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 onClick={() => setTopic(EXAMPLES[exampleIndex])}
                 className="text-sm md:text-base font-bold text-text-muted hover:text-pro-primary transition-colors cursor-pointer text-center italic"
               >
                 "{EXAMPLES[exampleIndex]}"
               </motion.button>
             </AnimatePresence>
           </div>
        </div>

        {/* Feature Icons */}
        <div className="mt-24 grid grid-cols-3 gap-12 border-t border-white/5 pt-12">
           <Feature icon={<Swords className="text-pro-primary" />} label="Multi-Agent" />
           <Feature icon={<Shield className="text-con-primary" />} label="Fact Verified" />
           <Feature icon={<Scale className="text-judge-primary" />} label="Explainable" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
       <div className="p-4 rounded-2xl bg-white/5 border border-white/10">{icon}</div>
       <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
}
