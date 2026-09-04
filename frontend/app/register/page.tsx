'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../services/authService';
import Logo from '../../componets/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If already logged in, redirect to home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await register(formData);
      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat registrasi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-950 to-teal-900 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Daftar Akun</h1>
          <p className="text-emerald-200/80 text-sm mt-2 font-medium">Buat akun KelanaAI baru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm py-3 px-4 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm py-3 px-4 rounded-xl flex items-center space-x-3 animate-bounce">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-emerald-100 text-sm font-semibold mb-2" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama Lengkap Anda"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-emerald-100 text-sm font-semibold mb-2" htmlFor="email">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-emerald-100 text-sm font-semibold mb-2" htmlFor="password">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl hover:from-emerald-400 hover:to-teal-350 active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <span>Daftar Sekarang</span>
            )}
          </button>

          <div className="text-center text-xs text-emerald-200/60 mt-4">
            Sudah punya akun?{' '}
            <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors">
              Masuk di sini
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
