import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = 'Memuat...',
  subMessage = 'Sedang menyiapkan petualangan terbaik untukmu',
  fullScreen = true,
}: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
      {/* Dynamic Animated Pulse Logo Container */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Glow rings */}
        <div className="absolute w-24 h-24 rounded-full bg-emerald-400/20 animate-ping opacity-75"></div>
        <div className="absolute w-20 h-20 rounded-3xl bg-emerald-500/10 animate-pulse"></div>

        {/* Squircle Animated Icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 transform transition-transform hover:scale-105">
          <svg
            className="w-9 h-9 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2-0 012-2h1.055M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Title / Primary Text */}
      <h3 className="text-xl font-extrabold text-emerald-950 tracking-tight mb-2">
        {message}
      </h3>

      {/* Secondary explanatory text */}
      {subMessage && (
        <p className="text-xs sm:text-sm text-emerald-700/80 mb-6 font-medium leading-relaxed">
          {subMessage}
        </p>
      )}

      {/* Progress Bar Animation */}
      <div className="w-48 bg-emerald-100/80 rounded-full h-1.5 overflow-hidden shadow-inner">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 h-full rounded-full animate-pulse w-3/4"></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        {content}
      </div>
    );
  }

  return content;
}
