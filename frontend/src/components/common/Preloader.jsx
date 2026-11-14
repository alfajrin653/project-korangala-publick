import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    // 1. Jalankan animasi garis progres seketika saat komponen dirender
    const progressTimer = setTimeout(() => setProgress(true), 100);

    // 2. Tahan layar selama 1.8 detik, lalu mulai animasi "Tirai Terbuka"
    const exitTimer = setTimeout(() => setIsExiting(true), 1800);

    // 3. Hapus komponen dari DOM agar tidak membebani memori (setelah animasi selesai)
    const unmountTimer = setTimeout(() => setLoading(false), 2800);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`fixed inset-0 z-[99999] bg-obsidian flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}>
      {/* Efek Parallax: Teks akan turun sedikit saat background naik ke atas */}
      <div className={`flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? 'translate-y-24 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
        <h1 className='font-heading font-black text-4xl md:text-5xl text-white tracking-tighter flex items-center gap-2'>
          KORAN GALA <span className='text-cyan'>5.0</span>
        </h1>
        <p className='text-ink-muted text-xs md:text-sm mt-3 font-mono tracking-widest uppercase'>Sovereign Data Engine</p>

        {/* Garis Loading Minimalis ala Eropa */}
        <div className='w-48 h-[2px] bg-white/10 mt-8 overflow-hidden rounded-full'>
          <div className={`h-full bg-cyan transition-all duration-[1500ms] ease-out ${progress ? 'w-full' : 'w-0'}`}></div>
        </div>
      </div>
    </div>
  );
}
