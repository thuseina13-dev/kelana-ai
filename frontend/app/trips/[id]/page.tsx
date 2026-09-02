'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTripById, generateTripRecommendation, TripResponse } from '../../../services/tripService';
import TripDetailComponent from '../../../componets/tripDetailComponent';

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [trip, setTrip] = useState<TripResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [loadingStep, setLoadingStep] = useState('Mengambil data rencana perjalanan...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsCheckingAuth(false);

        let isMounted = true;

        const fetchAndPrepareTrip = async () => {
            try {
                setIsLoading(true);
                setError(null);

                setLoadingStep('Mengambil data rencana perjalanan...');
                const tripData = await getTripById(id);
                if (isMounted) {
                    setTrip(tripData);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    console.error(err);
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('Terjadi kesalahan saat memuat data perjalanan.');
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (!id) return;
        fetchAndPrepareTrip();

        return () => {
            isMounted = false;
        };
    }, [id, router]);

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
                        <a href="/profile" className="hover:text-emerald-600 transition-colors font-semibold">
                            Profil Saya
                        </a>
                        <a href="/" className="hover:text-emerald-600 transition-colors font-semibold">
                            Buat Rencana Baru
                        </a>
                        <a href="/trips" className="hover:text-emerald-600 transition-colors font-semibold">
                            Riwayat Perjalanan
                        </a>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            AI Engine Aktif
                        </span>
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

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {isLoading ? (
                    /* Loading State Card */
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce shadow-inner">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-emerald-950">Sedang Memproses</h3>
                        <p className="text-xs sm:text-sm text-emerald-700 max-w-sm">{loadingStep}</p>
                        <div className="w-48 bg-emerald-100 rounded-full h-2 overflow-hidden mt-2">
                            <div className="bg-emerald-500 h-full rounded-full animate-pulse w-3/4"></div>
                        </div>
                    </div>
                ) : error ? (
                    /* Error card */
                    <div className="bg-white rounded-3xl shadow-md border border-red-100 p-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Rencana Perjalanan</h3>
                        <p className="text-sm text-slate-500">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors cursor-pointer"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                ) : trip && trip.ai_recommendation ? (
                    /* Display Trip detail */
                    <div className="space-y-6">
                        <TripDetailComponent
                            destination={trip.destination}
                            budget={trip.budget}
                            recommendation={trip.ai_recommendation}
                            category={trip.category}
                        />
                    </div>
                ) : (
                    /* Missing recommendation fallback */
                    <div className="bg-white rounded-3xl p-8 text-center">
                        <p className="text-slate-500">Rencana perjalanan tidak ditemukan atau gagal dibuat.</p>
                    </div>
                )}

            </main>

            {/* 3. FOOTER */}
            <footer className="mt-auto bg-white border-t border-emerald-100/90 text-slate-600 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-xs">
                                K
                            </div>
                            <div>
                                <span className="text-base font-bold text-emerald-950">Kelana<span className="text-emerald-600">AI</span></span>
                                <p className="text-xs text-slate-500">Perencana Liburan Impian Berbasis AI</p>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1 sm:text-right">
                            <p>© {new Date().getFullYear()} Kelana AI. Seluruh hak cipta dilindungi undang-undang.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
