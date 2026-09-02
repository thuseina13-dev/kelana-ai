'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { askKnowledgeBase } from '../../services/kbService';

export default function AskPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswers([]);
    setHasSearched(false);

    try {
      const res = await askKnowledgeBase(question);
      if (Array.isArray(res.answer)) {
        setAnswers(res.answer);
      } else if (typeof res.answer === 'string') {
        setAnswers([{ content: res.answer, score: 1.0, source: 'KelanaAI' }]);
      } else {
        setAnswers([]);
      }
      setHasSearched(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat menghubungi basis pengetahuan.');
    } finally {
      setIsLoading(false);
    }
  };



  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-emerald-900/80">Memeriksa autentikasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2-0 012-2h1.055M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-950">Kelana<span className="text-emerald-600">AI</span></span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs sm:text-sm font-medium text-emerald-800">
            <a href="/chat" className="hover:text-emerald-600 transition-colors font-semibold">
              Chat AI
            </a>
            <a href="/" className="hover:text-emerald-600 transition-colors font-semibold">
              Buat Rencana Baru
            </a>
            <a href="/trips" className="hover:text-emerald-600 transition-colors font-semibold">
              Riwayat Perjalanan
            </a>
            <a href="/profile" className="hover:text-emerald-600 transition-colors font-semibold">
              Profil Saya
            </a>
            <button
              onClick={handleLogout}
              title="logout"
              className="hover:text-rose-600 transition-colors cursor-pointer border-0 bg-transparent p-1.5 rounded-lg hover:bg-rose-50 flex items-center justify-center text-emerald-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PAGE HEADER */}
      <section className="bg-emerald-950 text-white py-10 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">Tanya KelanaAI</h1>
          <p className="mt-2 text-emerald-200/90 text-sm md:text-base max-w-2xl font-light">
            Tanyakan segala hal tentang informasi destinasi wisata, rekomendasi tersembunyi, atau info perjalanan dari basis pengetahuan AI kami.
          </p>
        </div>
      </section>

      {/* 3. TWO COLUMN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: QUESTION INPUT */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100/80 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-950">Ajukan Pertanyaan</h2>
                <p className="text-xs text-emerald-600">Gunakan bahasa alami yang santai atau formal</p>
              </div>
            </div>

            <form onSubmit={handleAsk} className="space-y-5">
              <div>
                <label htmlFor="question" className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
                  Pertanyaan Anda
                </label>
                <textarea
                  id="question"
                  rows={6}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Contoh: Rekomendasikan kuliner khas terbaik di Jogja yang jarang dikunjungi turis beserta estimasi harganya..."
                  className="w-full px-4 py-3 rounded-2xl border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-800 text-sm resize-none shadow-inner"
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs sm:text-sm flex items-start space-x-2">
                  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Tanyakan AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* COLUMN 2: ANSWER DISPLAY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100/80 min-h-[400px] flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Jawaban AI</h2>
                  <p className="text-xs text-teal-600">Hasil ekstraksi informasi dari basis pengetahuan kami</p>
                </div>
              </div>

              <div className="text-slate-800 text-sm leading-relaxed font-light">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-xs text-slate-500">Mencari informasi di basis pengetahuan...</p>
                  </div>
                ) : Array.isArray(answers) && answers.length > 0 ? (
                  <div className="space-y-6">
                    {answers.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 shadow-inner relative space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100/50 pb-2 text-xxs font-semibold">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 break-all max-w-[70%]">
                            Sumber: {item.source}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            Relevansi: {(item.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed font-normal">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : hasSearched ? (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start space-x-2 shadow-inner font-normal">
                    <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Maaf, informasi tidak tersedia dalam sistem kami.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center space-y-3">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-xs max-w-xs">Tulis pertanyaan Anda di sebelah kiri dan klik tombol untuk memulai pencarian jawaban.</p>
                  </div>
                )}
              </div>
            </div>

            {Array.isArray(answers) && answers.length > 0 && !isLoading && (
              <div className="mt-6 pt-4 border-t border-emerald-100/60 flex items-center justify-between text-xxs sm:text-xs text-slate-500">
                <span>Sumber: KelanaAI Knowledge Base</span>
                <button
                  onClick={() => {
                    const fullText = answers.map((item, i) => `[Sumber ${i + 1}: ${item.source} (Relevansi: ${(item.score * 100).toFixed(1)}%)]\n${item.content}`).join('\n\n');
                    navigator.clipboard.writeText(fullText);
                    alert('Semua jawaban berhasil disalin!');
                  }}
                  className="px-3 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Salin Semua Jawaban
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} KelanaAI. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
