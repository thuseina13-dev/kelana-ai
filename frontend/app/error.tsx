'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/componets/Logo';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console or error tracking service
    console.error('Kelana AI Internal Server Error (500):', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header mini */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <Logo size={40} />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-emerald-950">
              Kelana<span className="text-emerald-600">AI</span>
            </span>
          </div>
        </Link>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-red-100 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Warning / Server Error Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-50 flex items-center justify-center text-rose-500 mb-6 shadow-inner border border-rose-200/60">
            <svg
              className="w-10 h-10 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 tracking-wider mb-3">
            ERROR 500
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Terjadi Kendala Sistem
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
            Mesin rekomendasi AI atau server sedang mengalami hambatan teknis yang tidak terduga. Silakan coba muat ulang atau kembali beberapa saat lagi.
          </p>

          {error?.digest && (
            <p className="text-xs text-slate-400 font-mono mb-6 bg-slate-100 py-1.5 px-3 rounded-lg inline-block">
              Error Digest: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Muat Ulang
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      {/* Footer mini */}
      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kelana AI. Teman Cerdas Perjalananmu.
      </footer>
    </div>
  );
}
