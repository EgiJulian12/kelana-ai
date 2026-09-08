/**
 * Assistant Service - RAG-enabled travel assistant
 * Calls Knowledge Base endpoint for grounded answers
 */

export interface AssistantResponse {
  question: string;
  answer: string;
  sources: string[];
}

/**
 * Ask the RAG-enabled travel assistant a question
 * Hits Next.js API route which proxies to backend
 */
export async function askAssistant(question: string): Promise<AssistantResponse> {
  const response = await fetch('/api/assistant', {
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
