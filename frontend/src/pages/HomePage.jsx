// import { useEffect, useState } from 'react';
// import HeroArticle from '../components/home/HeroArticle';
// import HoaxRadarWidget from '../components/home/HoaxRadarWidget';
// import ArticleCard from '../components/common/ArticleCard';
// import { Loading, EmptyState, SectionTitle } from '../components/common/Feedback';
// import { articlesApi, regionsApi } from '../api/endpoints';

// export default function HomePage() {
//   const [hero, setHero] = useState(null);
//   const [articles, setArticles] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       articlesApi.hero(),
//       articlesApi.list({ limit: 6 }),
//       regionsApi.list({ type: 'kabupaten_kota' }),
//     ])
//       .then(([heroRes, listRes, regionRes]) => {
//         setHero(heroRes.data.data);
//         setArticles(listRes.data.data || []);
//         setRegions(regionRes.data.data || []);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loading label="Memuat feed berita utama..." />;

//   return (
//     <div className="kg-container py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Kolom Utama */}
//       <div className="lg:col-span-2 space-y-10">
//         <HeroArticle article={hero} />

//         <div>
//           <SectionTitle eyebrow="Terkini" title="Feed Berita Utama" />
//           {articles.length === 0 ? (
//             <EmptyState label="Belum ada artikel yang dipublikasikan." />
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               {articles.map((a) => (
//                 <ArticleCard key={a.id} article={a} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Sidebar */}
//       <aside className="space-y-6">
//         <HoaxRadarWidget />

//         <div className="kg-card p-4">
//           <h3 className="font-heading font-semibold text-sm mb-3">Hyper-Local District Selector</h3>
//           <ul className="space-y-2">
//             {regions.map((r) => (
//               <li key={r.id}>
//                 <a
//                   href={`/hiper-lokal?wilayah=${r.slug}`}
//                   className="flex items-center justify-between text-sm text-ink-muted hover:text-cyan py-1.5 border-b border-white/5"
//                 >
//                   {r.name} <span className="text-xs">→</span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="kg-card p-4">
//           <h3 className="font-heading font-semibold text-sm mb-2">Top Contributor</h3>
//           <p className="text-ink-muted text-xs">
//             Leaderboard kontributor warga dengan laporan terverifikasi terbanyak bulan ini.
//           </p>
//         </div>
//       </aside>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import HeroArticle from '../components/home/HeroArticle';
import HoaxRadarWidget from '../components/home/HoaxRadarWidget';
import ArticleCard from '../components/common/ArticleCard';
import { Loading, EmptyState, SectionTitle } from '../components/common/Feedback';
import { articlesApi, regionsApi } from '../api/endpoints';

export default function HomePage() {
  const [hero, setHero] = useState(null);
  const [articles, setArticles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    Promise.all([
      articlesApi.hero(),
      // TIP: Ubah limit jadi 8 atau 10 di API agar List Beritanya lebih panjang ke bawah
      articlesApi.list({ limit: 30 }),
      regionsApi.list({ type: 'kabupaten_kota' }),
    ])
      .then(([heroRes, listRes, regionRes]) => {
        setHero(heroRes.data.data);
        setArticles(listRes.data.data || []);
        setRegions(regionRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Memecah Artikel untuk Desain Yahoo (3 untuk Kotak, sisanya untuk List)
  const gridArticles = articles.slice(0, 9);
  const listArticles = articles.slice(9);

  if (loading) return <Loading label='Memuat feed berita utama...' />;

  return (
    <div className='kg-container py-8 grid grid-cols-1 lg:grid-cols-12 gap-8'>
      {/* ========================================= */}
      {/* KOLOM KIRI: MAIN FEED (Besar - 8 Kolom)   */}
      {/* ========================================= */}
      <div className='lg:col-span-8 space-y-10'>
        {/* 1. Komponen Hero Original Anda */}
        <HeroArticle article={hero} />

        {articles.length === 0 ? (
          <EmptyState label='Belum ada artikel yang dipublikasikan.' />
        ) : (
          <div>
            {/* 2. GRID KOTAK (Diubah jadi Carousel Horizontal) */}
            <SectionTitle eyebrow='Terkini' title='Feed Berita Utama' />
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onClickCapture={handleClickCapture}
              onDragStart={(e) => e.preventDefault()}
              className='flex overflow-x-auto gap-5 mb-8 pb-4 snap-x snap-proximity scroll-smooth select-none cursor-grab active:cursor-grabbing 
              [&::-webkit-scrollbar]:h-2 
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:bg-white/10 
              hover:[&::-webkit-scrollbar-thumb]:bg-white/30 
              [&::-webkit-scrollbar-thumb]:rounded-full'
            >
              {gridArticles.map((a) => (
                <div key={a.id} className='shrink-0 w-[85vw] sm:w-[320px] snap-start'>
                  <ArticleCard article={a} variant='default' />
                </div>
              ))}
            </div>

            {/* Garis Pembatas */}
            {listArticles.length > 0 && <div className='h-px w-full bg-white/10 my-8'></div>}

            {/* 3. LIST VERTIKAL (Mirip Yahoo News Feed) */}
            {listArticles.length > 0 && (
              <div>
                <h3 className='text-xl font-heading font-bold mb-6 flex items-center gap-2'>
                  <TrendingUp className='text-amber-500' /> Sedang Hangat
                </h3>
                <div className='space-y-3'>
                  {listArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} variant='list' />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* KOLOM KANAN: SIDEBAR (Kecil - 4 Kolom)    */}
      {/* ========================================= */}
      <aside className='lg:col-span-4 space-y-8 lg:pl-6 lg:border-l lg:border-white/5'>
        {/* Komponen Asli Anda */}
        <HoaxRadarWidget />

        {/* WIDGET TAMBAHAN: Yahoo Finance Style (Dummy) */}
        <div className='bg-charcoal rounded-xl border border-white/5 p-5'>
          <h3 className='text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2'>Jabar Market & Policy</h3>
          <div className='space-y-4 text-sm font-mono'>
            <div className='flex justify-between items-center'>
              <span className='text-ink'>Serapan APBD</span>
              <span className='text-emerald font-bold'>+12.4%</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-ink'>IHSG Regional</span>
              <span className='text-hoax font-bold'>-0.8%</span>
            </div>
          </div>
        </div>

        {/* WIDGET TAMBAHAN: Corporate CTA */}
        <div className='bg-gradient-to-br from-obsidian to-charcoal rounded-xl border border-emerald/20 p-6 relative overflow-hidden group'>
          <h3 className='text-lg font-heading font-bold text-emerald mb-2'>Corporate Terminal</h3>
          <p className='text-sm text-ink-muted mb-4'>Akses data analitik dan telemeteri publik.</p>
          <Link to='/corporate-terminal' className='inline-flex items-center gap-2 text-xs font-bold bg-emerald text-obsidian px-4 py-2 rounded-full hover:bg-emerald/90 transition-colors'>
            Coba Demo <ChevronRight size={14} />
          </Link>
        </div>

        {/* Region Selector Asli Anda */}
        <div className='kg-card p-5'>
          <h3 className='font-heading font-bold text-lg mb-4'>Hyper-Local Jabar</h3>
          <ul className='space-y-1'>
            {regions.map((r) => (
              <li key={r.id}>
                <a href={`/hiper-lokal?wilayah=${r.slug}`} className='flex items-center justify-between text-sm text-ink-muted hover:text-cyan py-2 border-b border-white/5 group'>
                  {r.name} <span className='text-xs group-hover:translate-x-1 transition-transform'>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
