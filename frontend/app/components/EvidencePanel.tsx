'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, FileText, X, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { EvidenceItem, EvidenceStatus } from '../types';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  sessionId: string | null;
  onEvidenceSubmit: (item: EvidenceItem) => void;
  humanStatement: string;
  onHumanStatementChange: (val: string) => void;
  onHumanSubmit: () => void;
  isDebateActive: boolean;
}

const STATUS_CONFIG: Record<EvidenceStatus, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  verified: { icon: <CheckCircle size={14} />, label: 'Verified', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  uncertain: { icon: <AlertTriangle size={14} />, label: 'Uncertain', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  false: { icon: <XCircle size={14} />, label: 'False / Misleading', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  pending: { icon: <Loader2 size={14} className="animate-spin" />, label: 'Pending', color: '#8b949e', bg: 'rgba(139,148,158,0.1)' },
  analyzing: { icon: <Loader2 size={14} className="animate-spin" />, label: 'Analyzing...', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

export default function EvidencePanel({
  evidence, sessionId, onEvidenceSubmit, humanStatement, onHumanStatementChange, onHumanSubmit, isDebateActive
}: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<'statement' | 'url' | 'file'>('statement');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async () => {
    if (!url.trim() || !sessionId) return;
    setIsSubmitting(true);
    const item: EvidenceItem = {
      id: Date.now().toString(),
      type: 'url',
      content: url,
      status: 'analyzing',
      timestamp: new Date(),
    };
    onEvidenceSubmit(item);
    setUrl('');

    // Call backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evidence/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, type: 'url', content: url }),
      });
      const data = await res.json();
      onEvidenceSubmit({ ...item, status: data.status, explanation: data.explanation, sources: data.sources });
    } catch {
      onEvidenceSubmit({ ...item, status: 'uncertain', explanation: 'Could not verify at this time.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;
    setIsSubmitting(true);
    const item: EvidenceItem = {
      id: Date.now().toString(),
      type: 'image',
      content: URL.createObjectURL(file),
      fileName: file.name,
      status: 'analyzing',
      timestamp: new Date(),
    };
    onEvidenceSubmit(item);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evidence/submit-file`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onEvidenceSubmit({ ...item, status: data.status, explanation: data.explanation });
    } catch {
      onEvidenceSubmit({ ...item, status: 'uncertain', explanation: 'Could not analyze image.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Human Interaction Panel */}
      <div className="rounded-2xl p-4 glass" style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>👤</span> Your Input
        </h3>

        {/* Tabs */}
        <div className="flex gap-1 mb-3 bg-[rgba(255,255,255,0.04)] rounded-lg p-1">
          {(['statement', 'url', 'file'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab === 'url' ? '🔗 URL' : tab === 'file' ? '📎 File' : '💬 Statement'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'statement' && (
            <motion.div key="statement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <textarea
                value={humanStatement}
                onChange={(e) => onHumanStatementChange(e.target.value)}
                placeholder="Ask a question or provide a statement for the agents to respond to..."
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-purple-400/50 transition-colors"
                rows={3}
                disabled={!isDebateActive}
              />
              <button
                onClick={onHumanSubmit}
                disabled={!humanStatement.trim() || !isDebateActive}
                className="mt-2 w-full py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#a855f7' }}
              >
                Submit to Debate
              </button>
            </motion.div>
          )}
          {activeTab === 'url' && (
            <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste article or evidence URL..."
                  className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-400/50 transition-colors"
                  disabled={!isDebateActive || isSubmitting}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!url.trim() || !isDebateActive || isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#a855f7' }}
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
                </button>
              </div>
            </motion.div>
          )}
          {activeTab === 'file' && (
            <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={!isDebateActive || isSubmitting}
                className="w-full py-6 rounded-xl border-2 border-dashed border-[rgba(168,85,247,0.3)] text-center hover:border-purple-400/60 transition-all disabled:opacity-40 group"
              >
                <Upload size={20} className="mx-auto mb-2 text-[var(--text-muted)] group-hover:text-purple-400 transition-colors" />
                <span className="text-xs text-[var(--text-muted)] group-hover:text-purple-400 transition-colors">
                  Upload image or document
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf,.txt" className="hidden" onChange={handleFileUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isDebateActive && (
          <p className="text-xs text-[var(--text-muted)] mt-2 text-center">Start a debate to submit evidence</p>
        )}
      </div>

      {/* Evidence Log */}
      {evidence.length > 0 && (
        <div className="rounded-2xl p-4 glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">
            📋 Evidence Log
          </h3>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            <AnimatePresence>
              {evidence.map((item) => {
                const cfg = STATUS_CONFIG[item.status];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl p-3"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}40` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: cfg.color }}>
                        {item.type === 'url' ? '🔗' : item.type === 'image' ? '🖼️' : '📄'}{' '}
                        {item.type.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {item.fileName || item.content.substring(0, 60)}...
                    </p>
                    {item.explanation && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 italic">{item.explanation}</p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
