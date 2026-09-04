import Link from 'next/link';
import Logo from '@/componets/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header mini */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <Logo size={40} />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-emerald-950">
              Kelana<span className="text-emerald-600">AI</span>
            </span>
          </div>
        </Link>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Compass / Lost Pin Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 mb-6 shadow-inner border border-emerald-200/60">
            <svg
              className="w-10 h-10 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 tracking-wider mb-3">
            ERROR 404
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mb-3">
            Destinasi Tidak Ditemukan
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
            Sepertinya halaman yang kamu tuju belum terpetakan di sistem perjalanan Kelana AI atau alamat tautan telah berubah.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Kembali ke Beranda
            </Link>
            <Link
              href="/trips"
              className="px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200/80 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              Lihat Riwayat Trip
            </Link>
          </div>
        </div>
      </main>

      {/* Footer mini */}
      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Kelana AI. Teman Cerdas Perjalananmu.
      </footer>
    </div>
  );
}
