import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingUp, Activity, ChevronRight, BarChart2 } from 'lucide-react';
import { articlesApi, categoriesApi } from '../api/endpoints';
import ArticleCard from '../components/common/ArticleCard';
import { Loading, EmptyState, SectionTitle } from '../components/common/Feedback';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // --- LOGIKA DRAG TO SCROLL (Sihir Jari untuk Mouse) ---
  // --- LOGIKA DRAG TO SCROLL (Sihir Jari untuk Mouse) ---
  const carouselRef = useRef(null);
  let isDown = useRef(false);
  let startX = useRef(0);
  let scrollLeft = useRef(0);
  let isDragging = useRef(false); // TAMBAHAN: Deteksi niat geser vs klik

  const handleMouseDown = (e) => {
    isDown.current = true;
    isDragging.current = false; // Reset saat pertama kali diklik
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };
  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    isDragging.current = true; // Tandai bahwa mouse sedang bergerak (menggeser)
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // TAMBAHAN: Cegah React masuk ke halaman berita kalau user cuma niat menggeser
  const handleClickCapture = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // LOGIKA API 100% AMAN & TIDAK DISENTUH
  useEffect(() => {
    setLoading(true);
    Promise.all([
      categoriesApi.list(),
      articlesApi.list({ category: slug, limit: 30 }), // Ditarik 12 agar pas untuk dibagi-bagi
    ])
      .then(([catRes, artRes]) => {
        const found = (catRes.data.data || []).find((c) => c.slug === slug);
        setCategory(found);
        setArticles(artRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading label='Memuat kanal...' />;

  // --- TEKNIK BELAH DATA (MENGADOPSI GAYA YAHOO FINANCE) ---
  const topGrid = articles.slice(0, 9); // SEBELUMNYA 3, SEKARANG AMBIL 9
  const featureArticle = articles[9]; // SEBELUMNYA index 3, SEKARANG 9
  const listArticles = articles.slice(10); // SEBELUMNYA index 4, SEKARANG 10

  return (
    <div className='min-h-screen bg-obsidian text-ink pt-6 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8'>
        {/* JUDUL KATEGORI */}
        <div className='mb-8 border-b border-white/10 pb-4'>
          <SectionTitle eyebrow='Kanal Berita' title={category?.name || 'Kategori'} />
          {category?.description && <p className='text-ink-muted -mt-2 max-w-2xl'>{category.description}</p>}
        </div>

        {articles.length === 0 ? (
          <EmptyState label='Belum ada artikel di kanal ini.' />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
            {/* ========================================= */}
            {/* KOLOM KIRI: MAIN FEED (Besar - 8 Kolom)   */}
            {/* ========================================= */}
            <div className='lg:col-span-8 space-y-8'>
              {/* 1. TOP GRID SECTION (Carousel Horizontal) */}
              {topGrid.length > 0 && (
                <div
                  ref={carouselRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onClickCapture={handleClickCapture}
                  onDragStart={(e) => e.preventDefault()}
                  className='flex overflow-x-auto gap-5 pb-6 snap-x snap-proximity scroll-smooth select-none cursor-grab active:cursor-grabbing 
                  [&::-webkit-scrollbar]:h-2 
                  [&::-webkit-scrollbar-track]:bg-transparent 
                  [&::-webkit-scrollbar-thumb]:bg-white/10 
                  hover:[&::-webkit-scrollbar-thumb]:bg-white/30 
                  [&::-webkit-scrollbar-thumb]:rounded-full'
                >
                  {topGrid.map((a) => (
                    <div key={a.id} className='shrink-0 w-[85vw] sm:w-[320px] snap-start'>
                      <ArticleCard article={a} variant='default' />
                    </div>
                  ))}
                </div>
              )}

              {/* Garis Pembatas */}
              {(featureArticle || listArticles.length > 0) && <div className='h-px w-full bg-white/10 my-2'></div>}

              {/* 2. FEATURE & LIST SECTION (Dibelah 2 kolom lagi di dalam) */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Sorotan Utama (Kiri Dalam) */}
                {featureArticle && (
                  <div className='flex flex-col'>
                    <h3 className='text-sm font-bold text-cyan mb-4 flex items-center gap-2 uppercase tracking-wider'>
                      <Activity size={16} /> Sorotan Kanal
                    </h3>
                    {/* Pakai variant default agar besar */}
                    <ArticleCard article={featureArticle} variant='default' />
                  </div>
                )}

                {/* List Vertikal (Kanan Dalam) */}
                {listArticles.length > 0 && (
                  <div className='flex flex-col'>
                    <h3 className='text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 uppercase tracking-wider'>
                      <TrendingUp size={16} /> Terkini Lainnya
                    </h3>
                    <div className='space-y-4'>
                      {listArticles.map((a) => (
                        // Pakai variant list agar jadi kecil menyamping
                        <ArticleCard key={a.id} article={a} variant='list' />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================= */}
            {/* KOLOM KANAN: SIDEBAR (Kecil - 4 Kolom)    */}
            {/* ========================================= */}
            <aside className='hidden lg:block lg:col-span-4 space-y-8 lg:pl-6 lg:border-l lg:border-white/5'>
              {/* Widget 1: Sentimen Data ala Finance */}
              <div className='bg-charcoal rounded-xl border border-white/5 p-5'>
                <h3 className='text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2'>
                  <BarChart2 size={16} className='text-emerald' /> Sentimen Isu {category?.name || 'Ini'}
                </h3>
                <div className='space-y-4 text-sm font-mono'>
                  <div className='flex justify-between items-center'>
                    <span className='text-ink'>Indeks Kepercayaan</span>
                    <span className='text-emerald font-bold'>Tinggi</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-ink'>Volume Diskusi Netizen</span>
                    <span className='text-cyan font-bold'>+24%</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-ink'>Potensi Hoaks</span>
                    <span className='text-hoax font-bold'>Rendah</span>
                  </div>
                </div>
              </div>

              {/* Widget 2: Promo B2B / B2G */}
              <div className='bg-gradient-to-br from-obsidian to-charcoal rounded-xl border border-emerald/20 p-6 relative overflow-hidden group'>
                <h3 className='text-lg font-heading font-bold text-emerald mb-2 relative z-10'>Sovereign Terminal</h3>
                <p className='text-sm text-ink-muted mb-6 relative z-10'>Punya kendali penuh atas isu publik di daerah Anda? Buka akses telemetri sekarang.</p>
                <Link to='/sovereign-terminal' className='inline-flex items-center gap-2 text-xs font-bold bg-emerald text-obsidian px-4 py-2 rounded-full hover:bg-emerald/90 transition-colors relative z-10'>
                  Pelajari <ChevronRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
