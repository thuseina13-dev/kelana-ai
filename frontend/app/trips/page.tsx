'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTrips, TripResponse } from '@/services/tripService';
import { TripCard } from '../../componets/tripDetailComponent';

export default function TripsHistoryPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination on filter or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchTripsHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTrips();
        setTrips(data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan saat memuat riwayat perjalanan.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripsHistory();
  }, []);

  // Filter & Sort logic on the client side
  const filteredAndSortedTrips = trips
    .filter((trip) => {
      const matchesDestination = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const catLower = trip.category?.toLowerCase() || '';
      const selectedLower = selectedCategory.toLowerCase();

      const matchesCategory =
        selectedCategory === '' ||
        catLower === selectedLower ||
        (selectedLower === 'solo' && catLower === 'backpacker') ||
        (selectedLower === 'couple' && catLower === 'luxury');

      return matchesDestination && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return timeA - timeB;
      }
      if (sortBy === 'highest_budget') {
        return b.budget - a.budget;
      }
      return 0;
    });

  // Paginated Items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = filteredAndSortedTrips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedTrips.length / itemsPerPage);

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
            <a href="/" className="hover:text-emerald-600 transition-colors font-semibold">
              Buat Rencana Baru
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Engine Aktif
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-emerald-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-950">Riwayat Perjalanan</h1>
            <p className="text-sm text-emerald-600">Daftar rekomendasi liburan yang pernah disusun oleh AI</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Buat Baru</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Filter & Sort Inputs */}
        {!isLoading && trips.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xs border border-emerald-100/80 p-5 mb-8 flex flex-col lg:flex-row gap-4 items-center">

            {/* Destination Search Field */}
            <div className="flex-1 w-full relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-emerald-50/20 border border-emerald-200/60 rounded-xl text-slate-800 placeholder-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm"
              />
            </div>

            {/* Travel Style Category Dropdown */}
            <div className="w-full lg:w-60 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-emerald-50/20 border border-emerald-200/60 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm appearance-none cursor-pointer"
              >
                <option value="">Semua Gaya (Travel Style)</option>
                <option value="solo">Solo (Sendiri)</option>
                <option value="couple">Couple (Pasangan)</option>
                <option value="family">Family (Keluarga)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="w-full lg:w-60 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 12l-3-3m3 3l3-3m3-7h10m-10 4h6m-6 4h3" />
                </svg>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-emerald-50/20 border border-emerald-200/60 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base sm:text-sm appearance-none cursor-pointer"
              >
                <option value="latest">Terbaru (Latest)</option>
                <option value="oldest">Terlama (Oldest)</option>
                <option value="highest_budget">Anggaran Tertinggi (Highest Budget)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>
        )}

        {isLoading ? (
          /* Loading State Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-emerald-50/80 shadow-xs animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error card */
          <div className="bg-white rounded-3xl shadow-md border border-red-100 p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Riwayat</h3>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-3xl border-2 border-dashed border-emerald-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto min-h-[300px]">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100/90 flex items-center justify-center text-emerald-600 shadow-xs">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-emerald-950">Belum Ada Riwayat</h3>
            <p className="text-xs sm:text-sm text-emerald-700/80 max-w-sm leading-relaxed">
              Anda belum pernah membuat rencana perjalanan. Silakan buat rencana liburan baru dengan AI sekarang!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              Mulai Buat Rencana
            </button>
          </div>
        ) : filteredAndSortedTrips.length === 0 ? (
          /* Filtered state no results */
          <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3 max-w-lg mx-auto min-h-[250px]">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-emerald-950">Tidak Ada Hasil</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              Rencana perjalanan untuk destinasi <span className="font-semibold">"{searchQuery}"</span> dengan kriteria pencarian tidak ditemukan.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSortBy('latest');
              }}
              className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          /* Trips list grid */
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTrips.map((trip, index) => (
                <TripCard
                  key={`${trip.id}-${index}`}
                  trip={trip}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8 pt-4 border-t border-emerald-100">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-emerald-200 text-emerald-800 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-xs sm:text-sm flex items-center gap-1 shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Sebelumnya
                </button>

                <div className="flex items-center space-x-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold border transition-all ${currentPage === page
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-emerald-200 text-emerald-800 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-xs sm:text-sm flex items-center gap-1 shadow-2xs"
                >
                  Berikutnya
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
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
