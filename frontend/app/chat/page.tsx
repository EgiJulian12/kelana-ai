"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  createConversation,
  listConversations,
  deleteConversation,
  sendMessage,
  listMessages,
  type Conversation,
  type Message,
} from "@/services/conversationService";

export default function ChatPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication and validate token
  useEffect(() => {
    const validateAndSetToken = async () => {
      const storedToken = localStorage.getItem("auth_token");
      if (!storedToken) {
        router.push("/login");
        return;
      }

      // Validate token by trying a simple API call
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/conversations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (res.status === 401) {
          // Token is invalid
          console.log("Token invalid, redirecting to login...");
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }

        // Token is valid, set it
        setToken(storedToken);
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("auth_token");
        router.push("/login");
      }
    };

    validateAndSetToken();
  }, [router]);

  // Load conversations on mount (only after token is validated)
  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (token && activeConvId) {
      loadMessages(activeConvId);
    }
  }, [token, activeConvId]);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Scroll immediately when new message arrives
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  async function loadConversations() {
    if (!token) return;
    try {
      const data = await listConversations(token);
      setConversations(data);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      // If token is invalid, redirect to login
      if (error.message?.includes("Invalid or expired token")) {
        localStorage.removeItem("auth_token");
        router.push("/login");
      }
    }
  }

  async function loadMessages(convId: number) {
    if (!token) return;
    try {
      const data = await listMessages(token, convId);
      setMessages(data);
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      // If token is invalid, redirect to login
      if (error.message?.includes("Invalid or expired token")) {
        localStorage.removeItem("auth_token");
        router.push("/login");
      }
    }
  }

  async function handleNewConversation() {
    if (!token) return;
    try {
      const { conversation_id } = await createConversation(token);
      await loadConversations();
      setActiveConvId(conversation_id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert("Failed to create conversation");
    }
  }

  async function handleDeleteConversation(convId: number) {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(token, convId);
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([]);
      }
      await loadConversations();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("Failed to delete conversation");
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !input.trim()) return;

    // If no active conversation, create one first
    let convId = activeConvId;
    if (!convId) {
      try {
        const { conversation_id } = await createConversation(token);
        convId = conversation_id;
        setActiveConvId(convId);
        await loadConversations();
      } catch (error: any) {
        console.error("Failed to create conversation:", error);
        if (error.message?.includes("Invalid or expired token")) {
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }
        alert("Failed to create conversation");
        return;
      }
    }

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(token, convId, {
        content: userMessage,
      });
      await loadMessages(convId);
      await loadConversations(); // Refresh list to show updated title
    } catch (error: any) {
      console.error("Failed to send message:", error);
      if (error.message?.includes("Invalid or expired token")) {
        localStorage.removeItem("auth_token");
        router.push("/login");
        return;
      }
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  function formatMessageContent(content: string) {
    // Clean all markdown symbols first
    let cleanedContent = content
      .replace(/\*\*/g, '')  // Remove bold markers
      .replace(/\*/g, '')    // Remove italic markers
      .replace(/##\s*/g, '') // Remove heading markers
      .replace(/`/g, '')     // Remove code markers
      .replace(/~/g, '');    // Remove strikethrough markers

    const lines = cleanedContent.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-2 my-4">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-purple-400 mt-1 flex-shrink-0">▸</span>
                <span className="text-slate-200 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    let isFirstLine = true;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        flushList();
        return;
      }

      // Handle list items (starts with - or *)
      if (trimmed.match(/^[-*•]\s+/)) {
        const text = trimmed.replace(/^[-*•]\s+/, '');
        currentList.push(text);
        return;
      }

      // Handle numbered lists
      if (trimmed.match(/^\d+\.\s+/)) {
        const text = trimmed.replace(/^\d+\.\s+/, '');
        currentList.push(text);
        return;
      }

      // Flush any pending list
      flushList();

      // Detect if line looks like a heading (all caps, or first line, or short and bold-looking)
      const looksLikeHeading = 
        trimmed.length < 60 && 
        (trimmed === trimmed.toUpperCase() || 
         isFirstLine || 
         trimmed.endsWith(':'));

      if (looksLikeHeading && isFirstLine) {
        elements.push(
          <h3
            key={`heading-${idx}`}
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4"
          >
            {trimmed.replace(/[:：]$/, '')}
          </h3>
        );
        isFirstLine = false;
        return;
      }

      // Check if it's a section header (ends with colon)
      if (trimmed.endsWith(':') && trimmed.length < 50) {
        elements.push(
          <p key={`subheading-${idx}`} className="font-semibold text-purple-300 mt-4 mb-2">
            {trimmed}
          </p>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${idx}`} className="text-slate-300 leading-relaxed my-2">
          {trimmed}
        </p>
      );

      isFirstLine = false;
    });

    // Flush any remaining list
    flushList();

    return <div className="space-y-1">{elements}</div>;
  }

  if (!token) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen bg-[#05061a] text-slate-100 flex flex-col overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Sidebar - Fixed */}
        <div className="w-80 border-r border-white/10 flex flex-col backdrop-blur-xl bg-white/5">
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <button
              onClick={handleNewConversation}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              + New Conversation
            </button>
          </div>

          {/* Conversations List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative p-4 mb-2 rounded-xl cursor-pointer transition-all ${
                      activeConvId === conv.id
                        ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                    onClick={() => setActiveConvId(conv.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {conv.title || "New Conversation"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(conv.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button - Fixed */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <button
              onClick={() => router.push("/trips")}
              className="w-full text-slate-400 hover:text-purple-400 text-sm font-medium flex items-center justify-center gap-2 py-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Trips
            </button>
          </div>
        </div>

        {/* Chat Area - Fixed Structure */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-xl shadow-purple-500/30">
                  <div className="w-full h-full bg-[#090b29] rounded-[15px] flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Welcome to KelanaAI Chat
                </h2>
                <p className="text-slate-400 mb-6">
                  Start a conversation or select an existing one to continue
                </p>
                <button
                  onClick={handleNewConversation}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Start New Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header - Shows Active Conversation Title */}
              <div className="flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {conversations.find((c) => c.id === activeConvId)?.title || "New Conversation"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {messages.length} {messages.length === 1 ? "message" : "messages"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveConvId(null);
                      setMessages([]);
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    title="Close conversation"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages - ONLY THIS SCROLLS */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 mt-20">
                    <p className="text-lg">Start the conversation!</p>
                    <p className="text-sm mt-2">
                      Ask me anything about travel planning
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col max-w-3xl">
                        <div
                          className={`rounded-2xl p-5 shadow-xl ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : "bg-white/5 backdrop-blur-xl border border-white/10 text-slate-100"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </p>
                          ) : (
                            formatMessageContent(msg.content)
                          )}
                        </div>
                        {/* Timestamp */}
                        <p className={`text-xs text-slate-500 mt-1 px-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex flex-col max-w-3xl">
                      <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-sm mr-2">AI is typing</span>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - FIXED AT BOTTOM */}
              <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about travel destinations, tips, or planning..."
                    disabled={loading}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Send"
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
