'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ConservationItem,
  MessageItem,
  getConservations,
  getConservationById,
  createConservation,
  createMessage,
  deleteConservation,
  updateConservation,
  sendChatMessage,
} from '@/services/conservationService';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

export default function ChatPage() {
  const router = useRouter();
  const [conservations, setConservations] = useState<ConservationItem[]>([]);
  const [activeConservationId, setActiveConservationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, MessageItem[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingConservation, setCreatingConservation] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConservationId, loading]);

  // Fetch conservations on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    loadConservations();
  }, []);

  const handleSelectConservation = async (id: number) => {
    setActiveConservationId(id);
    try {
      // Ambil data detail percakapan beserta messages ke /api/v1/conservations/{id}
      const convDetail = await getConservationById(id);
      if (convDetail && convDetail.messages) {
        setMessages((prev) => ({ ...prev, [id]: convDetail.messages || [] }));
      }
    } catch (err: any) {
      console.error(`Gagal memuat messages untuk percakapan #${id}:`, err);
    }
  };

  const loadConservations = async () => {
    setFetchingData(true);
    setErrorMsg(null);
    try {
      const data = await getConservations();
      setConservations(data);
      if (data.length > 0) {
        const firstId = data[0].id;
        setActiveConservationId(firstId);
        // Ambil pesan untuk percakapan pertama yang aktif
        handleSelectConservation(firstId);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal memuat percakapan');
    } finally {
      setFetchingData(false);
    }
  };

  const handleAddConservation = async () => {
    setCreatingConservation(true);
    setErrorMsg(null);
    try {
      // Default awal title jadikan string kosong ""
      const newConv = await createConservation('');
      setConservations((prev) => [newConv, ...prev]);
      setActiveConservationId(newConv.id);
      setMessages((prev) => ({ ...prev, [newConv.id]: [] }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menambah percakapan baru');
    } finally {
      setCreatingConservation(false);
    }
  };

  const handleDeleteConservation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) return;

    try {
      await deleteConservation(id);
      setConservations((prev) => prev.filter((item) => item.id !== id));
      if (activeConservationId === id) {
        const remaining = conservations.filter((item) => item.id !== id);
        setActiveConservationId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menghapus percakapan');
    }
  };

  const handleStartEditTitle = (id: number, currentTitle: string | null | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle || '');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveEditTitle = async (id: number, e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (e.type === 'submit') {
      (e as React.FormEvent).preventDefault();
    }
    const newTitle = editTitle.trim();
    if (!newTitle) {
      setEditingId(null);
      return;
    }

    setSavingTitle(true);
    try {
      await updateConservation(id, newTitle);
      setConservations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
      );
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal memperbarui judul percakapan');
    } finally {
      setSavingTitle(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConservationId || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    const userMsg: MessageItem = {
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConservationId]: [...(prev[activeConservationId] || []), userMsg],
    }));

    try {
      // Jika title percakapan masih kosong, perbarui title dengan isi chat pertama user
      const currentConv = conservations.find((c) => c.id === activeConservationId);
      if (currentConv && (!currentConv.title || currentConv.title.trim() === '')) {
        const generatedTitle = userText.length > 40 ? userText.slice(0, 40) + '...' : userText;
        updateConservation(activeConservationId, generatedTitle)
          .then((updatedConv) => {
            setConservations((prev) =>
              prev.map((c) => (c.id === activeConservationId ? { ...c, title: updatedConv.title || generatedTitle } : c))
            );
          })
          .catch((err) => console.error('Gagal memperbarui judul percakapan:', err));
      }

      // 1. Simpan pesan user ke backend
      await createMessage(activeConservationId, 'user', userText);

      // 2. Siapkan riwayat percakapan untuk dikirim ke AI (dibatasi 10 pesan terakhir & di-trim untuk hemat token)
      const currentHistory = (messages[activeConservationId] || []).concat(userMsg);
      const conversationPrompt = currentHistory
        .slice(-10) // Ambil maksimal 10 chat terakhir
        .map((m) => ({
          role: m.role === 'ai' ? 'assistant' : m.role,
          content: m.content.trim(), // Trim whitespace
        }))
        .filter((m) => m.content.length > 0);

      // Minta respon dari AI via service dengan riwayat percakapan yang sudah dioptimasi
      let aiText = 'Maaf, terjadi kesalahan saat menghubungi AI.';
      try {
        const aiData = await sendChatMessage(conversationPrompt);
        aiText = aiData.answer || 'Tidak ada tanggapan dari AI.';
      } catch (err: any) {
        console.error('AI chat error:', err);
      }

      // 3. Simpan pesan AI ke backend
      const aiMsgObj = await createMessage(activeConservationId, 'ai', aiText);

      setMessages((prev) => ({
        ...prev,
        [activeConservationId]: [...(prev[activeConservationId] || []), aiMsgObj],
      }));
    } catch (err: any) {
      console.error(err);
      const errorAiMsg: MessageItem = {
        role: 'ai',
        content: `Error: ${err.message || 'Gagal mengirim pesan'}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeConservationId]: [...(prev[activeConservationId] || []), errorAiMsg],
      }));
    } finally {
      setLoading(false);
    }
  };

  const activeConservation = conservations.find((c) => c.id === activeConservationId);
  const activeMessages = activeConservationId ? messages[activeConservationId] || [] : [];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Kiri */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Sidebar dengan Link ke Halaman Utama */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-emerald-400 font-bold text-lg hover:opacity-90 transition-opacity">
              <span className="text-2xl">🌴</span>
              <span>Kelana AI Chat</span>
            </Link>
            <Link
              href="/"
              title="Kembali ke Beranda Utama"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-all border border-slate-700/60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>

          {/* Tombol Tambah Percakapan Baru */}
          <div className="p-4">
            <button
              onClick={handleAddConservation}
              disabled={creatingConservation}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>{creatingConservation ? 'Membuat...' : 'Percakapan Baru'}</span>
            </button>
          </div>

          {/* Daftar Conservations */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {fetchingData ? (
              <div className="p-4 text-center text-slate-500 text-sm animate-pulse">
                Memuat percakapan...
              </div>
            ) : conservations.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                Belum ada percakapan. Klik tombol di atas untuk memulai.
              </div>
            ) : (
              conservations.map((item) => {
                const isActive = item.id === activeConservationId;
                const isEditing = item.id === editingId;
                const displayTitle = item.title && item.title.trim() !== '' ? item.title : `Percakapan #${item.id}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => !isEditing && handleSelectConservation(item.id)}
                    className={`w-full group px-3 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${isActive
                      ? 'bg-slate-800 border border-emerald-500/40 text-emerald-300 font-medium shadow-md'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                  >
                    {isEditing ? (
                      /* Mode Edit Title */
                      <form
                        onSubmit={(e) => handleSaveEditTitle(item.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-1.5 flex-1 min-w-0 pr-1"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          disabled={savingTitle}
                          className="flex-1 bg-slate-950 border border-emerald-500 text-slate-100 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="submit"
                          disabled={savingTitle || !editTitle.trim()}
                          title="Simpan Judul"
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          title="Batal"
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </form>
                    ) : (
                      /* Mode Normal Tampilan */
                      <>
                        <div className="flex items-center space-x-3 truncate flex-1 min-w-0 pr-2">
                          <svg className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span className="truncate text-sm">{displayTitle}</span>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button
                            onClick={(e) => handleStartEditTitle(item.id, item.title, e)}
                            title="Edit Judul"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40 transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeleteConservation(item.id, e)}
                            title="Hapus Percakapan"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="flex items-center space-x-1.5 hover:text-emerald-400 transition-colors font-medium">
            <span>🏠</span>
            <span>Beranda Utama</span>
          </Link>
          <Link href="/trips" className="hover:text-emerald-400 transition-colors">
            Trips &rarr;
          </Link>
        </div>
      </aside>

      {/* Jendela Percakapan Sebelah Kanan */}
      <main className="flex-1 flex flex-col bg-slate-950">
        {/* Header Chat */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="font-semibold text-slate-200">
              {activeConservation
                ? activeConservation.title && activeConservation.title.trim() !== ''
                  ? activeConservation.title
                  : `Percakapan #${activeConservation.id}`
                : 'Pilih Percakapan'}
            </h1>
          </div>

          {/* Navigasi Tambahan Kembali ke Beranda */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-all border border-slate-800"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">Halaman Utama</span>
          </Link>
        </header>

        {/* Area Pesan Chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeConservationId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <span className="text-5xl mb-4">💬</span>
              <p>Pilih percakapan di sebelah kiri atau buat percakapan baru.</p>
            </div>
          ) : activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <span className="text-4xl text-emerald-400/60">✈️</span>
              <p className="font-medium text-slate-300">Mulai Percakapan dengan Kelana AI</p>
              <p className="text-xs text-slate-500">Tanyakan rekomendasi tempat wisata, budget, atau tips perjalanan.</p>
            </div>
          ) : (
            activeMessages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 font-bold ${isUser ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      }`}
                  >
                    {isUser ? 'U' : 'AI'}
                  </div>

                  {/* Bubble Pesan */}
                  <div
                    className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}

          {/* Indicator AI Typing */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0">
                AI
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 text-sm flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Pesan di Bawah */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeConservationId ? 'Tulis pesanmu di sini...' : 'Pilih percakapan untuk mengetik...'}
              disabled={!activeConservationId || loading}
              className="flex-1 bg-slate-900 border border-slate-700/70 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!activeConservationId || !inputMessage.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-xl transition-all flex items-center space-x-2 disabled:opacity-40 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <span>Kirim</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
