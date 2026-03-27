'use client';

import { useDebate } from './hooks/useDebate';
import TopicInput from './components/TopicInput';
import DebateArena from './components/DebateArena';

export default function Home() {
  const { state, handleStart, handleHumanSubmit, handleEvidenceAdd, handleReset } = useDebate();

  if (state.status === 'idle') {
    return <TopicInput onStart={handleStart} isLoading={state.isLoading} />;
  }

  return (
    <DebateArena
      state={state}
      onHumanSubmit={handleHumanSubmit}
      onEvidenceAdd={handleEvidenceAdd}
      onReset={handleReset}
    />
  );
}
