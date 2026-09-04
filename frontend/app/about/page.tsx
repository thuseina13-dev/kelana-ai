'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/componets/Header';
import Footer from '@/componets/Footer';
import Logo from '@/componets/Logo';

export default function AboutPage() {
  const features = [
    {
      title: 'Itinerary Berbasis AI Pintar',
      description: 'Menyusun jadwal liburan dari hari ke hari secara terperinci, disesuaikan dengan destinasi, anggaran, dan gaya liburan Anda.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Optimalisasi Anggaran & Waktu',
      description: 'Perhitungan estimasi biaya yang transparan dan alur perjalanan realistis agar liburan Anda tenang dan terorganisir.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Konsultasi Perjalanan Interaktif',
      description: 'Tanya jawab seputar rekomendasi kuliner, tips lokal, dan cuaca langsung melalui fitur Chat AI dan Tanya AI.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. Header */}
      <Header />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Glow Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
            <Logo size={48} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Tentang <span className="text-emerald-400">Kelana AI</span>
          </h1>

          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Platform perencana liburan cerdas berbasis Artificial Intelligence untuk merancang perjalanan impian Anda secara praktis, terstruktur, dan personal.
          </p>
        </div>
      </section>

      {/* 3. Main Content / Mission */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100/80 shadow-xl shadow-emerald-950/5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight mb-4">
            Mengapa Memilih Kelana AI?
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
            Merencanakan liburan seringkali memakan waktu berhari-hari untuk meriset destinasi, menyusun rute harian, dan menghitung estimasi anggaran. <strong>Kelana AI</strong> hadir sebagai solusi otomatisasi perjalanan yang mengubah ide liburan Anda menjadi jadwal rencana perjalanan lengkap hanya dalam hitungan detik.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Dengan memanfaatkan model kecerdasan buatan mutakhir, sistem kami menganalisis preferensi perjalanan Anda—baik itu wisata alam, kuliner, solo backpacker, perjalanan keluarga, maupun wisata romantis—lalu menghasilkan susunan kegiatan yang optimal dan efisien.
          </p>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 text-center mb-8">
            Fitur Unggulan Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-md shadow-emerald-950/5 flex flex-col items-start space-y-3 hover:border-emerald-300 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-emerald-950">{feature.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl shadow-emerald-600/20">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Siap Memulai Petualangan Barumu?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Tentukan tujuan liburanmu dan biarkan Kelana AI merancang rencana terbaik untukmu hari ini.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-900 font-extrabold rounded-xl shadow-md hover:bg-emerald-50 transition-all text-sm"
          >
            <span>Mulai Rencanakan Liburan</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
