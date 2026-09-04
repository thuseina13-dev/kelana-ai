'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTripById, TripResponse } from '../../../services/tripService';
import TripDetailComponent from '../../../componets/tripDetailComponent';
import Header from '../../../componets/Header';
import Footer from '../../../componets/Footer';

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
            <Footer />
        </div>
    );
}
