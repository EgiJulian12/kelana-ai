const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Conversation {
  id: number;
  user_id: number;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface CreateMessageResponse {
  conversation_id: number;
  message_id: number;
  assistant_message_id: number;
  answer: string;
}

export interface UpdateConversationRequest {
  title: string;
}

// ── Create a new conversation ──────────────────────────────────────────────

export async function createConversation(
  token: string
): Promise<{ conversation_id: number }> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to create conversation" }));
    throw new Error(errorData.detail || "Failed to create conversation");
  }

  return res.json();
}

// ── List all conversations ─────────────────────────────────────────────────

export async function listConversations(
  token: string
): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to list conversations" }));
    throw new Error(errorData.detail || "Failed to list conversations");
  }

  return res.json();
}

// ── Update conversation title ──────────────────────────────────────────────

export async function updateConversation(
  token: string,
  conversationId: number,
  data: UpdateConversationRequest
): Promise<Conversation> {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to update conversation" }));
    throw new Error(errorData.detail || "Failed to update conversation");
  }

  return res.json();
}

// ── Delete a conversation ──────────────────────────────────────────────────

export async function deleteConversation(
  token: string,
  conversationId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to delete conversation" }));
    throw new Error(errorData.detail || "Failed to delete conversation");
  }
}

// ── Send a message in a conversation ───────────────────────────────────────

export async function sendMessage(
  token: string,
  conversationId: number,
  data: CreateMessageRequest
): Promise<CreateMessageResponse> {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to send message" }));
    throw new Error(errorData.detail || "Failed to send message");
  }

  return res.json();
}

// ── List all messages in a conversation ────────────────────────────────────

export async function listMessages(
  token: string,
  conversationId: number
): Promise<Message[]> {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired token (401 Unauthorized)");
    }
    const errorData = await res.json().catch(() => ({ detail: "Failed to list messages" }));
    throw new Error(errorData.detail || "Failed to list messages");
  }

  return res.json();
}
