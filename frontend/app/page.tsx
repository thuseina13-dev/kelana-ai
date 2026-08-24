'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
      title = 'Travel Tips';
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

  return (
    <div className="border border-emerald-200/80 rounded-2xl bg-white/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-emerald-100/70 hover:bg-emerald-100 flex items-center justify-between cursor-pointer select-none border-b border-emerald-200/50 transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <span className="text-xl">{section.icon}</span>
          <h3 className="text-sm font-bold text-emerald-950 capitalize">{section.title}</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200/80 shadow-2xs">
          <span>{isOpen ? 'Lipat' : 'Lebarkan'}</span>
          <svg className={`w-3.5 h-3.5 text-emerald-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      {isOpen && (
        <div className="p-5 text-slate-800 text-sm leading-relaxed space-y-2 bg-white/60">
          <ReactMarkdown
            components={{
              strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-950" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1.5 my-2 pl-1 text-slate-700" {...props} />,
              li: ({ node, ...props }) => <li className="text-slate-700 leading-relaxed" {...props} />,
              p: ({ node, ...props }) => <p className="my-1.5 text-slate-700" {...props} />,
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
      setLoadingStep('Menyimpan data rencana liburan...');
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
      setLoadingStep('Memproses Rekomendasi Kelana AI...');
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
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const sections = aiResult ? parseRecommendationSections(aiResult.recommendation) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-3 sm:p-6 lg:p-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100 p-5 sm:p-8 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 sm:mb-4 shadow-sm">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.055M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-900 lg:text-4xl">
              Kelana AI
            </h1>
            <p className="text-xs sm:text-sm text-emerald-600/90 mt-1.5 sm:mt-2">
              Rencanakan liburan impianmu dengan rekomendasi buatan AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5 sm:mb-2">
                Destinasi Impian
              </label>
              <div className="relative rounded-xl shadow-sm">
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
                  placeholder="mis. Bali, Tokyo, Paris"
                  className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-slate-800 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Budget & Days Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5 sm:mb-2">
                  Anggaran (USD)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-semibold text-base sm:text-sm">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="1500.00"
                    className="w-full pl-8 pr-4 py-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-slate-800 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Days */}
              <div>
                <label htmlFor="days" className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5 sm:mb-2">
                  Lama Hari
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    min="1"
                    id="days"
                    name="days"
                    required
                    value={formData.days}
                    onChange={handleChange}
                    placeholder="7"
                    className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-slate-800 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-sm"
                  />
                </div>
              </div>

            </div>

            {/* Travel Style */}
            <div>
              <label htmlFor="travelStyle" className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5 sm:mb-2">
                Gaya Perjalanan (Travel Style)
              </label>
              <div className="relative rounded-xl shadow-sm">
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
                  className="w-full pl-10 pr-10 py-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="luxury">Luxury</option>
                  <option value="family">Family</option>
                  <option value="backpacker">Backpacker</option>
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
              className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">{loadingStep || 'Dapatkan Rekomendasi...'}</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Buat Rencana Liburan</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start space-x-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI RECOMMENDATION OUTPUT / PLACEHOLDER */}
        <div className="w-full min-h-[300px] sm:min-h-[480px]">
          {isLoading ? (
            /* Loading State Card */
            <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] sm:min-h-[480px]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-900">Menyiapkan Rekomendasi AI</h3>
              <p className="text-xs sm:text-sm text-emerald-600/90 max-w-xs">{loadingStep || 'Mohon tunggu sebentar...'}</p>
            </div>
          ) : aiResult ? (
            /* AI Recommendation Container with Individual Section Cards */
            <div className="space-y-4 lg:max-h-[750px] lg:overflow-y-auto lg:pr-1">
              
              {/* Destination Header Card */}
              <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="p-2 sm:p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-700 tracking-wider">Destinasi Liburan</span>
                    <div className="flex items-center space-x-2 sm:space-x-2.5 flex-wrap gap-y-1">
                      <h2 className="text-lg sm:text-xl font-bold text-emerald-950 capitalize">{aiResult.destination}</h2>
                      {submittedBudget && (
                        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          💵 ${parseFloat(submittedBudget).toLocaleString()} USD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Cards for each section */}
              {sections.length > 0 ? (
                sections.map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))
              ) : (
                /* Fallback if raw text couldn't be split */
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
            /* Placeholder State */
            <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-dashed border-emerald-200 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[250px] sm:min-h-[480px]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 mb-1 sm:mb-2">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.483V6a2 2 0 011.236-1.868l5-2.5a2 2 0 011.528 0l5 2.5A2 2 0 0117 6v9.483a2 2 0 01-1.236 1.868L10 20.276a2 2 0 01-1 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">Rekomendasi Liburan Anda</h3>
              <p className="text-xs text-emerald-600/80 max-w-xs leading-relaxed">
                Isi form rencana liburan di atas/sebelah kiri dan klik tombol <b>Buat Rencana Liburan</b> untuk melihat itinerary buatan AI.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

