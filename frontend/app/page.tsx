'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface RecommendationResponse {
  trip_id: number;
  destination: string;
  recommendation: string;
}

interface SectionData {
  id: string;
  title: string;
  type: 'day' | 'tips' | 'food' | 'budget' | 'other';
  icon: string;
  content: string;
}

/**
 * Parse raw recommendation markdown into distinct sections (Days, Tips, Food, Budget)
 */
const parseRecommendationSections = (rawText: string): SectionData[] => {
  if (!rawText) return [];

  // Normalize text and split by headers starting with '##'
  const parts = rawText.split(/(?=\n##\s+|^##\s+)/g);
  const sections: SectionData[] = [];

  parts.forEach((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    // Match header line
    const headerMatch = trimmed.match(/^##\s+(.+)$/m);
    let title = headerMatch ? headerMatch[1].trim() : `Bagian ${index + 1}`;
    const content = headerMatch ? trimmed.replace(/^##\s+.+$/m, '').trim() : trimmed;

    const lowerTitle = title.toLowerCase();
    let type: 'day' | 'tips' | 'food' | 'budget' | 'other' = 'other';
    let icon = '📌';

    if (lowerTitle.includes('day')) {
      type = 'day';
      icon = '🗓️';
    } else if (lowerTitle.includes('tip')) {
      type = 'tips';
      icon = '💡';
      title = 'Travel Tips & Panduan';
    } else if (lowerTitle.includes('food')) {
      type = 'food';
      icon = '🍜';
      title = 'Rekomendasi Kuliner Lokal';
    } else if (lowerTitle.includes('budget')) {
      type = 'budget';
      icon = '💰';
      title = 'Estimasi Rincian Anggaran';
    }

    sections.push({
      id: `section-${index}`,
      title,
      type,
      icon,
      content,
    });
  });

  return sections;
};

/**
 * Component for individual collapsible section card
 */
const SectionCard: React.FC<{ section: SectionData }> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Badge theme based on type
  const getBadgeStyle = () => {
    switch (section.type) {
      case 'day':
        return 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80';
      case 'tips':
        return 'bg-amber-100/90 text-amber-900 border-amber-300/80';
      case 'food':
        return 'bg-orange-100/90 text-orange-900 border-orange-300/80';
      case 'budget':
        return 'bg-teal-100/90 text-teal-900 border-teal-300/80';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="border border-emerald-100/90 rounded-2xl bg-white/95 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      {/* Card Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none border-b transition-colors ${getBadgeStyle()}`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl drop-shadow-xs">{section.icon}</span>
          <h3 className="text-sm sm:text-base font-bold capitalize tracking-tight">{section.title}</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold bg-white/90 hover:bg-white text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs transition-all">
          <span>{isOpen ? 'Tutup' : 'Buka'}</span>
          <svg className={`w-3.5 h-3.5 text-emerald-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 text-slate-700 text-sm leading-relaxed space-y-2 bg-gradient-to-b from-white to-emerald-50/20">
          <ReactMarkdown
            components={{
              h3: ({ node, ...props }) => (
                <h3 className="text-base font-bold text-emerald-950 mt-3 mb-1.5 pb-1 border-b border-emerald-100" {...props} />
              ),
              strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-950" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 my-2.5 pl-1 text-slate-700" {...props} />,
              li: ({ node, ...props }) => <li className="text-slate-700 leading-relaxed pl-1" {...props} />,
              p: ({ node, ...props }) => <p className="my-1.5 text-slate-700 leading-relaxed" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="p-3.5 bg-emerald-50/90 border-l-4 border-emerald-500 rounded-r-xl text-emerald-900 text-xs my-3 font-medium shadow-2xs" {...props} />
              ),
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    days: '',
    travelStyle: 'luxury',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<RecommendationResponse | null>(null);
  const [submittedBudget, setSubmittedBudget] = useState<string>('');

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
    setAiResult(null);
    setSubmittedBudget(formData.budget);

    const payload = {
      destination: formData.destination,
      days: parseInt(formData.days, 10),
      budget: parseFloat(formData.budget),
      travel_style: formData.travelStyle,
    };

    try {
      // Step 1: Post Trip Data
      setLoadingStep('Menyimpan preferensi liburan...');
      const responseTrip = await fetch('http://localhost:8000/api/v1/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!responseTrip.ok) {
        throw new Error(`Gagal menyimpan data liburan (Status: ${responseTrip.status})`);
      }

      const tripData = await responseTrip.json();

      // Step 2: Generate AI Recommendation
      setLoadingStep('AI sedang menyusun itinerary & rekomendasi...');
      const responseGen = await fetch(`http://localhost:8000/api/v1/trips/${tripData.id}/generate`, {
        method: 'POST',
      });

      if (!responseGen.ok) {
        throw new Error(`Gagal memproses rekomendasi AI (Status: ${responseGen.status})`);
      }

      const recommendationData: RecommendationResponse = await responseGen.json();
      setAiResult(recommendationData);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat memproses data.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const sections = aiResult ? parseRecommendationSections(aiResult.recommendation) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2-0 012-2h1.055M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-950">Kelana<span className="text-emerald-600">AI</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-600/80 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">Perencana Liburan Cerdas</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs sm:text-sm font-medium text-emerald-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Engine Aktif
            </span>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER WITH DESTINATION IMAGE */}
      <section className="relative overflow-hidden bg-emerald-950">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] w-full">
          {/* Hero Background Image */}
          <img
            src="/hero-destination.jpg"
            alt="Pemandangan Destinasi Wisata Tropis"
            className="w-full h-full object-cover object-center brightness-90"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-emerald-950/50 to-transparent"></div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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

      {/* 3. MAIN CONTENT CONTAINER (2-COLUMN RESPONSIVE LAYOUT) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FORM (5 COLS) */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100/90 p-6 sm:p-8 transition-all duration-300">
            
            {/* Form Title & Icon */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-emerald-100">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-950">Parameter Liburan</h2>
                <p className="text-xs text-emerald-600">Lengkapi detail untuk menyusun rencana terbaik</p>
              </div>
            </div>

            {/* Input Form */}
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
                    <option value="luxury">Luxury (Mewah & Nyaman)</option>
                    <option value="family">Family (Keluarga & Santai)</option>
                    <option value="backpacker">Backpacker (Hemat & Eksploratif)</option>
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
                    <span className="text-sm sm:text-base">{loadingStep || 'Menyiapkan Itinerary...'}</span>
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

            {/* Error Notification Alert */}
            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex items-start space-x-2.5">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: AI RECOMMENDATION OUTPUT (7 COLS) */}
          <div className="lg:col-span-7 min-h-[350px]">
            {isLoading ? (
              /* Loading State Card */
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-950">AI Sedang Merancang Liburan</h3>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-sm">{loadingStep || 'Mohon tunggu beberapa saat...'}</p>
                <div className="w-48 bg-emerald-100 rounded-full h-2 overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : aiResult ? (
              /* AI Recommendation Container with Individual Section Cards */
              <div className="space-y-4 lg:max-h-[800px] lg:overflow-y-auto lg:pr-1">
                
                {/* Destination Header Card */}
                <div className="p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200/90 shadow-md flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-700 tracking-wider">Hasil Rencana Perjalanan</span>
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 capitalize">{aiResult.destination}</h2>
                        {submittedBudget && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
                            💵 ${parseFloat(submittedBudget).toLocaleString()} USD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    {sections.filter(s => s.type === 'day').length} Hari Itinerary
                  </span>
                </div>

                {/* Individual Cards for each parsed section */}
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))
                ) : (
                  /* Fallback if raw text couldn't be parsed */
                  <SectionCard 
                    section={{
                      id: 'default-section',
                      title: 'Rekomendasi Perjalanan',
                      type: 'other',
                      icon: '🗺️',
                      content: aiResult.recommendation
                    }} 
                  />
                )}

              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-dashed border-emerald-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100/90 flex items-center justify-center text-emerald-600 mb-1 shadow-xs">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.483V6a2 2 0 011.236-1.868l5-2.5a2 2 0 011.528 0l5 2.5A2 2 0 0117 6v9.483a2 2 0 01-1.236 1.868L10 20.276a2 2 0 01-1 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-950">Rekomendasi Liburan Anda</h3>
                <p className="text-xs sm:text-sm text-emerald-700/80 max-w-sm leading-relaxed">
                  Isi formulir destinasi di sebelah kiri dan klik tombol <b>Buat Rencana Liburan AI</b> untuk melihat itinerary interaktif.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-emerald-800">
                  <span className="px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">🗓️ Itinerary Harian</span>
                  <span className="px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">💡 Travel Tips</span>
                  <span className="px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">🍜 Kuliner Lokal</span>
                  <span className="px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">💰 Budgeting</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="mt-auto bg-white border-t border-emerald-100/90 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            
            {/* Brand column */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-xs">
                K
              </div>
              <div>
                <span className="text-base font-bold text-emerald-950">Kelana<span className="text-emerald-600">AI</span></span>
                <p className="text-xs text-slate-500">Perencana Liburan Impian Berbasis AI</p>
              </div>
            </div>

            {/* Copyright & Tagline */}
            <div className="text-xs text-slate-500 space-y-1 sm:text-right">
              <p>© {new Date().getFullYear()} Kelana AI. Seluruh hak cipta dilindungi undang-undang.</p>
              <p className="text-emerald-700/80 font-medium">Dibuat dengan 💚 untuk para penjelajah dunia</p>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}




