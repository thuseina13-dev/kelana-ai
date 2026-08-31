const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

const getHeaders = (extra: Record<string, string> = {}) => {
  const headers: Record<string, string> = { ...extra };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export interface KBResultItem {
  content: string;
  score: number;
  source: string;
}

export interface AskResponse {
  quetion: string;
  answer: KBResultItem[];
}


export const askKnowledgeBase = async (query: string): Promise<AskResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/ask`, {
      method: 'POST',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ quetions: query }), // Matches the 'quetions' field in backend schema
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Gagal mendapatkan jawaban dari basis pengetahuan (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('KB Ask error:', error);
    throw error;
  }
};
