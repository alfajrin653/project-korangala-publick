import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client'; // Sesuaikan jika nama file axios Anda berbeda
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Zap, FileText, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const UpgradeCitizen = () => {
  const navigate = useNavigate();
  const { checkUserSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    try {
      // 1. Tembak API Backend untuk minta tiket/token tagihan
      const response = await apiClient.post('/payment/upgrade-citizen');
      const { token } = response.data.data;

      // 2. Munculkan Pop-Up Midtrans
      window.snap.pay(token, {
        onSuccess: async function (result) {
          alert('Pembayaran Sukses! Selamat datang di Citizen Studio Koran Gala.');
          await checkUserSession(); // Segarkan sesi agar role berubah
          navigate('/admin/tulis-artikel');
        },
        onPending: function (result) {
          alert('Menunggu pembayaran Anda...');
        },
        onError: function (result) {
          alert('Pembayaran gagal, silakan coba lagi.');
        },
        onClose: function () {
          alert('Anda menutup jendela sebelum menyelesaikan pembayaran.');
        }
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gagal menghubungi server.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ink py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ink-muted hover:text-cyan transition-colors mb-8 text-sm font-mono"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold tracking-widest mb-4">
            <Zap size={14} /> GALA EKSKLUSIF
          </div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight sm:text-5xl text-white">
            Suarakan <span className="text-cyan">Kebenaran.</span>
          </h1>
          <p className="mt-4 text-lg text-ink-muted max-w-2xl mx-auto">
            Bergabunglah sebagai <span className="font-bold text-white">Citizen Journalist</span>. Dapatkan akses ke meja redaksi, bangun portofolio, dan monetisasi karya jurnalistik Anda.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-charcoal rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
          
          {/* Sisi Kiri: Benefits */}
          <div className="p-8 md:p-10 md:w-2/3">
            <h2 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
              <ShieldCheck className="text-cyan" size={24} /> Keuntungan Akses Pro
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Akses Citizen Studio Sepuasnya</h3>
                  <p className="text-ink-muted text-sm mt-1">Kirim opini dan liputan investigasi Anda langsung ke meja redaksi Koran Gala 5.0.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Monetisasi FYP (Koin IDR)</h3>
                  <p className="text-ink-muted text-sm mt-1">Dapatkan kompensasi koin rupiah untuk setiap artikel Anda yang berhasil menembus daftar populer.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-cyan shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">E-Sertifikat & Pelatihan Akselerasi</h3>
                  <p className="text-ink-muted text-sm mt-1">Akses materi dasar jurnalistik eksklusif dan dapatkan sertifikat resmi dari Koran Gala.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Sisi Kanan: Harga & Tombol */}
          <div className="bg-obsidian/50 p-8 md:p-10 md:w-1/3 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-white/10 relative overflow-hidden">
            {/* Dekorasi Aksent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-3xl rounded-full"></div>
            
            <p className="text-cyan text-xs font-bold uppercase tracking-widest mb-2 z-10">
              Akses Seumur Hidup
            </p>
            <div className="flex items-baseline text-white z-10">
              <span className="text-2xl font-bold">Rp</span>
              <span className="text-5xl font-extrabold tracking-tighter mx-1">150</span>
              <span className="text-xl font-medium text-ink-muted">.000</span>
            </div>
            <p className="mt-3 text-sm text-ink-muted z-10">
              Satu kali pembayaran. Tanpa biaya langganan bulanan.
            </p>
            
            <button
              onClick={handleUpgradeClick}
              disabled={isLoading}
              className={`mt-8 w-full z-10 flex justify-center items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all shadow-lg shadow-cyan/20 ${
                isLoading 
                  ? 'bg-cyan/50 text-obsidian cursor-not-allowed' 
                  : 'bg-cyan text-obsidian hover:bg-cyan-dim'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <FileText size={18} /> Bayar Sekarang
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-ink-muted flex items-center gap-1.5 z-10">
              <ShieldCheck size={12} className="text-emerald-500" /> Transaksi dilindungi enkripsi
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpgradeCitizen;