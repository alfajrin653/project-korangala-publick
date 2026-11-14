// import React from 'react';
import FeatureLock from '../components/layout/FeatureLock'; // Sesuaikan path jika berbeda

// import { ShieldCheck, FileText, Lock, Search, Edit3, Activity, Globe, AlertTriangle, Users, TrendingUp, MapPin } from 'lucide-react';

// 1. HALAMAN UNTUK WALI KOTA & KADIS (B2G)
export function SovereignTerminal() {
  return (
    <div className='min-h-screen bg-obsidian text-white pt-24 px-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-heading font-bold text-emerald mb-8 flex items-center gap-3'>
          <ShieldCheck size={32} /> Sovereign Command Center
        </h1>
        <FeatureLock isOngoing={true} title='Telemetri APBD & Radar Hoaks' description='Sistem sedang mengkalibrasi integrasi data dengan server Pemda. Dashboard analitik sentimen publik real-time akan segera aktif.'>
          {/* Gambar/Elemen Dummy di-blur */}
          <div className='h-96 bg-charcoal rounded-xl border border-white/10 p-6 flex items-center justify-center'>
            <img src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80' alt='Dashboard' className='opacity-50 w-full h-full object-cover rounded' />
          </div>
        </FeatureLock>
      </div>
    </div>
  );
}

// 2. HALAMAN UNTUK REKTOR ITB/UNPAD (ACADEMIC)
// export function AcademicCorpus() {
//   return (
//     <div className='min-h-screen bg-obsidian text-white pt-24 px-8'>
//       <div className='max-w-5xl mx-auto'>
//         <h1 className='text-3xl font-heading font-bold text-cyan mb-8 flex items-center gap-3'>
//           <FileText size={32} /> Academic & AI Corpus
//         </h1>
//         <FeatureLock isOngoing={true}>
//           <div className='h-96 bg-charcoal rounded-xl border border-white/10 p-6'>
//             <div className='w-full h-12 bg-white/5 rounded animate-pulse mb-4'></div>
//             <div className='w-3/4 h-8 bg-white/5 rounded animate-pulse mb-10'></div>
//             <div className='grid grid-cols-3 gap-6'>
//               <div className='h-40 bg-white/5 rounded animate-pulse'></div>
//               <div className='h-40 bg-white/5 rounded animate-pulse'></div>
//               <div className='h-40 bg-white/5 rounded animate-pulse'></div>
//             </div>
//           </div>
//         </FeatureLock>
//       </div>
//     </div>
//   );
// }

// 3. HALAMAN UNTUK DIREKTUR / HIPMI (B2B CORPORATE)
// GANTI FUNGSI CorporateTerminal DENGAN KODE INI:
// export function CorporateTerminal() {
//   return (
//     <div className='min-h-screen bg-obsidian text-ink font-sans pt-6 pb-20'>
//       <div className='kg-container mx-auto px-4 md:px-8 max-w-7xl'>
//         {/* HEADER TERMINAL */}
//         <div className='flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8'>
//           <div>
//             <div className='flex items-center gap-3 mb-2'>
//               <span className='bg-emerald/20 text-emerald text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald/30 animate-pulse'>Live Demo Mode</span>
//               <span className='text-xs text-ink-muted font-mono'>B2B/B2G Data Engine v1.0</span>
//             </div>
//             <h1 className='text-3xl font-heading font-black text-emerald flex items-center gap-3 tracking-tight'>
//               <Activity size={36} /> SOVEREIGN COMMAND CENTER
//             </h1>
//             <p className='text-ink-muted mt-2 max-w-2xl'>Panel analitik telemetri sentimen publik dan mitigasi krisis real-time untuk wilayah Jawa Barat.</p>
//           </div>
//           <div className='mt-4 md:mt-0 text-right'>
//             <p className='text-xs text-ink-muted uppercase tracking-wider mb-1'>Status Server</p>
//             <div className='flex items-center gap-2 justify-end text-emerald font-bold font-mono'>
//               <div className='w-2 h-2 rounded-full bg-emerald animate-ping'></div>
//               ONLINE & SECURE
//             </div>
//           </div>
//         </div>

//         {/* TOP METRICS (4 KOTAK STATISTIK) */}
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
//           {/* Card 1 */}
//           <div className='bg-charcoal border border-white/5 rounded-xl p-6 relative overflow-hidden group'>
//             <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
//               <Globe size={64} />
//             </div>
//             <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Total Liputan Jabar</p>
//             <h3 className='text-3xl font-heading font-black text-white mb-2'>152,490</h3>
//             <p className='text-xs text-emerald flex items-center gap-1 font-mono'>
//               <TrendingUp size={12} /> +12.5% dari bulan lalu
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className='bg-charcoal border border-white/5 rounded-xl p-6 relative overflow-hidden group'>
//             <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
//               <AlertTriangle size={64} />
//             </div>
//             <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Ancaman Hoaks Aktif</p>
//             <h3 className='text-3xl font-heading font-black text-hoax mb-2'>
//               24 <span className='text-lg text-ink-muted font-normal'>kasus</span>
//             </h3>
//             <p className='text-xs text-hoax flex items-center gap-1 font-mono'>
//               <Activity size={12} /> Butuh mitigasi segera
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className='bg-charcoal border border-emerald/20 rounded-xl p-6 relative overflow-hidden group bg-gradient-to-br from-emerald/10 to-transparent'>
//             <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
//               <Activity size={64} />
//             </div>
//             <p className='text-xs text-emerald uppercase tracking-wider font-bold mb-1'>Indeks Sentimen Warga</p>
//             <h3 className='text-3xl font-heading font-black text-emerald mb-2'>
//               78.5<span className='text-lg font-normal'>%</span>
//             </h3>
//             <p className='text-xs text-ink-muted font-mono'>Sentimen positif mendominasi</p>
//           </div>

//           {/* Card 4 */}
//           <div className='bg-charcoal border border-white/5 rounded-xl p-6 relative overflow-hidden group'>
//             <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
//               <Users size={64} />
//             </div>
//             <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Kontributor Citizen</p>
//             <h3 className='text-3xl font-heading font-black text-white mb-2'>8,942</h3>
//             <p className='text-xs text-cyan flex items-center gap-1 font-mono'>
//               <TrendingUp size={12} /> +420 verifikasi NIK baru
//             </p>
//           </div>
//         </div>

//         {/* MIDDLE SECTION: CHARTS & RADAR */}
//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
//           {/* FAKE BAR CHART (Tren Isu Daerah) */}
//           <div className='lg:col-span-2 bg-charcoal border border-white/5 rounded-xl p-6'>
//             <div className='flex justify-between items-center mb-6'>
//               <h3 className='text-lg font-heading font-bold flex items-center gap-2'>
//                 <TrendingUp size={18} className='text-cyan' /> Tren Isu Kebijakan Publik (Top 5)
//               </h3>
//               <select className='bg-obsidian border border-white/10 text-xs px-3 py-1 rounded text-ink-muted outline-none'>
//                 <option>7 Hari Terakhir</option>
//                 <option>Bulan Ini</option>
//               </select>
//             </div>

//             <div className='space-y-5'>
//               {/* Bar 1 */}
//               <div>
//                 <div className='flex justify-between text-sm mb-1'>
//                   <span className='font-bold text-ink'>Infrastruktur & Jalan Rusak</span>
//                   <span className='font-mono text-cyan text-xs'>85% Volume</span>
//                 </div>
//                 <div className='w-full bg-obsidian rounded-full h-3 overflow-hidden'>
//                   <div className='bg-cyan h-3 rounded-full' style={{ width: '85%' }}></div>
//                 </div>
//               </div>
//               {/* Bar 2 */}
//               <div>
//                 <div className='flex justify-between text-sm mb-1'>
//                   <span className='font-bold text-ink'>Zonasi Pendidikan (PPDB)</span>
//                   <span className='font-mono text-amber-500 text-xs'>68% Volume</span>
//                 </div>
//                 <div className='w-full bg-obsidian rounded-full h-3 overflow-hidden'>
//                   <div className='bg-amber-500 h-3 rounded-full' style={{ width: '68%' }}></div>
//                 </div>
//               </div>
//               {/* Bar 3 */}
//               <div>
//                 <div className='flex justify-between text-sm mb-1'>
//                   <span className='font-bold text-ink'>Stabilitas Harga Pangan</span>
//                   <span className='font-mono text-emerald text-xs'>42% Volume</span>
//                 </div>
//                 <div className='w-full bg-obsidian rounded-full h-3 overflow-hidden'>
//                   <div className='bg-emerald h-3 rounded-full' style={{ width: '42%' }}></div>
//                 </div>
//               </div>
//               {/* Bar 4 */}
//               <div>
//                 <div className='flex justify-between text-sm mb-1'>
//                   <span className='font-bold text-ink'>Keamanan / Begal</span>
//                   <span className='font-mono text-hoax text-xs'>30% Volume</span>
//                 </div>
//                 <div className='w-full bg-obsidian rounded-full h-3 overflow-hidden'>
//                   <div className='bg-hoax h-3 rounded-full' style={{ width: '30%' }}></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* LIVE RADAR HOAKS (Feed Vertikal) */}
//           <div className='bg-charcoal border border-hoax/20 rounded-xl p-6 relative overflow-hidden'>
//             <div className='absolute top-0 right-0 p-4 opacity-5'>
//               <ShieldCheck size={120} className='text-hoax' />
//             </div>
//             <h3 className='text-lg font-heading font-bold text-hoax mb-6 flex items-center gap-2 relative z-10'>
//               <AlertTriangle size={18} /> Radar Hoaks Terkini
//             </h3>

//             <div className='space-y-4 relative z-10'>
//               <div className='border-l-2 border-hoax pl-3'>
//                 <p className='text-xs text-hoax font-mono font-bold'>KOTA BANDUNG • 10 Mnt lalu</p>
//                 <p className='text-sm font-bold text-ink mt-1'>Isu penculikan anak di SD Antapani</p>
//                 <span className='inline-block mt-2 bg-hoax/20 text-hoax text-[10px] px-2 py-0.5 rounded font-bold'>FALSE POSITIVE</span>
//               </div>
//               <div className='border-l-2 border-amber-500 pl-3'>
//                 <p className='text-xs text-amber-500 font-mono font-bold'>KAB. BOGOR • 45 Mnt lalu</p>
//                 <p className='text-sm font-bold text-ink mt-1'>Video banjir bandang Puncak (Video Lama)</p>
//                 <span className='inline-block mt-2 bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded font-bold'>DALAM VERIFIKASI</span>
//               </div>
//               <div className='border-l-2 border-emerald pl-3'>
//                 <p className='text-xs text-emerald font-mono font-bold'>KOTA DEPOK • 2 Jam lalu</p>
//                 <p className='text-sm font-bold text-ink mt-1'>Surat edaran pemadaman listrik total</p>
//                 <span className='inline-block mt-2 bg-emerald/20 text-emerald text-[10px] px-2 py-0.5 rounded font-bold'>TERBANTAHKAN</span>
//               </div>
//             </div>

//             <button className='w-full mt-6 border border-white/10 text-ink-muted text-xs font-bold py-2 rounded hover:bg-white/5 transition-colors'>Lihat Log Lengkap</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { ShieldCheck, FileText, Lock, Search, Edit3, Activity, AlertTriangle, BookOpen, Map, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// ==========================================
// KOMPONEN DISCLAIMER (Dipakai di semua halaman VVIP)
// ==========================================
const PrototypeDisclaimer = () => (
  <div className='mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden group'>
    <div className='absolute top-0 right-0 p-2 opacity-10'>
      <AlertTriangle size={64} />
    </div>
    <AlertTriangle className='text-amber-500 shrink-0 mt-0.5' size={20} />
    <div className='relative z-10'>
      <h4 className='text-sm font-bold text-amber-500 uppercase tracking-widest'>Prototype Preview (Coming Soon)</h4>
      <p className='text-xs text-amber-500/80 mt-1 max-w-3xl leading-relaxed'>
        Antarmuka dan data yang ditampilkan pada halaman ini adalah <strong>simulasi (mockup)</strong> untuk keperluan demonstrasi fitur 5-Tier Membership. Fitur penuh sedang dalam tahap perakitan dan sinkronisasi database, dan akan segera
        diluncurkan pada pembaruan berikutnya.
      </p>
    </div>
  </div>
);

// ==========================================
// 1. INVESTIGASI APBD
// ==========================================
export function InvestigasiAPBD() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-6 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8 max-w-6xl'>
        <h1 className='text-3xl font-heading font-black text-amber-500 mb-2 flex items-center gap-3'>
          <Search size={32} /> Investigasi APBD & Proyek Daerah
        </h1>
        <p className='text-ink-muted text-sm mb-8'>Pemantauan crowdsourcing alokasi dana dan proyek fisik di Jawa Barat.</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='bg-charcoal border border-white/5 p-5 rounded-xl'>
            <p className='text-xs text-ink-muted uppercase tracking-wider'>Total Anggaran Dipantau</p>
            <h3 className='text-2xl font-bold text-white mt-1'>Rp 4.2 Triliun</h3>
          </div>
          <div className='bg-charcoal border border-white/5 p-5 rounded-xl'>
            <p className='text-xs text-ink-muted uppercase tracking-wider'>Proyek Bendera Merah (Red Flag)</p>
            <h3 className='text-2xl font-bold text-hoax mt-1'>12 Proyek</h3>
          </div>
          <div className='bg-charcoal border border-white/5 p-5 rounded-xl'>
            <p className='text-xs text-ink-muted uppercase tracking-wider'>Laporan Warga Terverifikasi</p>
            <h3 className='text-2xl font-bold text-cyan mt-1'>1,402 Laporan</h3>
          </div>
        </div>

        <div className='bg-charcoal border border-white/5 rounded-xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-white/10 bg-obsidian/30 flex justify-between items-center'>
            <h3 className='font-bold text-sm'>Daftar Proyek Fisik Dalam Pantauan</h3>
            <button className='text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors'>Unduh Data (CSV)</button>
          </div>
          <div className='p-6 space-y-4'>
            {/* Dummy Row 1 */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/5 rounded-lg border-l-4 border-hoax'>
              <div>
                <h4 className='font-bold text-sm text-ink'>Perbaikan Jalan Poros Selatan Kab. Garut</h4>
                <p className='text-xs text-ink-muted mt-1 font-mono'>Nilai Pagu: Rp 12.500.000.000 • Pemenang: PT Lintas Karya</p>
              </div>
              <div className='mt-2 md:mt-0 flex gap-2'>
                <span className='bg-hoax/20 text-hoax text-[10px] px-2 py-1 rounded font-bold'>MANGKRAK 3 BULAN</span>
              </div>
            </div>
            {/* Dummy Row 2 */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/5 rounded-lg border-l-4 border-amber-500'>
              <div>
                <h4 className='font-bold text-sm text-ink'>Pengadaan Alkes RSUD Cibabat</h4>
                <p className='text-xs text-ink-muted mt-1 font-mono'>Nilai Pagu: Rp 8.200.000.000 • Laporan Warga: Harga tidak wajar</p>
              </div>
              <div className='mt-2 md:mt-0 flex gap-2'>
                <span className='bg-amber-500/20 text-amber-500 text-[10px] px-2 py-1 rounded font-bold'>DALAM AUDIT REDAKSI</span>
              </div>
            </div>
          </div>
        </div>

        <PrototypeDisclaimer />
      </div>
    </div>
  );
}

// ==========================================
// 2. ACADEMIC & AI CORPUS
// ==========================================
export function AcademicCorpus() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-6 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8 max-w-6xl'>
        <h1 className='text-3xl font-heading font-black text-cyan mb-2 flex items-center gap-3'>
          <BookOpen size={32} /> Academic AI Corpus
        </h1>
        <p className='text-ink-muted text-sm mb-8'>Pencarian cerdas ke dalam 150.000+ arsip historis dan regulasi Jawa Barat untuk peneliti dan kampus.</p>

        <div className='bg-charcoal border border-cyan/20 rounded-xl p-8 mb-6 relative overflow-hidden'>
          <div className='relative z-10 max-w-3xl mx-auto text-center'>
            <div className='flex items-center bg-obsidian border border-white/10 rounded-full px-6 py-4 focus-within:border-cyan transition-colors mb-4'>
              <Search size={20} className='text-ink-muted shrink-0' />
              <input type='text' placeholder='Masukkan kata kunci riset, nomor Perda, atau nama tokoh...' className='bg-transparent outline-none text-sm ml-4 w-full placeholder:text-ink-muted' disabled />
              <button className='bg-cyan text-obsidian text-xs font-bold px-4 py-2 rounded-full cursor-not-allowed opacity-50'>Cari Arsip</button>
            </div>
            <p className='text-xs text-ink-muted font-mono'>Contoh: "Sejarah pemekaran Kota Banjar 2003", "Perda RTRW Kota Bandung 2011"</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white/5 p-6 rounded-xl border border-white/5'>
            <h4 className='font-bold text-sm text-cyan mb-4 flex items-center gap-2'>
              <FileText size={16} /> Arsip Digital Tersedia
            </h4>
            <ul className='space-y-3 text-xs font-mono text-ink-muted'>
              <li className='flex justify-between border-b border-white/5 pb-2'>
                <span>Koran Gala Cetak (1989 - 2015)</span> <span className='text-ink'>112,400 hal</span>
              </li>
              <li className='flex justify-between border-b border-white/5 pb-2'>
                <span>Dokumen Perda & Perwal se-Jabar</span> <span className='text-ink'>8,450 doc</span>
              </li>
              <li className='flex justify-between border-b border-white/5 pb-2'>
                <span>Laporan APBD & BPS Daerah</span> <span className='text-ink'>4,200 doc</span>
              </li>
            </ul>
          </div>
          <div className='bg-white/5 p-6 rounded-xl border border-white/5'>
            <h4 className='font-bold text-sm text-cyan mb-4 flex items-center gap-2'>
              <Edit3 size={16} /> Fitur Khusus Peneliti
            </h4>
            <div className='space-y-3'>
              <div className='bg-obsidian/50 p-3 rounded border border-white/5'>
                <p className='text-sm font-bold'>Auto-Citation Generator</p>
                <p className='text-xs text-ink-muted mt-1'>Otomatis membuat kutipan format APA, Harvard, atau IEEE dari artikel/arsip yang Anda pilih.</p>
              </div>
              <div className='bg-obsidian/50 p-3 rounded border border-white/5'>
                <p className='text-sm font-bold'>Data JSON & CSV Export</p>
                <p className='text-xs text-ink-muted mt-1'>Unduh data tabuler sejarah harga bahan pokok Jawa Barat ke dalam format raw data.</p>
              </div>
            </div>
          </div>
        </div>

        <PrototypeDisclaimer />
      </div>
    </div>
  );
}

// ==========================================
// 3. RADAR HOAKS (Arsip Hoaks)
// ==========================================
export function RadarHoaks() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-6 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8 max-w-6xl'>
        <h1 className='text-3xl font-heading font-black text-hoax mb-2 flex items-center gap-3'>
          <ShieldCheck size={32} /> Radar Anti-Hoaks Jabar
        </h1>
        <p className='text-ink-muted text-sm mb-8'>Pusat verifikasi fakta dan klarifikasi isu liar yang beredar di masyarakat dan media sosial.</p>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          {/* Main Feed */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Item 1 */}
            <div className='bg-charcoal border border-white/5 p-5 rounded-xl flex gap-4 items-start'>
              <div className='w-16 h-16 bg-hoax/10 rounded-lg flex items-center justify-center shrink-0 border border-hoax/20'>
                <XCircle size={28} className='text-hoax' />
              </div>
              <div>
                <span className='text-[10px] bg-hoax/20 text-hoax font-bold px-2 py-0.5 rounded uppercase'>Hoaks / Disinformasi</span>
                <h3 className='font-bold text-sm md:text-base mt-2'>Beredar Pesan Berantai Penculikan Anak Pakai Mobil Merah di Arcamanik</h3>
                <p className='text-xs text-ink-muted mt-2'>Faktanya: Kapolrestabes Bandung mengonfirmasi bahwa foto yang beredar adalah kejadian di luar pulau Jawa pada tahun 2019.</p>
                <p className='text-[10px] text-ink-muted mt-3 font-mono'>Diverifikasi oleh AI Fact-Checker • 2 Jam Lalu</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className='bg-charcoal border border-white/5 p-5 rounded-xl flex gap-4 items-start'>
              <div className='w-16 h-16 bg-emerald/10 rounded-lg flex items-center justify-center shrink-0 border border-emerald/20'>
                <CheckCircle2 size={28} className='text-emerald' />
              </div>
              <div>
                <span className='text-[10px] bg-emerald/20 text-emerald font-bold px-2 py-0.5 rounded uppercase'>Fakta / Benar</span>
                <h3 className='font-bold text-sm md:text-base mt-2'>Penutupan Jalan Asia Afrika Saat Perayaan Konferensi Asia Afrika 2026</h3>
                <p className='text-xs text-ink-muted mt-2'>Faktanya: Dinas Perhubungan Kota Bandung resmi merilis surat edaran rekayasa lalu lintas mulai tanggal 18 April besok.</p>
                <p className='text-[10px] text-ink-muted mt-3 font-mono'>Sumber: Situs Resmi Dishub Kota Bandung • 5 Jam Lalu</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='bg-charcoal border border-white/5 rounded-xl p-5'>
            <h4 className='font-bold text-sm flex items-center gap-2 mb-4 border-b border-white/10 pb-2'>
              <Map size={16} /> Pemetaan Hoaks Wilayah
            </h4>
            <div className='space-y-4 text-xs font-mono'>
              <div>
                <div className='flex justify-between mb-1'>
                  <span>Kota Bandung</span> <span className='text-hoax'>12 Isu Aktif</span>
                </div>
                <div className='w-full bg-obsidian rounded h-1.5'>
                  <div className='bg-hoax h-1.5 rounded' style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span>Kabupaten Bogor</span> <span className='text-hoax'>8 Isu Aktif</span>
                </div>
                <div className='w-full bg-obsidian rounded h-1.5'>
                  <div className='bg-hoax h-1.5 rounded' style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span>Kota Depok</span> <span className='text-amber-500'>4 Isu Aktif</span>
                </div>
                <div className='w-full bg-obsidian rounded h-1.5'>
                  <div className='bg-amber-500 h-1.5 rounded' style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            <button className='w-full mt-6 bg-white/5 hover:bg-white/10 text-xs font-bold py-2 rounded transition-colors'>Laporkan Isu Hoaks</button>
          </div>
        </div>

        <PrototypeDisclaimer />
      </div>
    </div>
  );
}

// ==========================================
// 4. CORPORATE TERMINAL (Yang tadi sudah kita buat mega-keren)
// ==========================================
export function CorporateTerminal() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-6 pb-20'>
      <div className='kg-container mx-auto px-4 md:px-8 max-w-7xl'>
        {/* HEADER TERMINAL */}
        <div className='flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <span className='bg-emerald/20 text-emerald text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald/30 animate-pulse'>Live Demo Mode</span>
              <span className='text-xs text-ink-muted font-mono'>B2B/B2G Data Engine v1.0</span>
            </div>
            <h1 className='text-3xl font-heading font-black text-emerald flex items-center gap-3 tracking-tight'>
              <Activity size={36} /> SOVEREIGN COMMAND CENTER
            </h1>
            <p className='text-ink-muted mt-2 max-w-2xl'>Panel analitik telemetri sentimen publik dan mitigasi krisis real-time untuk wilayah Jawa Barat.</p>
          </div>
        </div>

        {/* TOP METRICS */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-charcoal border border-white/5 rounded-xl p-6'>
            <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Total Liputan Jabar</p>
            <h3 className='text-3xl font-heading font-black text-white mb-2'>152,490</h3>
          </div>
          <div className='bg-charcoal border border-white/5 rounded-xl p-6'>
            <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Ancaman Hoaks Aktif</p>
            <h3 className='text-3xl font-heading font-black text-hoax mb-2'>24</h3>
          </div>
          <div className='bg-charcoal border border-emerald/20 rounded-xl p-6 bg-gradient-to-br from-emerald/10 to-transparent'>
            <p className='text-xs text-emerald uppercase tracking-wider font-bold mb-1'>Indeks Sentimen Warga</p>
            <h3 className='text-3xl font-heading font-black text-emerald mb-2'>78.5%</h3>
          </div>
          <div className='bg-charcoal border border-white/5 rounded-xl p-6'>
            <p className='text-xs text-ink-muted uppercase tracking-wider font-bold mb-1'>Kontributor Citizen</p>
            <h3 className='text-3xl font-heading font-black text-white mb-2'>8,942</h3>
          </div>
        </div>

        <PrototypeDisclaimer />
      </div>
    </div>
  );
}

// ==========================================
// 5. CITIZEN STUDIO & RUANG REDAKSI (Biar nggak error kalau diklik)
// ==========================================
export function CitizenStudioDummy() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-10 px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-heading font-black mb-4 flex items-center gap-3'>
          <Edit3 size={32} className='text-cyan' /> Citizen Studio Workspace
        </h1>
        <PrototypeDisclaimer />
      </div>
    </div>
  );
}

export function RuangRedaksiDummy() {
  return (
    <div className='min-h-screen bg-obsidian text-ink font-sans pt-10 px-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-heading font-black text-emerald mb-4 flex items-center gap-3'>
          <Activity size={32} /> Ruang Redaksi & Kurasi AI
        </h1>
        <PrototypeDisclaimer />
      </div>
    </div>
  );
}
