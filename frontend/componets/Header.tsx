'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';

interface HeaderProps {
  showBadge?: boolean;
}

export default function Header({ showBadge = true }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navLinks = [
    { href: '/chat', label: 'Chat AI' },
    { href: '/ask', label: 'Tanya AI' },
    { href: '/trips', label: 'Riwayat Perjalanan' },
    { href: '/', label: 'Buat Rencana Baru' },
    { href: '/about', label: 'Tentang' },
    { href: '/profile', label: 'Profil Saya' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-emerald-100/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Logo size={40} />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-emerald-950">
              Kelana<span className="text-emerald-600">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-600/80 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Perencana Liburan Cerdas
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium text-emerald-800">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-semibold px-2 py-1 rounded-lg ${
                  isActive
                    ? 'text-emerald-600 bg-emerald-50/80'
                    : 'text-emerald-800/90 hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {showBadge && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Engine Aktif
            </span>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="hover:text-rose-600 transition-colors cursor-pointer border-0 bg-transparent p-1.5 rounded-lg hover:bg-rose-50 flex items-center justify-center text-emerald-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
