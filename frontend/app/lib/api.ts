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

export async function submitEvidenceUrl(
  sessionId: string,
  url: string
): Promise<{ status: string; explanation: string; sources?: string[] }> {
  const res = await fetch(`${API_URL}/evidence/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, type: 'url', content: url }),
  });
  if (!res.ok) throw new Error('Failed to submit evidence');
  return res.json();
}

export async function submitEvidenceFile(
  sessionId: string,
  file: File
): Promise<{ status: string; explanation: string }> {
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
