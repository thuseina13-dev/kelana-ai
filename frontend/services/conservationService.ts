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

export interface MessageItem {
  id?: number;
  conservation_id?: number;
  role: 'user' | 'ai' | 'assistant' | string;
  content: string;
  createdAt?: string;
}

export interface ConservationItem {
  id: number;
  user_id?: number;
  title?: string | null;
  createdAt?: string;
  messages?: MessageItem[];
}

export const getConservations = async (): Promise<ConservationItem[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal mengambil daftar percakapan');
    }

    return await response.json();
  } catch (error) {
    console.error('getConservations error:', error);
    throw error;
  }
};

export const getConservationById = async (id: number): Promise<ConservationItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Gagal mengambil detail percakapan #${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error('getConservationById error:', error);
    throw error;
  }
};

export const createConservation = async (title: string = ''): Promise<ConservationItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations`, {
      method: 'POST',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal membuat percakapan baru');
    }

    const data = await response.json();
    return {
      id: data.id ?? data.conservation_id,
      title: data.title !== undefined ? data.title : title,
      user_id: data.user_id,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('createConservation error:', error);
    throw error;
  }
};

export const createMessage = async (
  conservationId: number,
  role: 'user' | 'ai' | string,
  content: string
): Promise<MessageItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations/${conservationId}/messages`, {
      method: 'POST',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ role, content }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal mengirim pesan');
    }

    return await response.json();
  } catch (error) {
    console.error('createMessage error:', error);
    throw error;
  }
};

export const updateConservation = async (id: number, title: string): Promise<ConservationItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations/${id}`, {
      method: 'PUT',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal memperbarui judul percakapan');
    }

    return await response.json();
  } catch (error) {
    console.error('updateConservation error:', error);
    throw error;
  }
};

export const deleteConservation = async (id: number): Promise<ConservationItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/conservations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal menghapus percakapan');
    }

    return await response.json();
  } catch (error) {
    console.error('deleteConservation error:', error);
    throw error;
  }
};

export interface ChatResponse {
  quetion: string;
  answer: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant' | 'ai' | string;
  content: string;
}

export const sendChatMessage = async (
  prompt: string | ChatHistoryMessage[]
): Promise<ChatResponse> => {
  try {
    let bodyPayload: Record<string, unknown> = {};
    if (Array.isArray(prompt)) {
      const sanitizedMessages = prompt
        .slice(-10) // Batasi maksimal 10 chat terakhir
        .map((m) => ({
          role: m.role === 'ai' ? 'assistant' : m.role,
          content: typeof m.content === 'string' ? m.content.trim() : String(m.content),
        }))
        .filter((m) => m.content.length > 0);

      bodyPayload = {
        messages: sanitizedMessages,
        quetions: sanitizedMessages.length > 0 ? sanitizedMessages[sanitizedMessages.length - 1].content : '',
      };
    } else {
      const trimmedText = prompt.trim();
      bodyPayload = {
        quetions: trimmedText,
        messages: [{ role: 'user', content: trimmedText }],
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
      method: 'POST',
      headers: getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Gagal mendapatkan tanggapan AI');
    }

    return await response.json();
  } catch (error) {
    console.error('sendChatMessage error:', error);
    throw error;
  }
};
