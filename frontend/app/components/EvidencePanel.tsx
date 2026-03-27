'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Link as LinkIcon, FileImage, Type, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { EvidenceItem } from '../types';
import { verifyEvidence, verifyFileEvidence } from '../lib/api';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  sessionId: string;
  onEvidenceSubmit: (item: EvidenceItem) => void;
  humanStatement: string;
  onHumanStatementChange: (val: string) => void;
  onHumanSubmit: () => void;
  isDebateActive: boolean;
}

type TabType = 'text' | 'url' | 'file';

export default function EvidencePanel({
  evidence, sessionId, onEvidenceSubmit, humanStatement, onHumanStatementChange, onHumanSubmit, isDebateActive
}: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [inputVal, setInputVal] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (activeTab === 'file' && !file) return;
    if (activeTab !== 'file' && !inputVal.trim()) return;

    setIsVerifying(true);
    try {
      let result;
      if (activeTab === 'file' && file) {
        result = await verifyFileEvidence(file, sessionId);
      } else {
        result = await verifyEvidence(sessionId, activeTab === 'url' ? 'url' : 'text', inputVal);
      }
      onEvidenceSubmit(result);
      setInputVal('');
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* 🛠️ ACTION CONSOLE */}
      <div className="glass-card p-8 border-white/10 space-y-8">
        <div className="flex flex-col gap-2 mb-2">
           <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">Witness Box</h3>
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Supply Critical Evidence</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 gap-1">
          <EvidenceTab active={activeTab === 'text'} icon={<Type size={14} />} label="Text" onClick={() => setActiveTab('text')} />
          <EvidenceTab active={activeTab === 'url'} icon={<LinkIcon size={14} />} label="Link" onClick={() => setActiveTab('url')} />
          <EvidenceTab active={activeTab === 'file'} icon={<FileImage size={14} />} label="Image" onClick={() => setActiveTab('file')} />
        </div>

        <div className="space-y-4">
          {activeTab === 'file' ? (
             <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-white/10 rounded-2xl hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all cursor-pointer group">
                <FileImage className="w-8 h-8 text-text-muted mb-2 group-hover:text-accent-purple transition-colors" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{file ? file.name : 'Select Image File'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
             </label>
          ) : (
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={activeTab === 'url' ? 'Paste source URL...' : 'Enter factual claim...'}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-accent-purple/40 transition-all resize-none"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={isVerifying || !isDebateActive || (activeTab === 'file' ? !file : !inputVal.trim())}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-30 enabled:hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(90deg, #8b5cf6, #d946ef)', 
              boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.4)' 
            }}
          >
            {isVerifying ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <>SUBMIT EVIDENCE <Send className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-white/10">
           <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Direct Statement</span>
           </div>
           <div className="flex gap-2">
              <input
                value={humanStatement}
                onChange={(e) => onHumanStatementChange(e.target.value)}
                placeholder="Ask a question or add a point..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-main focus:outline-none focus:border-pro-primary/40 transition-all"
              />
              <button 
                onClick={onHumanSubmit}
                disabled={!humanStatement.trim() || !isDebateActive}
                className="p-3 bg-pro-primary/10 border border-pro-primary/30 text-pro-primary rounded-xl hover:bg-pro-primary/20 disabled:opacity-30 transition-all"
              >
                <div className="uppercase text-[10px] font-black">Post</div>
              </button>
           </div>
        </div>
      </div>

      {/* 📋 EVIDENCE LOG */}
      <div className="flex flex-col gap-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted px-2">Fact Check Record</h4>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {evidence.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 border-white/5 bg-white/[0.02] flex flex-col gap-3 group overflow-hidden"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'verified' ? 'text-green-400' : 
                        item.status === 'false' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                   </div>
                   <div className="text-[9px] text-text-muted uppercase transition-all opacity-0 group-hover:opacity-100 italic">LOG {item.id.slice(0, 4)}</div>
                </div>
                <p className="text-xs font-bold text-text-main leading-relaxed">{item.explanation}</p>
                {item.sources && item.sources.length > 0 && (
                   <div className="flex flex-wrap gap-2 pt-1">
                      {item.sources.map((s, j) => (
                        <div key={j} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-text-muted">
                           {s.replace(/^https?:\/\/www\./, '').split('/')[0]}
                        </div>
                      ))}
                   </div>
                )}
              </motion.div>
            ))}
            {evidence.length === 0 && (
              <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="w-10 h-10 text-text-muted/20" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Waiting for evidence</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EvidenceTab({ active, icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
        active ? 'bg-white/10 text-white shadow-lg' : 'text-text-muted hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusIcon({ status }: { status: EvidenceItem['status'] }) {
  if (status === 'verified') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
  if (status === 'false') return <XCircle className="w-4 h-4 text-red-400" />;
  return <AlertCircle className="w-4 h-4 text-amber-400" />;
}
