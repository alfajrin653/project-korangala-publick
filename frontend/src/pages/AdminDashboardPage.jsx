import React from 'react';
import { Link } from 'react-router-dom'; // Tambahkan import Link ini
import { useAuthStore } from '../store/useAuthStore';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className='kg-container py-8 min-h-screen bg-obsidian text-ink'>
      {/* --- HEADER DASHBOARD --- */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold font-heading text-cyan'>CMS Dashboard</h1>
          <p className='text-ink-muted mt-2'>
            Selamat datang, <span className='font-semibold text-emerald'>{user?.name}</span>
            <span className='ml-2 kg-badge bg-charcoal border border-gray-700 text-xs px-2 py-1 rounded-full uppercase'>{user?.role}</span>
          </p>
        </div>
        {/* Tombol Tulis Artikel Dihidupkan */}
        <Link to='/admin/tulis' className='bg-cyan text-obsidian px-4 py-2 rounded font-semibold hover:bg-cyan-dim transition inline-block'>
          + Tulis Artikel
        </Link>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* --- 1. WIDGET KHUSUS ADMIN --- */}
        {user?.role === 'admin' && (
          <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2'>
            <div className='kg-card bg-charcoal p-4 rounded-lg border border-gray-800 hover:border-cyan transition cursor-pointer'>
              <h3 className='font-bold text-cyan mb-1'>Manajemen User & e-KYC</h3>
              <p className='text-sm text-ink-muted'>Kelola akun, role, dan verifikasi NIK (1 NIK 1 ID).</p>
            </div>
            <div className='kg-card bg-charcoal p-4 rounded-lg border border-gray-800 hover:border-cyan transition cursor-pointer'>
              <h3 className='font-bold text-cyan mb-1'>B2B Ticker Data</h3>
              <p className='text-sm text-ink-muted'>Kelola data pergerakan pasar untuk Marquee.</p>
            </div>
            <div className='kg-card bg-charcoal p-4 rounded-lg border border-gray-800 hover:border-cyan transition cursor-pointer'>
              <h3 className='font-bold text-cyan mb-1'>Master Wilayah & Kategori</h3>
              <p className='text-sm text-ink-muted'>Kelola taksonomi portal berita.</p>
            </div>
          </div>
        )}

        {/* --- 2. WIDGET KHUSUS EDITOR & ADMIN --- */}
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <div className='lg:col-span-1 flex flex-col gap-4'>
            <div className='kg-card bg-charcoal p-6 rounded-lg border border-hoax/30'>
              <h2 className='text-xl font-bold font-heading mb-2 text-hoax'>Radar Hoaks</h2>
              <p className='text-sm text-ink-muted mb-4'>Kelola dan verifikasi database arsip hoaks publik.</p>
              <Link to='/arsip-hoaks' className='block text-center w-full bg-charcoal border border-hoax text-hoax px-4 py-2 rounded hover:bg-hoax hover:text-white transition'>
                Kelola Arsip Hoaks
              </Link>
            </div>
            <div className='kg-card bg-charcoal p-6 rounded-lg border border-gray-800'>
              <h2 className='text-xl font-bold font-heading mb-2'>Moderasi Konten</h2>
              <p className='text-sm text-ink-muted mb-4'>Review draf artikel dari Citizen Reporter.</p>
              {/* Tombol Antrean Draf Dihidupkan */}
              <Link to='/admin/redaksi' className='block text-center w-full bg-gray-800 text-ink px-4 py-2 rounded hover:bg-gray-700 transition'>
                Lihat Antrean Draf
              </Link>
            </div>
          </div>
        )}

        {/* --- 3. WIDGET UNTUK SEMUA ROLE --- */}
        <div className={`kg-card bg-charcoal p-6 rounded-lg border border-gray-800 ${user?.role === 'citizen_reporter' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className='flex justify-between items-center mb-4 border-b border-gray-700 pb-2'>
            <h2 className='text-xl font-bold font-heading'>{user?.role === 'admin' ? 'Semua Artikel' : 'Artikel Anda'}</h2>
            {user?.role === 'citizen_reporter' && <span className='text-sm font-semibold text-emerald bg-emerald/10 px-3 py-1 rounded-full border border-emerald/20'>Saldo: Rp {user?.wallet_balance_nidr || '0'}</span>}
          </div>

          <div className='text-center py-10 text-ink-muted'>
            <p>Akses cepat ke daftar artikel Anda.</p>
            <Link to='/admin/kontent-saya' className='inline-block mt-4 text-cyan hover:underline text-sm font-bold'>
              Lihat Konten Saya &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
