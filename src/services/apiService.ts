import { ResumeData } from '../types';

export async function saveResume(data: ResumeData): Promise<void> {
  const response = await fetch('/api/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save resume data');
  }
}

export async function getResume(email: string): Promise<ResumeData | null> {
  const response = await fetch(`/api/resume/${encodeURIComponent(email)}`);
  
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch resume data');
  }

  return response.json();
}
