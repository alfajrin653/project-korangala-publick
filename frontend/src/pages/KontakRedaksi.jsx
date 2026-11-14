import React from 'react';
import { MapPin, Mail, Phone, ShieldAlert, Send } from 'lucide-react';

export default function KontakRedaksi() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-10 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8 max-w-5xl'>
        {/* Header */}
        <div className='mb-12 border-b border-white/10 pb-6'>
          <h1 className='text-3xl md:text-4xl font-heading font-black text-white mb-3'>
            Hubungi <span className='text-cyan'>Redaksi</span>
          </h1>
          <p className='text-ink-muted max-w-2xl text-sm leading-relaxed'>Punya informasi penting, hak jawab, atau ingin menjalin kemitraan strategis dengan Koran Gala 5.0? Tim kami siap merespons laporan dan pesan Anda 24/7.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Kolom Kiri: Informasi Kontak */}
          <div className='space-y-8'>
            <div className='flex gap-4 items-start'>
              <div className='w-12 h-12 bg-charcoal rounded-lg border border-white/5 flex items-center justify-center shrink-0'>
                <MapPin className='text-emerald' size={24} />
              </div>
              <div>
                <h3 className='font-bold text-white mb-1'>Kantor Pusat (Newsroom)</h3>
                <p className='text-sm text-ink-muted leading-relaxed'>
                  Gedung Koran Gala Lt. 3<br />
                  Kawasan Jurnalisme Jawa Barat
                  <br />
                  Bandung, Indonesia 40111
                </p>
              </div>
            </div>

            <div className='flex gap-4 items-start'>
              <div className='w-12 h-12 bg-charcoal rounded-lg border border-white/5 flex items-center justify-center shrink-0'>
                <Mail className='text-cyan' size={24} />
              </div>
              <div>
                <h3 className='font-bold text-white mb-1'>Surat Elektronik</h3>
                <p className='text-sm text-ink-muted'>redaksi@korangala.co.id (Rilis & Umum)</p>
                <p className='text-sm text-ink-muted'>bisnis@korangala.co.id (Kemitraan)</p>
              </div>
            </div>

            <div className='flex gap-4 items-start'>
              <div className='w-12 h-12 bg-hoax/10 rounded-lg border border-hoax/20 flex items-center justify-center shrink-0'>
                <ShieldAlert className='text-hoax' size={24} />
              </div>
              <div>
                <h3 className='font-bold text-white mb-1'>Kanal Pelaporan Rahasia (Whistleblower)</h3>
                <p className='text-sm text-ink-muted mb-2'>Jalur aman terenkripsi PGP untuk membocorkan dokumen atau investigasi korupsi.</p>
                <span className='text-xs font-mono bg-white/5 px-2 py-1 rounded text-ink'>kunci publik: 0x8F92A...</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Dummy */}
          <div className='bg-charcoal border border-white/5 rounded-xl p-6 relative overflow-hidden group'>
            <h3 className='font-heading font-bold text-lg mb-4'>Kirim Pesan Cepat</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-ink-muted mb-1 uppercase tracking-wider'>Nama / Instansi</label>
                <input type='text' placeholder='Masukkan nama Anda...' className='w-full bg-obsidian border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan/50' disabled />
              </div>
              <div>
                <label className='block text-xs font-bold text-ink-muted mb-1 uppercase tracking-wider'>Tujuan Departemen</label>
                <select className='w-full bg-obsidian border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan/50 text-ink-muted' disabled>
                  <option>Pilih Departemen...</option>
                  <option>Hak Jawab / Koreksi Berita</option>
                  <option>Kemitraan B2B / Iklan</option>
                  <option>Laporan Investigasi Warga</option>
                </select>
              </div>
              <div>
                <label className='block text-xs font-bold text-ink-muted mb-1 uppercase tracking-wider'>Pesan</label>
                <textarea rows='4' placeholder='Ketik pesan Anda di sini...' className='w-full bg-obsidian border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan/50 resize-none' disabled></textarea>
              </div>
              <button className='w-full bg-cyan text-obsidian font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed'>
                <Send size={16} /> Kirim Pesan Terenkripsi
              </button>
            </div>

            {/* Label Prototype di atas Form */}
            <div className='absolute inset-0 bg-obsidian/60 backdrop-blur-[2px] flex items-center justify-center z-10'>
              <span className='bg-amber-500 text-obsidian text-xs font-bold px-4 py-2 rounded-full shadow-lg'>Form Sedang Dalam Pemeliharaan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
