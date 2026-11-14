import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { articlesApi } from '../api/endpoints';
import { FileText, Clock, XCircle, Calendar, CheckCircle2, BarChart2, Trash2, Edit3 } from 'lucide-react';

const MyContentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Tab yang aktif: draft, pending_review, rejected, scheduled, published
  const [activeTab, setActiveTab] = useState('draft');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Daftar Tab dengan label dan ikon yang sesuai
  const tabs = [
    { id: 'draft', label: 'Draf', icon: FileText, max: 5 },
    { id: 'pending_review', label: 'Dimoderasi', icon: Clock },
    { id: 'rejected', label: 'Ditolak', icon: XCircle },
    { id: 'scheduled', label: 'Dijadwalkan', icon: Calendar },
    { id: 'published', label: 'Tayang', icon: CheckCircle2 },
  ];

  // Fetch data artikel berdasarkan tab aktif
  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  //   const fetchContent = async (status) => {
  //     setLoading(true);
  //     try {
  //       // Panggil API (Pastikan backend sudah menyediakan endpoint filter status user)
  //       const res = await articlesApi.list({ status, author_id: user?.id });
  //       setArticles(res.data.data || res.data || []);
  //     } catch (error) {
  //       console.error('Gagal memuat konten:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  const fetchContent = async (status) => {
    setLoading(true);
    try {
      // Pastikan menggunakan getMyArticles, BUKAN list
      const res = await articlesApi.getMyArticles(status);

      // Axios biasanya mengembalikan data di dalam res.data.data atau res.data
      const fetchedData = res.data?.data || res.data || [];
      setArticles(fetchedData);
    } catch (error) {
      console.error('Gagal memuat konten saya:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        await articlesApi.delete(id);
        setArticles(articles.filter((item) => item.id !== id));
        alert('Konten berhasil dihapus.');
      } catch (error) {
        alert('Gagal menghapus konten.');
      }
    }
  };

  return (
    <div className='min-h-screen bg-obsidian text-ink py-8 px-4 md:px-8 font-body'>
      <div className='max-w-4xl mx-auto'>
        {/* JUDUL UTAMA */}
        <h1 className='text-3xl font-bold font-heading text-cyan mb-8 text-center md:text-left'>Konten Saya</h1>

        {/* CONTAINER UTAMA KARTU TAB */}
        <div className='bg-charcoal border border-gray-800 rounded-xl p-6 shadow-xl'>
          {/* HEADER TAB NAVIGASI & STATISTIK */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 mb-6 gap-4'>
            <div className='flex flex-wrap gap-2 md:gap-4'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                // Hitung jumlah item (simulasi atau dari data asli)
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold text-sm transition ${isActive ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-ink-muted hover:text-ink hover:bg-gray-800/50'}`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    {tab.id === 'draft' && <span className='text-xs bg-gray-800 px-1.5 py-0.5 rounded text-cyan ml-1'>({articles.length}/5)</span>}
                  </button>
                );
              })}
            </div>

            {/* Tombol Statistik Konten */}
            <button className='flex items-center gap-2 border border-gray-700 text-ink px-4 py-2 rounded-lg text-sm font-medium hover:border-cyan hover:text-cyan transition'>
              <BarChart2 size={16} /> Statistik Konten
            </button>
          </div>

          {/* LIST KONTEN */}
          <div className='flex flex-col divide-y divide-gray-800'>
            {loading ? (
              <div className='text-center py-12 text-ink-muted'>Memuat konten...</div>
            ) : articles.length === 0 ? (
              <div className='text-center py-12 text-ink-muted'>
                <p>
                  Belum ada konten pada kategori <span className='text-cyan font-semibold uppercase'>{activeTab}</span>.
                </p>
              </div>
            ) : (
              articles.map((item) => (
                <div key={item.id} className='py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group'>
                  {/* INFORMASI ARTIKEL */}
                  <div className='flex flex-col gap-1 flex-1'>
                    <h3 className='text-lg font-bold font-heading text-ink group-hover:text-cyan transition'>{item.title || 'Untitled'}</h3>

                    <div className='flex items-center gap-2 text-xs text-ink-muted'>
                      <span className='font-semibold text-emerald'>{user?.name}</span>
                      <span>•</span>
                      <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Jika status Ditolak, tampilkan catatan dari AI / Editor */}
                    {activeTab === 'rejected' && item.rejection_notes && (
                      <div className='mt-2 bg-hoax/10 border border-hoax/30 rounded p-2 text-xs text-hoax'>
                        <strong>Catatan Revisi:</strong> {item.rejection_notes}
                      </div>
                    )}

                    {/* TOMBOL AKSI (Ubah & Hapus) */}
                    <div className='flex items-center gap-4 mt-2 text-sm'>
                      <button onClick={() => navigate(`/admin/edit/${item.id}`)} className='flex items-center gap-1 text-cyan hover:underline font-medium'>
                        <Edit3 size={14} /> Ubah
                      </button>
                      <button onClick={() => handleDelete(item.id)} className='flex items-center gap-1 text-hoax hover:underline font-medium'>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>

                  {/* GAMBAR THUMBNAIL */}
                  <div className='w-full md:w-32 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700'>
                    {item.cover_image ? <img src={item.cover_image} alt={item.title} className='w-full h-full object-cover' /> : <div className='w-full h-full flex items-center justify-center text-xs text-gray-500'>No Image</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyContentPage;
