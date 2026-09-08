/**
 * Assistant Service - RAG-enabled travel assistant
 * Calls Knowledge Base endpoint for grounded answers
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface AssistantResponse {
  question: string;
  answer: string;
  sources: string[];
}

/**
 * Ask the RAG-enabled travel assistant a question
 * Hits backend /assistant endpoint directly (alias for /ask)
 */
export async function askAssistant(question: string): Promise<AssistantResponse> {
  const response = await fetch(`${API_URL}/assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get answer: ${response.status} - ${errorText}`);
  }

  return response.json();
}
