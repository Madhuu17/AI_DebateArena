'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';

interface TopicInputProps {
  onStart: (topic: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TOPICS = [
  'AI will replace doctors within 10 years',
  'Social media does more harm than good',
  'Remote work is better than office work',
  'Nuclear energy is the future of clean power',
  'Cryptocurrencies should replace fiat currencies',
];

export default function TopicInput({ onStart, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);

  const handleSubmit = useCallback(() => {
    if (topic.trim()) onStart(topic.trim());
  }, [topic, onStart]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const useExample = () => {
    setTopic(EXAMPLE_TOPICS[exampleIndex % EXAMPLE_TOPICS.length]);
    setExampleIndex(i => i + 1);
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-2xl text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 uppercase tracking-widest"
          style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}
        >
          <Zap size={12} /> Multi-Agent AI Debate System
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-black mb-4 leading-none tracking-tight"
        >
          <span className="text-pro">AI</span>{' '}
          <span className="text-[var(--text-primary)]">Debate</span>{' '}
          <span className="text-con">Arena</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[var(--text-secondary)] text-lg mb-10 max-w-lg mx-auto leading-relaxed"
        >
          Watch intelligent AI agents debate any topic across 3 structured rounds. 
          Provide evidence. Let the Judge decide.
        </motion.p>

        {/* Agent badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {[
            { icon: '⚡', label: 'Pro Agent', color: '#3b82f6' },
            { icon: 'vs', label: '', color: '#484f58' },
            { icon: '🔥', label: 'Con Agent', color: '#ef4444' },
            { icon: '→', label: '', color: '#484f58' },
            { icon: '⚖️', label: 'AI Judge', color: '#f59e0b' },
          ].map((item, i) => (
            item.label ? (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40`, color: item.color }}
                >
                  {item.icon}
                </div>
                <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
              </div>
            ) : (
              <span key={i} className="text-[var(--text-muted)] font-bold">{item.icon}</span>
            )
          ))}
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(15,22,35,0.8)' }}
          >
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a debate topic..."
              className="w-full bg-transparent px-6 py-5 pr-36 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!topic.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={16} />
                </motion.div>
              ) : (
                <>Start <ChevronRight size={14} /></>
              )}
            </button>
          </div>

          {/* Example button */}
          <button
            onClick={useExample}
            className="mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors underline underline-offset-2"
            disabled={isLoading}
          >
            ✨ Try an example topic
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-6 mt-10 flex-wrap"
        >
          {[
            '🔄 3 Debate Rounds',
            '🎯 Fallacy Detection',
            '✅ Live Fact-Checking',
            '📊 Argument Scoring',
            '👤 Human Intervention',
          ].map((feat) => (
            <span key={feat} className="text-xs text-[var(--text-muted)]">{feat}</span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
