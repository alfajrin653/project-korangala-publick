import React from 'react';
import { Lock, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureLock({ children, isLocked = false, isOngoing = false, title = 'Fitur Premium', description = 'Tingkatkan paket langganan Anda untuk mengakses fitur ini.' }) {
  if (!isLocked && !isOngoing) {
    return <>{children}</>;
  }

  return (
    <div className='relative overflow-hidden rounded-xl border border-white/5 group'>
      {/* Konten Asli yang Di-Blur */}
      <div className='filter blur-md opacity-40 pointer-events-none select-none transition-all duration-300'>{children}</div>

      {/* Overlay Glassmorphism */}
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-obsidian/30 backdrop-blur-sm p-6 text-center'>
        {isOngoing ? (
          <>
            <div className='bg-cyan/20 p-3 rounded-full mb-4 animate-pulse'>
              <Construction className='text-cyan w-8 h-8' />
            </div>
            <h3 className='text-xl font-heading font-bold text-ink mb-2'>Sedang Dirakit</h3>
            <p className='text-sm text-ink-muted max-w-sm'>Tim kami sedang mengembangkan fitur ini. Pantau terus pembaruannya!</p>
          </>
        ) : (
          <>
            <div className='bg-emerald/20 p-3 rounded-full mb-4'>
              <Lock className='text-emerald w-8 h-8' />
            </div>
            <h3 className='text-xl font-heading font-bold text-ink mb-2'>{title}</h3>
            <p className='text-sm text-ink-muted mb-6 max-w-sm'>{description}</p>
            <Link to='/langganan' className='bg-gradient-to-r from-cyan to-emerald text-obsidian font-bold px-8 py-2.5 rounded-full text-sm hover:scale-105 transition-transform'>
              Upgrade Sekarang
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
