// import { Link } from 'react-router-dom';
// import { MapPin, Clock, Calendar, ShieldCheck } from 'lucide-react';

// export default function ArticleCard({ article }) {
//   if (!article) return null;
//   const { slug, title, excerpt, cover_image, category, region, author, read_time_minutes, is_investigative, published_at, createdAt } = article;

//   // Format Tanggal Real-time (Misal: 13 Agu 2026)
//   const dateToUse = published_at || createdAt;
//   const formattedDate = dateToUse
//     ? new Date(dateToUse).toLocaleDateString('id-ID', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//       })
//     : 'Baru saja';

//   const BASE_URL = 'http://localhost:4000/';
//   const imageUrl = cover_image ? (cover_image.startsWith('http') ? cover_image : `${BASE_URL}${cover_image}`) : null;

//   return (
//     <Link to={`/artikel/${slug}`} className='flex flex-col bg-charcoal rounded-xl border border-white/5 overflow-hidden hover:border-cyan/30 transition-colors group'>
//       {/* BAGIAN GAMBAR */}
//       <div className='aspect-[16/9] bg-obsidian relative overflow-hidden flex items-center justify-center'>
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={title}
//             className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
//             onError={(e) => {
//               e.target.style.display = 'none';
//             }}
//           />
//         ) : (
//           <span className='text-ink-muted text-xs font-mono tracking-widest'>KORAN GALA 5.0</span>
//         )}

//         {/* Label Investigasi (Opsional) */}
//         {is_investigative && <div className='absolute top-2 left-2 bg-hoax/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm'>Investigasi</div>}
//       </div>

//       {/* BAGIAN KONTEN BAWAH GAMBAR */}
//       <div className='p-4 flex flex-col flex-1'>
//         {/* Kategori & Lokasi */}
//         <div className='flex items-center gap-2 mb-3'>
//           {category && <span className='bg-cyan/10 text-cyan text-xs font-semibold px-2 py-1 rounded'>{category.name}</span>}
//           {region && (
//             <span className='flex items-center gap-1 bg-emerald/10 text-emerald border border-emerald/20 text-xs font-semibold px-2 py-1 rounded'>
//               <MapPin size={12} /> {region.name}
//             </span>
//           )}
//         </div>

//         {/* Judul Berita */}
//         <h3 className='text-ink font-heading font-bold text-lg leading-snug group-hover:text-cyan transition-colors line-clamp-2 mb-2'>{title}</h3>

//         {/* Deskripsi / Excerpt */}
//         {excerpt && <p className='text-ink-muted text-sm line-clamp-2 mb-4'>{excerpt}</p>}

//         {/* Footer (Tanggal, Waktu, Ikon Verified) */}
//         <div className='mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-ink-muted font-mono'>
//           <div className='flex items-center gap-3'>
//             <span className='flex items-center gap-1.5'>
//               <Calendar size={14} /> {formattedDate}
//             </span>
//             <span className='flex items-center gap-1.5'>
//               <Clock size={14} /> {read_time_minutes || 4} mnt
//             </span>
//           </div>

//           {/* Ikon Verified (Shield) di pojok kanan */}
//           <ShieldCheck size={16} className='text-cyan' title='Berita Terverifikasi' />
//         </div>
//       </div>
//     </Link>
//   );
// }

import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ShieldCheck } from 'lucide-react';

export default function ArticleCard({ article, variant = 'default' }) {
  if (!article) return null;
  const { slug, title, excerpt, cover_image, category, region, read_time_minutes, is_investigative, published_at, createdAt } = article;

  // Format Tanggal Real-time
  const dateToUse = published_at || createdAt;
  const formattedDate = dateToUse
    ? new Date(dateToUse).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Baru saja';

  const BASE_URL = 'http://localhost:4000/'; // Catatan: Nanti ganti pakai link Railway kalau sudah live ya!
  const imageUrl = cover_image ? (cover_image.startsWith('http') ? cover_image : `${BASE_URL}${cover_image}`) : null;

  // ==========================================
  // TAMPILAN 1: BENTUK LIST VERTIKAL (Gambar Kiri, Teks Kanan)
  // ==========================================
  if (variant === 'list') {
    return (
      <Link to={`/artikel/${slug}`} className='group flex flex-row items-center gap-4 hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors'>
        <div className='w-24 h-24 md:w-32 md:h-32 shrink-0 bg-obsidian rounded-lg relative overflow-hidden'>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
          ) : (
            <div className='w-full h-full bg-charcoal flex items-center justify-center text-[8px] text-ink-muted font-mono'>KG 5.0</div>
          )}
        </div>
        <div className='flex-1 flex flex-col justify-center py-1'>
          {category && <span className='text-[10px] text-emerald font-bold uppercase tracking-wider mb-1'>{category.name}</span>}
          <h4 className='text-sm md:text-base font-bold text-ink group-hover:text-cyan transition-colors leading-snug line-clamp-2 mb-2'>{title}</h4>
          <div className='flex items-center gap-3 text-[10px] md:text-xs text-ink-muted font-mono'>
            <span className='flex items-center gap-1'>
              <Calendar size={12} /> {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ==========================================
  // TAMPILAN 2: BENTUK KOTAK DEFAULT (Gambar Atas, Teks Bawah)
  // ==========================================
  return (
    <Link to={`/artikel/${slug}`} className='flex flex-col bg-charcoal rounded-xl border border-white/5 overflow-hidden hover:border-cyan/30 transition-colors group'>
      <div className='aspect-[16/9] bg-obsidian relative overflow-hidden flex items-center justify-center'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span className='text-ink-muted text-xs font-mono tracking-widest'>KORAN GALA 5.0</span>
        )}
        {is_investigative && <div className='absolute top-2 left-2 bg-hoax/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm'>Investigasi</div>}
      </div>

      <div className='p-4 flex flex-col flex-1'>
        <div className='flex items-center gap-2 mb-3'>
          {category && <span className='bg-cyan/10 text-cyan text-xs font-semibold px-2 py-1 rounded'>{category.name}</span>}
          {region && (
            <span className='flex items-center gap-1 bg-emerald/10 text-emerald border border-emerald/20 text-xs font-semibold px-2 py-1 rounded'>
              <MapPin size={12} /> {region.name}
            </span>
          )}
        </div>
        <h3 className='text-ink font-heading font-bold text-lg leading-snug group-hover:text-cyan transition-colors line-clamp-2 mb-2'>{title}</h3>
        {excerpt && <p className='text-ink-muted text-sm line-clamp-2 mb-4'>{excerpt}</p>}

        <div className='mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-ink-muted font-mono'>
          <div className='flex items-center gap-3'>
            <span className='flex items-center gap-1.5'>
              <Calendar size={14} /> {formattedDate}
            </span>
            <span className='flex items-center gap-1.5'>
              <Clock size={14} /> {read_time_minutes || 4} mnt
            </span>
          </div>
          <ShieldCheck size={16} className='text-cyan' title='Berita Terverifikasi' />
        </div>
      </div>
    </Link>
  );
}
