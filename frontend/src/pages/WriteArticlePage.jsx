import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { articlesApi, categoriesApi, regionsApi } from '../api/endpoints';
import { ImagePlus, X, Send, Save, Tag } from 'lucide-react';
import EditorBlock from '../components/editor/EditorBlock';

const WriteArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useAuthStore();
  const DRAFT_KEY = `korangala_article_draft_${user?.id}`;

  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverSource, setCoverSource] = useState('');
  const [categories, setCategories] = useState([]);

  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  const [blocks, setBlocks] = useState([{ id: Date.now(), type: 'richtext', value: '', reference: '' }]);

  // Di dalam WriteArticlePage.jsx, tambahkan state ini di dekat state title/category:
  const [regionId, setRegionId] = useState('');
  const [regionsList, setRegionsList] = useState([]); // Untuk menampung daftar wilayah dari database

  // Load data jika mode Edit atau LocalStorage Draft
  useEffect(() => {
    if (isEditMode) {
      fetchArticleData();
    } else {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setCategoryId(parsed.categoryId || '');
          setCoverSource(parsed.coverSource || '');
          setKeywords(parsed.keywords || []);
          if (parsed.blocks && parsed.blocks.length > 0) {
            setBlocks(parsed.blocks);
          }
        } catch (e) {
          console.error('Gagal memuat local draft', e);
        }
      }
    }
  }, [id]);

  // Auto-save ke LocalStorage hanya jika bukan mode edit dari server
  useEffect(() => {
    if (!isEditMode) {
      const draftData = { title, categoryId, coverSource, keywords, blocks };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }
  }, [title, categoryId, coverSource, keywords, blocks, isEditMode]);

  const fetchArticleData = async () => {
    try {
      // KODE BARU
      const res = await articlesApi.detail(id);
      const article = res.data.data || res.data;
      setTitle(article.title || '');
      setCategoryId(article.category_id || '');
      setCoverPreview(article.cover_image || null);
      setCoverSource(article.cover_source || '');
      setKeywords(article.keywords ? JSON.parse(article.keywords) : []);
      setRegionId(article.region_id || '');
      if (article.content) {
        try {
          setBlocks(JSON.parse(article.content));
        } catch {
          setBlocks([{ id: Date.now(), type: 'richtext', value: article.content, reference: '' }]);
        }
      }
    } catch (error) {
      console.error('Gagal memuat data artikel:', error);
    }
  };

  // --- FUNGSI HANDLER COVER YANG SEBELUMNYA HILANG ---
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    setCoverSource('');
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = keywordInput.trim().toLowerCase();
      if (val && !keywords.includes(val)) setKeywords([...keywords, val]);
      setKeywordInput('');
    }
  };

  // Logic Blocks
  const addBlock = (type, index) => {
    const newBlock = type === 'image' ? { id: Date.now(), type: 'image', file: null, preview: '', source: '' } : { id: Date.now(), type: type, value: '', reference: '' };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (id) => {
    if (blocks.length > 1) setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleBlockImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setBlocks(blocks.map((b) => (b.id === id ? { ...b, file: file, preview: URL.createObjectURL(file) } : b)));
    }
  };

  // SUBMIT API
  const submitAction = async (isDraft = false) => {
    if (!title || !categoryId || blocks.length === 0) {
      alert('Judul, Kanal, dan minimal 1 blok konten wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('category_id', categoryId);
      data.append('region_id', regionId);
      data.append('keywords', JSON.stringify(keywords));
      data.append('status', isDraft ? 'draft' : 'pending_review');

      if (coverImage) {
        data.append('cover_image', coverImage);
      }
      data.append('cover_source', coverSource);

      const contentPayload = blocks.map((b) => {
        if (b.type === 'image' && b.file) {
          data.append('inline_images', b.file);
          return { type: 'image', fileName: b.file.name, source: b.source };
        }
        return b;
      });
      data.append('content', JSON.stringify(contentPayload));

      if (isEditMode) {
        await articlesApi.update(id, data);
        alert('Artikel berhasil diperbarui!');
      } else {
        await articlesApi.create(data);
        localStorage.removeItem(DRAFT_KEY);
        alert(isDraft ? 'Draft berhasil disimpan.' : 'Artikel berhasil dikirim dan akan segera ditinjau oleh tim redaksi.');
      }

      navigate('/admin');
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan artikel. Periksa kembali inputan Anda.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // api location
  // API Load Kategori & Wilayah saat pertama kali halaman dibuka
  // API Load Wilayah saat pertama kali halaman dibuka
  useEffect(() => {
    // Ambil daftar wilayah untuk dropdown Hiper-Lokal
    regionsApi
      .list()
      .then((res) => setRegionsList(res.data.data || res.data || []))
      .catch((err) => console.error('Gagal memuat wilayah:', err));
  }, []);

  useEffect(() => {
    // Ambil daftar kategori secara dinamis dari database
    categoriesApi
      .list()
      .then((res) => setCategories(res.data.data || res.data || []))
      .catch((err) => console.error('Gagal memuat kategori:', err));

    // Ambil daftar wilayah untuk dropdown Hiper-Lokal
    regionsApi
      .list()
      .then((res) => setRegionsList(res.data.data || res.data || []))
      .catch((err) => console.error('Gagal memuat wilayah:', err));
  }, []);

  return (
    <div className='min-h-screen bg-obsidian text-ink flex flex-col font-body pb-32'>
      <header className='sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 md:px-8 flex justify-between items-center shadow-lg'>
        <div className='flex items-center gap-4'>
          <button onClick={() => navigate('/admin')} className='text-ink-muted hover:text-cyan transition font-medium'>
            ← Kembali
          </button>
          <span className='hidden md:inline-block text-xs text-gray-500 italic'>Disimpan otomatis di browser...</span>
        </div>

        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => submitAction(true)}
            disabled={loading}
            className='flex items-center gap-2 bg-transparent border border-gray-600 text-ink-muted px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50'
          >
            <Save size={16} /> Simpan Draft
          </button>
          <button type='button' onClick={() => submitAction(false)} disabled={loading} className='flex items-center gap-2 bg-emerald text-obsidian px-6 py-2 rounded-full font-bold hover:bg-emerald/80 transition disabled:opacity-50'>
            <Send size={16} /> Submission
          </button>
        </div>
      </header>

      <main className='flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-8'>
        {/* FOTO SAMPUL UTAMA */}
        <div className='w-full mt-4 flex flex-col gap-2'>
          {coverPreview ? (
            <div className='relative w-full h-64 md:h-96 rounded-xl overflow-hidden bg-charcoal border border-gray-800'>
              <img src={coverPreview} alt='Cover Preview' className='w-full h-full object-cover' />
              <button type='button' onClick={removeCover} className='absolute top-4 right-4 bg-obsidian/80 text-hoax p-2 rounded-full hover:bg-hoax hover:text-white transition'>
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className='w-full h-64 md:h-96 flex flex-col items-center justify-center bg-charcoal border-2 border-dashed border-gray-700 rounded-xl hover:border-cyan hover:bg-gray-800/50 transition cursor-pointer'>
              <ImagePlus size={48} className='text-gray-600 mb-4' />
              <span className='text-ink-muted font-medium'>Unggah Foto Sampul Utama</span>
              <input type='file' accept='image/*' className='hidden' onChange={handleCoverChange} />
            </label>
          )}
          {coverPreview && (
            <input
              type='text'
              placeholder='Sumber Foto Sampul (Contoh: Reuters / Nama Fotografer)...'
              value={coverSource}
              onChange={(e) => setCoverSource(e.target.value)}
              className='w-full bg-transparent text-sm text-ink-muted placeholder:text-gray-600 border-b border-gray-800 pb-1 outline-none focus:border-cyan italic text-center'
            />
          )}
        </div>

        {/* JUDUL & KANAL */}
        <div className='flex flex-col gap-4'>
          <textarea
            placeholder='Tulis Judul Berita...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full bg-transparent text-4xl md:text-5xl font-bold font-heading text-ink placeholder:text-gray-700 outline-none resize-none overflow-hidden'
            rows={2}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <div className='flex items-center gap-3 border-b border-gray-800 pb-6'>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className='bg-charcoal border border-gray-700 text-ink text-sm rounded-md px-3 py-1.5 outline-none focus:border-cyan'>
              <option value='' disabled>
                -- Pilih Kanal --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-mono text-ink-muted'>Lokasi / Wilayah Kejadian (Hiper-Lokal)</label>
            <select value={regionId} onChange={(e) => setRegionId(e.target.value)} className='bg-charcoal border border-gray-700 text-ink text-sm rounded-md px-3 py-2 outline-none focus:border-cyan'>
              <option value=''>-- Pilih Wilayah (Opsional / Nasional) --</option>
              {regionsList.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name} ({reg.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BLOK KONTEN */}
        <div className='flex flex-col gap-6'>
          {blocks.map((block, index) => (
            <EditorBlock key={block.id} block={block} index={index} updateBlock={updateBlock} removeBlock={removeBlock} addBlock={addBlock} handleBlockImageChange={handleBlockImageChange} />
          ))}
        </div>

        {/* KEYWORDS */}
        <div className='mt-8 pt-8 border-t border-gray-800'>
          <label className='flex items-center gap-2 text-sm font-semibold text-cyan mb-3'>
            <Tag size={16} /> Keywords / Topik Artikel
          </label>
          <div className='flex flex-wrap gap-2 mb-3'>
            {keywords.map((kw) => (
              <span key={kw} className='flex items-center gap-1 bg-charcoal border border-gray-700 px-3 py-1 rounded-full text-sm text-ink'>
                #{kw}
                <button type='button' onClick={() => setKeywords(keywords.filter((k) => k !== kw))} className='text-gray-500 hover:text-hoax ml-1'>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type='text'
            placeholder='Ketik keyword lalu tekan Enter atau Koma...'
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            className='w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-2 text-ink text-sm outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition'
          />
        </div>
      </main>
    </div>
  );
};

export default WriteArticlePage;
