'use client';

import { useState } from 'react';
import { askAssistant, AssistantResponse } from '@/services/assistantService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownItinerary from '@/components/MarkdownItinerary';

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
          <div className="space-y-4">
            {/* AI Answer Card with MarkdownItinerary */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">KelanaAI Assistant</h3>
                  <p className="text-xs text-slate-400">Powered by Knowledge Base</p>
                </div>
              </div>

              {/* Answer Content using MarkdownItinerary */}
              <MarkdownItinerary content={response.answer} />
            </div>

            {/* Sources Card */}
            {response.sources && response.sources.length > 0 && (
              <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Information Sources
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {response.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="group px-3 py-2 bg-slate-900/50 hover:bg-slate-900/80 rounded-lg border border-slate-700/50 hover:border-teal-500/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                          {source}
                        </span>
                      </div>
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
