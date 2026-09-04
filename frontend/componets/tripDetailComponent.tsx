'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TripResponse } from '../services/tripService';

// ==========================================
// HELPERS & CONSTANTS FOR TRIP CARD & DETAILS
// ==========================================

export const getDestinationIcon = (destination: string) => {
  const dest = destination.toLowerCase();
  if (dest.includes('bali') || dest.includes('indonesia') || dest.includes('jakarta') || dest.includes('bandung')) {
    return '🇮🇩 🏝️';
  }
  if (dest.includes('tokyo')) return '🇯🇵 🗼';
  if (dest.includes('kyoto') || dest.includes('osaka') || dest.includes('japan') || dest.includes('jepang')) return '🇯🇵 ⛩️';
  if (dest.includes('seoul') || dest.includes('korea')) return '🇰🇷 🌸';
  if (dest.includes('singapore') || dest.includes('singapura')) return '🇸🇬 🦁';
  if (dest.includes('paris') || dest.includes('france') || dest.includes('perancis')) return '🇫🇷 🗼';
  if (dest.includes('london') || dest.includes('uk') || dest.includes('england') || dest.includes('inggris')) return '🇬🇧 🎡';
  if (dest.includes('sydney') || dest.includes('australia')) return '🇦🇺 🦘';
  if (dest.includes('bangkok') || dest.includes('thailand')) return '🇹🇭 🛕';
  if (dest.includes('kuala lumpur') || dest.includes('malaysia')) return '🇲🇾 🗼';
  if (dest.includes('new york') || dest.includes('usa') || dest.includes('america') || dest.includes('amerika')) return '🇺🇸 🗽';
  if (dest.includes('rome') || dest.includes('italy') || dest.includes('italia')) return '🇮🇹 🍕';
  if (dest.includes('amsterdam') || dest.includes('netherlands') || dest.includes('belanda')) return '🇳🇱 🌷';
  return '📍';
};

export const getBudgetCategory = (budget: number) => {
  if (budget < 2000) return 'Backpacker';
  if (budget < 3000) return 'Standard';
  return 'Luxury';
};

export const getBudgetCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'Backpacker':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Standard':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Luxury':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const getTravelStyleBadgeStyle = (style: string) => {
  const normStyle = style.toLowerCase();
  if (normStyle === 'family') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normStyle === 'couple') {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (normStyle === 'solo') {
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

export const formatTravelStyle = (style: string) => {
  const normStyle = style.toLowerCase();
  if (normStyle === 'family') return 'Family';
  if (normStyle === 'couple') return 'Couple';
  if (normStyle === 'solo') return 'Solo';
  // Fallbacks if style is luxury or backpacker
  if (normStyle === 'luxury') return 'Couple';
  if (normStyle === 'backpacker') return 'Solo';
  return 'Solo';
};

// ==========================================
// TRIP CARD COMPONENT
// ==========================================

interface TripCardProps {
  trip: TripResponse;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const budgetCat = getBudgetCategory(trip.budget);
  const travelStyleFormatted = formatTravelStyle(trip.category || 'solo');

  return (
    <div
      onClick={onClick}
      className="bg-white hover:bg-emerald-50/10 rounded-3xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1">
              <span>Destinasi</span>
              <span className="text-sm">{getDestinationIcon(trip.destination)}</span>
            </span>
            <h3 className="text-lg font-extrabold text-emerald-950 capitalize group-hover:text-emerald-600 transition-colors">
              {trip.destination}
            </h3>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border shadow-3xs ${getBudgetCategoryBadgeStyle(budgetCat)}`}>
              {budgetCat}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shadow-3xs ${getTravelStyleBadgeStyle(travelStyleFormatted)}`}>
              {travelStyleFormatted}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 pt-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-base">🗓️</span>
            <span>{trip.days} Hari</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-base">💰</span>
            <span>USD {parseFloat(trip.budget.toString()).toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gradient-to-b from-white to-emerald-50/30 border-t border-emerald-50 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
        <span>Lihat Selengkapnya</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// PARSING & SECTIONS FOR TRIP DETAIL
// ==========================================

export interface SectionData {
  id: string;
  title: string;
  type: 'day' | 'tips' | 'food' | 'budget' | 'other';
  icon: string;
  content: string;
}

/**
 * Parse raw recommendation markdown into distinct sections (Days, Tips, Food, Budget)
 */
export const parseRecommendationSections = (rawText: string): SectionData[] => {
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
export const SectionCard: React.FC<{ section: SectionData }> = ({ section }) => {
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
              h3: ({ ...props }) => (
                <h3 className="text-base font-bold text-emerald-950 mt-3 mb-1.5 pb-1 border-b border-emerald-100" {...props} />
              ),
              strong: ({ ...props }) => <strong className="font-semibold text-emerald-950" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 my-2.5 pl-1 text-slate-700" {...props} />,
              li: ({ ...props }) => <li className="text-slate-700 leading-relaxed pl-1" {...props} />,
              p: ({ ...props }) => <p className="my-1.5 text-slate-700 leading-relaxed" {...props} />,
              blockquote: ({ ...props }) => (
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

// ==========================================
// TRIP DETAIL COMPONENT (DEFAULT EXPORT)
// ==========================================

export interface TripDetailComponentProps {
  destination: string;
  budget?: string | number;
  recommendation: string;
  category?: string;
}

export default function TripDetailComponent({ destination, budget, recommendation, category }: TripDetailComponentProps) {
  const sections = parseRecommendationSections(recommendation);
  const flagIcon = getDestinationIcon(destination);
  const budgetCat = budget ? getBudgetCategory(parseFloat(budget.toString())) : null;
  const travelStyleFormatted = category ? formatTravelStyle(category) : null;

  return (
    <div className="space-y-4 lg:max-h-[800px] lg:overflow-y-auto lg:pr-1">
      {/* Destination Header Card */}
      <div className="p-5 sm:p-6 bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200/90 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl shadow-sm text-2xl flex items-center justify-center">
            {flagIcon !== '📍' ? flagIcon : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-700 tracking-wider">Hasil Rencana Perjalanan</span>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 capitalize">{destination}</h2>
              {budget && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
                  💵 USD {parseFloat(budget.toString()).toLocaleString('en-US')}
                </span>
              )}
              {budgetCat && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getBudgetCategoryBadgeStyle(budgetCat)}`}>
                  {budgetCat}
                </span>
              )}
              {travelStyleFormatted && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${getTravelStyleBadgeStyle(travelStyleFormatted)}`}>
                  {travelStyleFormatted}
                </span>
              )}
            </div>
          </div>
        </div>

        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
          {sections.filter((s) => s.type === 'day').length} Hari Itinerary
        </span>
      </div>

      {/* Individual Cards for each parsed section */}
      {sections.length > 0 ? (
        sections.map((section) => <SectionCard key={section.id} section={section} />)
      ) : (
        /* Fallback if raw text couldn't be parsed */
        <SectionCard
          section={{
            id: 'default-section',
            title: 'Rekomendasi Perjalanan',
            type: 'other',
            icon: '🗺️',
            content: recommendation,
          }}
        />
      )}
    </div>
  );
}
