'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DebateState, Argument, EvidenceItem, HumanInput,
  ROUND_INFO, RoundInfo
} from '../types';
import { startDebate, createDebateStream, submitHumanInput } from '../lib/api';

const initialState: DebateState = {
  sessionId: null,
  topic: '',
  status: 'idle',
  currentRound: 0,
  currentAgent: null,
  rounds: ROUND_INFO.map(r => ({ ...r })),
  arguments: [],
  evidence: [],
  humanInputs: [],
  verdict: null,
  isLoading: false,
  error: null,
};

export function useDebate() {
  const [state, setState] = useState<DebateState>(initialState);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => { eventSourceRef.current?.close(); };
  }, []);

  const updateRoundStatus = useCallback((roundNum: number, status: RoundInfo['status']) => {
    setState(prev => ({
      ...prev,
      rounds: prev.rounds.map(r =>
        r.number === roundNum ? { ...r, status } : r
      ),
    }));
  }, []);

  const handleStart = useCallback(async (topic: string) => {
    setState(prev => ({ ...prev, topic, status: 'running', isLoading: true, error: null }));
    try {
      const { session_id } = await startDebate(topic);
      setState(prev => ({ ...prev, sessionId: session_id, isLoading: false, currentRound: 1 }));
      updateRoundStatus(1, 'active');

      // Open SSE stream
      const es = createDebateStream(session_id);
      eventSourceRef.current = es;

      es.addEventListener('argument', (e) => {
        const arg: Argument = JSON.parse(e.data);
        setState(prev => ({
          ...prev,
          currentAgent: arg.agent,
          arguments: prev.arguments.some(a => a.id === arg.id)
            ? prev.arguments.map(a => a.id === arg.id ? arg : a)
            : [...prev.arguments, arg],
        }));
      });

      es.addEventListener('round_change', (e) => {
        const { round, status } = JSON.parse(e.data);
        setState(prev => ({ ...prev, currentRound: round }));
        if (status === 'complete') {
          updateRoundStatus(round - 1, 'complete');
          if (round <= 3) updateRoundStatus(round, 'active');
        }
      });

      es.addEventListener('verdict', (e) => {
        const verdict = JSON.parse(e.data);
        setState(prev => ({
          ...prev,
          verdict,
          status: 'complete',
          currentAgent: null,
          rounds: prev.rounds.map(r => ({ ...r, status: 'complete' })),
        }));
        es.close();
      });

      es.addEventListener('error_event', (e) => {
        const { message } = JSON.parse(e.data);
        setState(prev => ({ ...prev, status: 'error', error: message }));
        es.close();
      });

      es.onerror = () => {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Connection to debate server lost.',
          isLoading: false,
        }));
        es.close();
      };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start debate';
      setState(prev => ({ ...prev, status: 'error', error: message, isLoading: false }));
    }
  }, [updateRoundStatus]);

  const handleHumanSubmit = useCallback(async (content: string, type: 'statement' | 'question') => {
    if (!state.sessionId) return;
    const input: HumanInput = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setState(prev => ({ ...prev, humanInputs: [...prev.humanInputs, input] }));
    await submitHumanInput(state.sessionId, content, type);
  }, [state.sessionId]);

  const handleEvidenceAdd = useCallback((item: EvidenceItem) => {
    setState(prev => ({
      ...prev,
      evidence: prev.evidence.some(e => e.id === item.id)
        ? prev.evidence.map(e => e.id === item.id ? item : e)
        : [...prev.evidence, item],
    }));
  }, []);

  const handleReset = useCallback(() => {
    eventSourceRef.current?.close();
    setState(initialState);
  }, []);

  return {
    state,
    handleStart,
    handleHumanSubmit,
    handleEvidenceAdd,
    handleReset,
  };
}
