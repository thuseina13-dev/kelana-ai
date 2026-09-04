import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface FooterProps {
  className?: string;
  showLinks?: boolean;
}

export default function Footer({ className = '', showLinks = true }: FooterProps) {
  return (
    <footer className={`mt-auto bg-white border-t border-emerald-100/90 text-slate-600 text-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          
          {/* Brand Info */}
          <div className="flex items-center space-x-3">
            <Logo size={32} />
            <div>
              <span className="text-base font-bold text-emerald-950">
                Kelana<span className="text-emerald-600">AI</span>
              </span>
              <p className="text-xs text-slate-500">Perencana Liburan Impian Berbasis AI</p>
            </div>
          </div>

          {/* Quick Links */}
          {showLinks && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-emerald-800/80">
              <Link href="/" className="hover:text-emerald-600 transition-colors">
                Beranda
              </Link>
              <Link href="/about" className="hover:text-emerald-600 transition-colors">
                Tentang
              </Link>
              <Link href="/chat" className="hover:text-emerald-600 transition-colors">
                Chat AI
              </Link>
              <Link href="/ask" className="hover:text-emerald-600 transition-colors">
                Tanya AI
              </Link>
              <Link href="/trips" className="hover:text-emerald-600 transition-colors">
                Riwayat Perjalanan
              </Link>
            </div>
          )}

          {/* Copyright & Tagline */}
          <div className="text-xs text-slate-500 space-y-1 sm:text-right">
            <p>© {new Date().getFullYear()} Kelana AI. Seluruh hak cipta dilindungi.</p>
            <p className="text-emerald-700/80 font-medium">Dibuat dengan 💚 untuk para penjelajah dunia</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
