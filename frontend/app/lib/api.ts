const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function startDebate(topic: string): Promise<{ session_id: string }> {
  const res = await fetch(`${API_URL}/debate/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error('Failed to start debate');
  return res.json();
}

export async function submitHumanInput(
  sessionId: string,
  content: string,
  type: 'statement' | 'question'
): Promise<void> {
  const res = await fetch(`${API_URL}/debate/${sessionId}/human`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, type }),
  });
  if (!res.ok) throw new Error('Failed to submit human input');
}

export function createDebateStream(sessionId: string): EventSource {
  return new EventSource(`${API_URL}/debate/${sessionId}/stream`);
}

export async function verifyEvidence(
  sessionId: string,
  type: 'url' | 'text',
  content: string
): Promise<any> {
  const res = await fetch(`${API_URL}/evidence/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, type, content }),
  });
  if (!res.ok) throw new Error('Failed to submit evidence');
  return res.json();
}

export async function verifyFileEvidence(
  file: File,
  sessionId: string
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);
  const res = await fetch(`${API_URL}/evidence/submit-file`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit file evidence');
  return res.json();
}
