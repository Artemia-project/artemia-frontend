import { API_CONFIG } from '@/constants';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isSaved?: boolean;
}

export interface BackendResponse {
  final_answer: string;
  cards: unknown[];
}

/**
 * Calls the backend API with chat history
 */
export async function callBackend(history: Message[]): Promise<BackendResponse> {
  // Convert frontend Message[] to backend format
  const payload = {
    messages: history.slice(-API_CONFIG.MAX_TURNS).map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    meta: {
      client: 'artful-muse-chat',
      ts: new Date().toISOString(),
    },
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CHAT_ENDPOINT}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  
  if (!response.ok) {
    // Try to extract FastAPI error details
    try {
      const errorData = JSON.parse(text);
      throw new Error(`Backend error ${response.status}: ${errorData.detail ?? text}`);
    } catch {
      throw new Error(`Backend error ${response.status}: ${text}`);
    }
  }

  return JSON.parse(text) as BackendResponse;
}