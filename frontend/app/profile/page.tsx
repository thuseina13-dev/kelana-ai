'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, ProfileResponse } from '../../services/authService';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsCheckingAuth(false);

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProfile();
        setProfile(data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan saat memuat profil.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
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
          <div className="flex items-center space-x-3" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
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
            <a href="/ask" className="hover:text-emerald-600 transition-colors font-semibold">
              Tanya AI
            </a>
            <a href="/trips" className="hover:text-emerald-600 transition-colors font-semibold">
              Riwayat Perjalanan
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

      {/* 2. PROFILE CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-3xl p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-emerald-500/20 mb-4 uppercase">
              {profile?.name ? profile.name.charAt(0) : '?'}
            </div>
            <h2 className="text-2xl font-bold text-emerald-950">Profil Pengguna</h2>
            <p className="text-emerald-600 text-sm mt-1">Informasi Akun KelanaAI Anda</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-semibold text-emerald-950/70">Memuat profil...</span>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm py-3 px-4 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          ) : profile ? (
            <div className="space-y-6 relative z-10">
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-100/40 pb-3">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Nama</span>
                  <span className="text-sm font-bold text-emerald-950">{profile.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-emerald-100/40 pb-3">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Email</span>
                  <span className="text-sm font-bold text-emerald-950">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Trip Dibuat</span>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">{profile.total_trip_generated} Perjalanan</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-center text-sm"
                >
                  Buat Rencana Baru
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-white border border-rose-200 text-rose-600 font-bold py-3 px-4 rounded-xl hover:bg-rose-50 active:scale-[0.98] transition-all cursor-pointer text-center text-sm"
                >
                  Keluar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
