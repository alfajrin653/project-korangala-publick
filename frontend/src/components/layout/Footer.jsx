import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='border-t border-white/5 mt-16 bg-charcoal relative z-50'>
      <div className='kg-container py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm'>
        {/* Kolom 1: Branding */}
        <div className='col-span-2 md:col-span-1'>
          <span className='font-heading font-bold text-lg'>
            KORAN GALA <span className='text-cyan'>5.0</span>
          </span>
          <p className='text-ink-muted mt-2 text-xs leading-relaxed'>Intelligence Terminal Jawa Barat — Data, Kebijakan, dan Jurnalisme Warga.</p>
        </div>

        {/* Kolom 2: Kanal */}
        <div>
          <h4 className='font-semibold text-ink-muted mb-3 text-xs uppercase tracking-wider'>Kanal</h4>
          <ul className='space-y-2 text-ink-muted'>
            <li>
              <Link to='/kategori/investigasi-apbd' className='hover:text-cyan transition-colors block py-0.5'>
                Investigasi APBD
              </Link>
            </li>
            <li>
              <Link to='/hiper-lokal' className='hover:text-cyan transition-colors block py-0.5'>
                Hiper-Lokal Jabar
              </Link>
            </li>
            <li>
              <Link to='/kategori/ekonomi-rwa' className='hover:text-cyan transition-colors block py-0.5'>
                Ekonomi & RWA
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Alat */}
        <div>
          <h4 className='font-semibold text-ink-muted mb-3 text-xs uppercase tracking-wider'>Alat</h4>
          <ul className='space-y-2 text-ink-muted'>
            <li>
              <Link to='/academic-corpus' className='hover:text-cyan transition-colors block py-0.5'>
                Academic AI Corpus
              </Link>
            </li>
            <li>
              <Link to='/Arsip-hoaks' className='hover:text-cyan transition-colors block py-0.5'>
                Arsip Hoaks
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Perusahaan (Sudah Diperbaiki) */}
        <div>
          <h4 className='font-semibold text-ink-muted mb-3 text-xs uppercase tracking-wider'>Perusahaan</h4>
          <ul className='space-y-2 text-ink-muted'>
            <li>
              <Link to='/tentang-kami' className='hover:text-cyan transition-colors block py-0.5'>
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link to='/corporate-terminal' className='hover:text-cyan transition-colors block py-0.5'>
                B2B/B2G Terminal
              </Link>
            </li>
            <li>
              <Link to='/kontak' className='hover:text-cyan transition-colors block py-0.5'>
                Kontak Redaksi
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t border-white/5 py-4 text-center text-xs text-ink-muted font-mono'>© {new Date().getFullYear()} Koran Gala 5.0. Seluruh hak cipta dilindungi.</div>
    </footer>
  );
}
