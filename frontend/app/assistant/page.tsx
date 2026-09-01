'use client';

import { useState } from 'react';
import { askAssistant, AssistantResponse } from '@/services/assistantService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const result = await askAssistant(question);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            KelanaAI
          </h1>
          <p className="text-slate-400 text-sm">Travel Assistant</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-6 backdrop-blur-sm border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4">Ask KelanaAI</h2>
          <p className="text-slate-400 text-sm mb-4">
            Powered by your trusted travel documents
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Can I bring medication into Japan?"
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 placeholder-slate-500"
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Response Section */}
        {response && (
          <div className="bg-gradient-to-br from-teal-900/20 to-emerald-900/20 rounded-lg p-6 border border-teal-500/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 text-teal-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI ANSWER
            </h3>
            
            {/* Formatted Answer */}
            <div className="text-slate-100 mb-4 leading-relaxed space-y-3">
              {response.answer.split('\n').map((paragraph, idx) => {
                // Skip empty lines
                if (!paragraph.trim()) return null;
                
                // Check if it's a numbered list item (1. 2. etc)
                const numberedMatch = paragraph.match(/^(\d+)\.\s*\*\*(.*?)\*\*(.*)$/);
                if (numberedMatch) {
                  return (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600/30 text-teal-300 flex items-center justify-center text-sm font-semibold">
                        {numberedMatch[1]}
                      </span>
                      <div>
                        <span className="font-semibold text-teal-200">{numberedMatch[2]}</span>
                        <span className="text-slate-300">{numberedMatch[3]}</span>
                      </div>
                    </div>
                  );
                }
                
                // Check if it's a bullet point with bold (- **Title:** text)
                const bulletBoldMatch = paragraph.match(/^[-•]\s*\*\*(.*?)\*\*:?\s*(.*)$/);
                if (bulletBoldMatch) {
                  return (
                    <div key={idx} className="flex gap-2 items-start ml-4">
                      <span className="text-teal-400 mt-1">•</span>
                      <div>
                        <span className="font-semibold text-teal-200">{bulletBoldMatch[1]}</span>
                        {bulletBoldMatch[2] && <span className="text-slate-300">: {bulletBoldMatch[2]}</span>}
                      </div>
                    </div>
                  );
                }
                
                // Check if it's a simple bullet point
                const bulletMatch = paragraph.match(/^[-•]\s*(.*)$/);
                if (bulletMatch) {
                  return (
                    <div key={idx} className="flex gap-2 items-start ml-4">
                      <span className="text-teal-400 mt-1">•</span>
                      <span className="text-slate-300">{bulletMatch[1]}</span>
                    </div>
                  );
                }
                
                // Check if it's a heading (starts with ** and ends with **)
                const headingMatch = paragraph.match(/^\*\*(.*?)\*\*$/);
                if (headingMatch) {
                  return (
                    <h4 key={idx} className="font-bold text-teal-200 text-lg mt-4 mb-2">
                      {headingMatch[1]}
                    </h4>
                  );
                }
                
                // Regular paragraph - handle inline bold
                const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={idx} className="text-slate-300">
                    {parts.map((part, i) => {
                      const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
                      if (boldMatch) {
                        return <strong key={i} className="font-semibold text-teal-200">{boldMatch[1]}</strong>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                );
              })}
            </div>

            {response.sources && response.sources.length > 0 && (
              <div className="border-t border-slate-700 pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3 text-slate-400 uppercase tracking-wide flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  SOURCE DOCUMENTS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {response.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg text-sm text-slate-300 border border-slate-700/50"
                    >
                      <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">{source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Footer */}
        {!response && !loading && (
          <div className="text-center text-slate-500 text-sm">
            <p>Answers are grounded in your uploaded documents.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
