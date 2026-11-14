import React, { useState, useEffect } from 'react';
import { articlesApi, categoriesApi, regionsApi } from '../api/endpoints'; // Pastikan regionsApi diimpor
import { CheckCircle, XCircle, Eye, AlertTriangle, X, Bot, AlertOctagon } from 'lucide-react';

const EditorialDashboardPage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]); // State untuk daftar wilayah
  const [loading, setLoading] = useState(false);

  // State untuk Split-Screen Modal
  const [previewArticle, setPreviewArticle] = useState(null);
  const [reviewData, setReviewData] = useState({
    category_id: '',
    region_id: '', // State baru untuk menyimpan pilihan wilayah redaksi
    is_hoax: false,
    rejection_notes: '',
  });

  useEffect(() => {
    fetchPendingArticles();
    fetchCategories();
    fetchRegions(); // Load wilayah saat dashboard dibuka
  }, []);

  const fetchPendingArticles = async () => {
    setLoading(true);
    try {
      const res = await articlesApi.getPending();
      setArticles(res.data.data || res.data || []);
    } catch (error) {
      console.error('Gagal memuat antrean artikel:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.list();
      setCategories(res.data.data || res.data || []);
    } catch (error) {
      console.error('Gagal memuat kategori:', error);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await regionsApi.list();
      setRegions(res.data.data || res.data || []);
    } catch (error) {
      console.error('Gagal memuat wilayah:', error);
    }
  };

  // FUNGSI PENERJEMAH BLOK (Untuk Kiri Layar / Pratinjau)
  const renderContentBlocks = (contentData) => {
    if (!contentData) return null;
    try {
      const blocks = JSON.parse(contentData);
      return blocks.map((block, index) => {
        if (block.type === 'richtext') return <div key={index} className='mb-4' dangerouslySetInnerHTML={{ __html: block.value }} />;
        if (block.type === 'quote')
          return (
            <blockquote key={index} className='border-l-4 border-cyan pl-4 py-2 my-6 bg-cyan/5 rounded-r'>
              <p className='italic text-cyan'>"{block.value}"</p>
            </blockquote>
          );
        if (block.type === 'image')
          return (
            <figure key={index} className='my-6'>
              <img src={block.value || block.preview} alt='Inline' className='w-full rounded-lg' />
              {block.source && <figcaption className='text-center text-sm text-ink-muted mt-2'>{block.source}</figcaption>}
            </figure>
          );
        return null;
      });
    } catch (e) {
      return <div dangerouslySetInnerHTML={{ __html: contentData }} />;
    }
  };

  const openPreview = (article) => {
    setPreviewArticle(article);
    setReviewData({
      category_id: article.category_id || '',
      region_id: article.region_id || '', // Tarik data wilayah bawaan artikel
      is_hoax: article.is_hoax || false,
      rejection_notes: '',
    });
  };

  const closePreview = () => {
    setPreviewArticle(null);
  };

  const handleSubmitReview = async (status) => {
    if (status === 'rejected' && !reviewData.rejection_notes.trim()) {
      alert('Tuliskan alasan penolakan pada kolom catatan revisi!');
      return;
    }

    try {
      // Mengirim status, kategori baru, wilayah baru, dan status hoax
      await articlesApi.review(previewArticle.id, {
        status,
        category_id: reviewData.category_id,
        region_id: reviewData.region_id, // Kirim wilayah yang dipilih ke backend
        is_hoax: reviewData.is_hoax,
        rejection_notes: status === 'rejected' ? reviewData.rejection_notes : null,
      });

      alert(status === 'published' ? 'Artikel resmi ditayangkan!' : 'Artikel dikembalikan ke kreator.');
      setArticles(articles.filter((a) => a.id !== previewArticle.id)); // Hapus dari antrean
      closePreview();
    } catch (error) {
      console.error(error);
      alert('Gagal memproses artikel. Periksa console.');
    }
  };

  const BASE_URL = 'http://localhost:4000/';

  return (
    <div className='min-h-screen bg-obsidian text-ink p-4 md:p-8 font-body'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-3 mb-8'>
          <AlertTriangle className='text-cyan' size={28} />
          <h1 className='text-3xl font-bold font-heading text-cyan'>Ruang Redaksi</h1>
        </div>

        <div className='bg-charcoal border border-gray-800 rounded-xl p-6 shadow-xl'>
          <h2 className='text-xl font-semibold mb-6 border-b border-gray-800 pb-4'>Antrean Moderasi ({articles.length})</h2>

          <div className='flex flex-col gap-4'>
            {loading ? (
              <div className='text-center py-8 text-ink-muted'>Memuat antrean...</div>
            ) : articles.length === 0 ? (
              <div className='text-center py-12 text-ink-muted bg-obsidian rounded-lg border border-gray-800 border-dashed'>Hore! Tidak ada artikel yang mengantre.</div>
            ) : (
              articles.map((item) => (
                <div key={item.id} className='flex flex-col md:flex-row justify-between items-start md:items-center bg-obsidian p-4 rounded-lg border border-gray-800 gap-4'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-bold text-ink mb-1'>{item.title}</h3>
                    <div className='flex gap-3 text-sm text-ink-muted'>
                      <span className='text-cyan'>{item.category?.name || 'Tanpa Kanal'}</span>
                      {item.region && <span className='text-emerald'>• {item.region.name}</span>}
                      <span>
                        Oleh: <strong className='text-emerald'>{item.author?.name}</strong>
                      </span>
                    </div>
                  </div>
                  <button onClick={() => openPreview(item)} className='flex items-center gap-2 px-4 py-2 bg-cyan/10 text-cyan border border-cyan/30 rounded hover:bg-cyan hover:text-obsidian transition font-semibold whitespace-nowrap'>
                    <Eye size={18} /> Mulai Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL SPLIT-SCREEN LAYAR PENUH */}
      {previewArticle && (
        <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col md:flex-row'>
          {/* KIRI: AREA BACA PRATINJAU */}
          <div className='w-full md:w-2/3 h-full overflow-y-auto bg-obsidian p-6 md:p-10 border-r border-gray-800'>
            <div className='max-w-2xl mx-auto'>
              <h1 className='text-3xl font-bold font-heading mb-4 leading-tight'>{previewArticle.title}</h1>
              <div className='flex items-center gap-2 mb-8 text-sm text-ink-muted pb-4 border-b border-gray-800'>
                <span>
                  Oleh <strong className='text-emerald'>{previewArticle.author?.name}</strong>
                </span>
                <span>•</span>
                <span>{new Date(previewArticle.updatedAt).toLocaleDateString('id-ID')}</span>
              </div>

              {previewArticle.cover_image && <img src={previewArticle.cover_image.startsWith('http') ? previewArticle.cover_image : `${BASE_URL}${previewArticle.cover_image}`} alt='Cover' className='w-full rounded-xl mb-8 object-cover max-h-96' />}

              <div className='prose prose-invert max-w-none text-ink leading-[1.8] text-lg'>{renderContentBlocks(previewArticle.content)}</div>
            </div>
          </div>

          {/* KANAN: PANEL KENDALI EDITOR */}
          <div className='w-full md:w-1/3 h-full overflow-y-auto bg-charcoal p-6 flex flex-col relative'>
            <button onClick={closePreview} className='absolute top-4 right-4 text-ink-muted hover:text-white bg-gray-800 p-2 rounded-full'>
              <X size={20} />
            </button>

            <h2 className='text-xl font-bold mb-6 pt-2'>Panel Kendali Redaksi</h2>

            {/* 1. KOTAK ANALISIS AI */}
            <div className='bg-obsidian border border-emerald/30 rounded-lg p-4 mb-6'>
              <div className='flex items-center gap-2 text-emerald font-bold mb-3'>
                <Bot size={20} /> Analisis Editor AI
              </div>
              <div className='text-sm text-ink-muted space-y-2'>
                <p>
                  <strong>Kelebihan:</strong> Struktur paragraf baik, tidak ada typo terdeteksi.
                </p>
                <p>
                  <strong>Kekurangan:</strong> Judul sedikit *clickbait*, kutipan belum mencantumkan narasumber spesifik.
                </p>
                <p className='text-xs italic text-gray-500 mt-2'>*Catatan: Ini adalah area yang akan dihubungkan dengan API AI di tahap selanjutnya.</p>
              </div>
            </div>

            {/* 2. UBAH KANAL */}
            <div className='mb-4'>
              <label className='block text-sm font-bold text-ink-muted mb-2'>Koreksi Kanal/Kategori</label>
              <select className='w-full bg-obsidian border border-gray-700 rounded-lg p-3 text-ink outline-none focus:border-cyan' value={reviewData.category_id} onChange={(e) => setReviewData({ ...reviewData, category_id: e.target.value })}>
                <option value=''>Pilih Kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FITUR BARU: KOREKSI WILAYAH HIPER-LOKAL */}
            <div className='mb-6'>
              <label className='block text-sm font-bold text-ink-muted mb-2'>Koreksi Wilayah Kejadian</label>
              <select className='w-full bg-obsidian border border-gray-700 rounded-lg p-3 text-ink outline-none focus:border-cyan' value={reviewData.region_id} onChange={(e) => setReviewData({ ...reviewData, region_id: e.target.value })}>
                <option value=''>-- Nasional (Tidak Spesifik) --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. TANDAI HOAKS */}
            <div className='mb-6 bg-hoax/10 border border-hoax/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer' onClick={() => setReviewData({ ...reviewData, is_hoax: !reviewData.is_hoax })}>
              <input type='checkbox' checked={reviewData.is_hoax} onChange={(e) => setReviewData({ ...reviewData, is_hoax: e.target.checked })} className='w-5 h-5 accent-hoax cursor-pointer' />
              <div className='flex-1'>
                <div className='font-bold text-hoax flex items-center gap-2'>
                  <AlertOctagon size={18} /> Terindikasi Hoaks
                </div>
                <p className='text-xs text-hoax/70'>Tandai jika berita mengandung informasi palsu.</p>
              </div>
            </div>

            {/* 4. CATATAN REVISI */}
            <div className='mb-8 flex-1'>
              <label className='block text-sm font-bold text-ink-muted mb-2'>Catatan Revisi untuk Kreator</label>
              <textarea
                className='w-full h-32 bg-obsidian border border-gray-700 rounded-lg p-3 text-ink text-sm outline-none focus:border-hoax resize-none'
                placeholder='Wajib diisi jika menolak artikel...'
                value={reviewData.rejection_notes}
                onChange={(e) => setReviewData({ ...reviewData, rejection_notes: e.target.value })}
              />
            </div>

            {/* TOMBOL AKSI */}
            <div className='flex gap-3 mt-auto'>
              <button onClick={() => handleSubmitReview('rejected')} className='flex-1 flex items-center justify-center gap-2 py-3 bg-hoax/10 text-hoax border border-hoax/30 rounded-lg font-bold hover:bg-hoax hover:text-white transition'>
                <XCircle size={18} /> Tolak
              </button>
              <button onClick={() => handleSubmitReview('published')} className='flex-1 flex items-center justify-center gap-2 py-3 bg-emerald text-obsidian rounded-lg font-bold hover:bg-emerald/80 transition'>
                <CheckCircle size={18} /> Tayangkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialDashboardPage;
