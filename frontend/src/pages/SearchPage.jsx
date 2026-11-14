import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Calendar, Loader2 } from 'lucide-react';
import { articlesApi } from '../api/endpoints';

const SearchPage = () => {
  // Mengambil kata kunci dari URL (misal: /cari?q=pemuda)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    } else {
      setArticles([]);
      setLoading(false);
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await articlesApi.search(query);
      setArticles(res.data.data || res.data || []);
    } catch (error) {
      console.error('Gagal menarik data pencarian', error);
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL = 'http://localhost:4000/';

  return (
    <div className='min-h-screen bg-obsidian text-ink py-8 font-body'>
      <div className='max-w-6xl mx-auto px-4 md:px-8'>
        {/* HEADER PENCARIAN */}
        <div className='mb-8 border-b border-gray-800 pb-6'>
          <h1 className='text-3xl font-bold font-heading mb-2'>Hasil Pencarian</h1>
          <p className='text-ink-muted'>
            Menampilkan hasil untuk kata kunci: <span className='text-cyan font-semibold text-lg'>"{query}"</span>
          </p>
        </div>

        {/* AREA KONTEN */}
        {loading ? (
          <div className='flex justify-center py-20 text-cyan'>
            <Loader2 className='animate-spin' size={48} />
          </div>
        ) : articles.length === 0 ? (
          <div className='text-center py-20 bg-charcoal rounded-xl border border-gray-800'>
            <Search size={64} className='mx-auto text-gray-700 mb-4' />
            <h3 className='text-xl font-bold mb-2'>Tidak ada artikel ditemukan</h3>
            <p className='text-ink-muted'>Coba gunakan kata kunci lain yang lebih umum atau periksa ejaan Anda.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {articles.map((article) => (
              <Link to={`/${article.slug}`} key={article.id} className='bg-charcoal border border-gray-800 rounded-xl overflow-hidden hover:border-cyan transition-colors group flex flex-col'>
                {/* FOTO SAMPUL */}
                {article.cover_image && (
                  <div className='w-full h-48 overflow-hidden bg-obsidian'>
                    <img src={article.cover_image.startsWith('http') ? article.cover_image : `${BASE_URL}${article.cover_image}`} alt={article.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                  </div>
                )}

                {/* KONTEN KARTU */}
                <div className='p-5 flex flex-col flex-1'>
                  <span className='text-xs font-bold text-cyan mb-2 uppercase tracking-wider'>{article.category?.name || 'Koran Gala'}</span>
                  <h2 className='text-lg font-bold font-heading mb-3 line-clamp-2 group-hover:text-cyan transition-colors'>{article.title}</h2>

                  {/* Tampilkan excerpt, jika kosong ambil sebagian dari content */}
                  <p className='text-sm text-ink-muted line-clamp-3 mb-4 flex-1'>{article.excerpt || 'Klik untuk membaca selengkapnya mengenai artikel ini...'}</p>

                  <div className='flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-gray-800 mt-auto'>
                    <span className='font-semibold text-emerald'>{article.author?.name}</span>
                    <span className='flex items-center gap-1'>
                      <Calendar size={12} />
                      {new Date(article.published_at || article.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
