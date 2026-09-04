'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createTrips, generateTripRecommendation } from '../services/tripService';
import Header from '../componets/Header';
import Footer from '../componets/Footer';

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: '',
    travelStyle: 'solo',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

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
    setLoadingStep('Menyimpan preferensi liburan...');

    const token = localStorage.getItem('token');
    let userId = 0;
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        userId = parseInt(decoded.sub, 10);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    const payload = {
      destination: formData.destination,
      days: parseInt(formData.days, 10),
      budget: parseFloat(formData.budget),
      travel_style: formData.travelStyle,
      user_id: userId,
    };


    try {
      const tripData = await createTrips(payload);
      await generateTripRecommendation(Number(tripData.id));
      setLoadingStep('Mengalihkan ke halaman detail...');

      router.push(`/trips`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat memproses data.');
      }
      setIsLoading(false);
      setLoadingStep('');
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
      <Header />

      {/* 2. HERO BANNER WITH DESTINATION IMAGE */}
      <section className="relative overflow-hidden bg-emerald-950">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src="/hero-destination.jpg"
            alt="Pemandangan Destinasi Wisata Tropis"
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-emerald-950/50 to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-4xl text-center text-white space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-emerald-100 text-xs sm:text-sm font-medium shadow-sm">
                <span>✨</span>
                <span>Jelajahi Dunia dengan Cerdas</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
                Rencanakan Liburan Impianmu Bersama AI
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-xs">
                Buat rencana perjalanan harian yang rapi, rekomendasi kuliner lokal autentik, tips liburan, dan estimasi anggaran dalam sekejap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100/90 p-6 sm:p-8 transition-all duration-300">

          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-950">Parameter Liburan</h2>
              <p className="text-xs text-emerald-600">Lengkapi detail untuk menyusun rencana terbaik oleh AI</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Destination Input */}
            <div>
              <label htmlFor="destination" className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1.5">
                Destinasi Impian
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  required
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="mis. Bali, Tokyo, Kyoto, Paris"
                  className="w-full pl-10 pr-4 py-3 bg-emerald-50/40 border border-emerald-200/90 rounded-xl text-slate-800 placeholder-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Budget & Days Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Budget Input */}
              <div>
                <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1.5">
                  Anggaran (USD)
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-bold text-base sm:text-sm">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="1500.00"
                    className="w-full pl-8 pr-4 py-3 bg-emerald-50/40 border border-emerald-200/90 rounded-xl text-slate-800 placeholder-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Days Input */}
              <div>
                <label htmlFor="days" className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1.5">
                  Lama Hari
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    id="days"
                    name="days"
                    required
                    value={formData.days}
                    onChange={handleChange}
                    placeholder="7"
                    className="w-full pl-10 pr-4 py-3 bg-emerald-50/40 border border-emerald-200/90 rounded-xl text-slate-800 placeholder-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm"
                  />
                </div>
              </div>

            </div>

            {/* Travel Style Select */}
            <div>
              <label htmlFor="travelStyle" className="block text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1.5">
                Gaya Perjalanan (Travel Style)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <select
                  id="travelStyle"
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-emerald-50/40 border border-emerald-200/90 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="solo">Solo (Sendiri & Eksploratif)</option>
                  <option value="couple">Couple (Pasangan & Romantis)</option>
                  <option value="family">Family (Keluarga & Santai)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 disabled:from-emerald-400 disabled:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">{loadingStep}</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Buat Rencana Liburan AI</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex items-start space-x-2.5">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

        </div>
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}
