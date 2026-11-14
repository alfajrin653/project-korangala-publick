require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Region, Article, HoaxArchive, TickerData } = require('../models');

const run = async () => {
  await sequelize.sync({ force: true });
  console.log('🗑️  Tabel direset, memulai seeding...');

  // ==== Users ====
  const password_hash = await bcrypt.hash('password123', 10);
  const admin = await User.create({ name: 'Bos Sabdo', email: 'admin@korangala.id', password_hash, role: 'admin', nik_verified: true });
  const editor = await User.create({ name: 'Fajrin', email: 'fajrin@korangala.id', password_hash, role: 'editor', nik_verified: true });
  const citizen = await User.create({ name: 'Andi Pratama', email: 'andi@korangala.id', password_hash, role: 'citizen_reporter', nik_verified: true, wallet_balance_nidr: 250000 });

  // ==== Categories (6 Kanal Utama) ====
  const categories = await Category.bulkCreate([
    { name: 'Brevity News', slug: 'brevity-news', description: 'Ringkasan 3-poin ala Axios Smart Brevity', icon: 'Zap' },
    { name: 'Investigasi APBD', slug: 'investigasi-apbd', description: 'Laporan mendalam Bocor Alus Jabar', icon: 'Search' },
    { name: 'Hiper-Lokal Jabar', slug: 'hiper-lokal-jabar', description: 'Berita 27 Kab/Kota se-Jawa Barat', icon: 'MapPin' },
    { name: 'Ekonomi & RWA', slug: 'ekonomi-rwa', description: 'Bisnis, fiqh muamalah, dan NIDR', icon: 'TrendingUp' },
    { name: 'Akademik & AI Corpus', slug: 'akademik-ai-corpus', description: '150rb+ arsip data & sitasi otomatis', icon: 'BookOpen' },
    { name: 'Radar Hoaks', slug: 'radar-hoaks', description: 'Stempel merah berita terverifikasi', icon: 'ShieldAlert' },
  ]);

  // ==== Regions: Kabupaten/Kota + Kecamatan ====
  const bandung = await Region.create({ name: 'Kota Bandung', slug: 'kota-bandung', type: 'kabupaten_kota', latitude: -6.9175, longitude: 107.6191 });
  const garut = await Region.create({ name: 'Kabupaten Garut', slug: 'kabupaten-garut', type: 'kabupaten_kota', latitude: -7.2148, longitude: 107.9088 });
  const cirebon = await Region.create({ name: 'Kabupaten Cirebon', slug: 'kabupaten-cirebon', type: 'kabupaten_kota', latitude: -6.7063, longitude: 108.5571 });

  const coblong = await Region.create({ name: 'Coblong', slug: 'coblong', type: 'kecamatan', parent_id: bandung.id });
  await Region.create({ name: 'Sukajadi', slug: 'sukajadi', type: 'kecamatan', parent_id: bandung.id });
  await Region.create({ name: 'Lengkong', slug: 'lengkong', type: 'kecamatan', parent_id: bandung.id });
  await Region.create({ name: 'Tarogong Kidul', slug: 'tarogong-kidul', type: 'kecamatan', parent_id: garut.id });
  await Region.create({ name: 'Sumber', slug: 'sumber', type: 'kecamatan', parent_id: cirebon.id });

  // ==== Ticker Data (B2B Market Ticker Bar) ====
  await TickerData.bulkCreate([
    { label: 'NIDR/IDR', value: '1.00', trend: 'flat', display_order: 1 },
    { label: 'Beras IR64 Jabar', value: 'Rp 14.200/kg', trend: 'up', display_order: 2 },
    { label: 'GDP Growth Jabar', value: '5.2%', trend: 'up', display_order: 3 },
    { label: 'Harga Emas', value: 'Rp 1.350.000/g', trend: 'up', display_order: 4 },
    { label: 'APBD Realization Jabar', value: '68%', trend: 'flat', display_order: 5 },
  ]);

  // ==== Articles ====
  await Article.create({
    title: 'Realisasi APBD Jabar Capai 68%, Ini Sektor yang Paling Lambat Serap Anggaran',
    slug: 'realisasi-apbd-jabar-capai-68-persen',
    excerpt: 'Investigasi Koran Gala menemukan sejumlah dinas dengan realisasi anggaran di bawah 40% menjelang akhir tahun anggaran.',
    content: 'Isi lengkap laporan investigasi mengenai realisasi APBD Provinsi Jawa Barat tahun anggaran berjalan, mencakup rincian dinas dengan serapan anggaran terendah, wawancara dengan pejabat terkait, dan analisis dampaknya terhadap layanan publik...',
    brevity_why_it_matters: 'Serapan anggaran yang lambat berarti proyek infrastruktur dan layanan publik tertunda, berdampak langsung pada warga Jabar.',
    brevity_by_the_numbers: 'Realisasi APBD: 68% | Dinas dengan serapan terendah: 38% | Sisa waktu tahun anggaran: 4 bulan.',
    brevity_big_picture: 'Jika tren ini berlanjut, target pertumbuhan ekonomi 5.2% berisiko meleset karena belanja pemerintah adalah salah satu motor utama ekonomi regional.',
    status: 'published',
    is_investigative: true,
    read_time_minutes: 6,
    published_at: new Date(),
    category_id: categories[1].id,
    region_id: bandung.id,
    author_id: editor.id,
  });

  await Article.create({
    title: 'Warga Kecamatan Coblong Laporkan Jalan Rusak via Citizen Studio',
    slug: 'warga-coblong-laporkan-jalan-rusak',
    excerpt: 'Laporan warga terverifikasi GPS menunjukkan kerusakan jalan di tiga titik utama Coblong.',
    content: 'Melalui fitur Citizen Journalism Studio, seorang warga bernama Andi Pratama mengunggah laporan foto dan video kerusakan jalan di wilayah Coblong, Kota Bandung, lengkap dengan watermark GPS dan timestamp blockchain...',
    brevity_why_it_matters: 'Laporan warga terverifikasi mempercepat respons dinas terkait untuk perbaikan infrastruktur.',
    brevity_by_the_numbers: '3 titik kerusakan | Laporan diverifikasi dalam 2 jam | 1.200 pembaca unik.',
    brevity_big_picture: 'Model jurnalisme warga seperti ini berpotensi menjadi kanal pengawasan infrastruktur publik yang lebih cepat dari birokrasi konvensional.',
    status: 'published',
    is_investigative: false,
    read_time_minutes: 3,
    published_at: new Date(),
    category_id: categories[2].id,
    region_id: coblong.id,
    author_id: citizen.id,
    gps_lat: -6.8915,
    gps_lng: 107.6107,
  });

  await Article.create({
    title: 'Harga Beras IR64 Naik, Bagaimana Dampaknya ke Pasar Rakyat Jabar?',
    slug: 'harga-beras-ir64-naik-pasar-rakyat-jabar',
    excerpt: 'Kenaikan harga beras IR64 turut mengerek inflasi pangan di sejumlah pasar tradisional Jawa Barat.',
    content: 'Analisis ekonomi mengenai kenaikan harga beras IR64 di Jawa Barat, mencakup data historis harga, penyebab kenaikan, dan proyeksi dampaknya terhadap daya beli masyarakat serta indeks NIDR...',
    brevity_why_it_matters: 'Kenaikan harga beras berdampak langsung pada biaya hidup jutaan warga Jabar.',
    brevity_by_the_numbers: 'Harga naik: Rp 14.200/kg (+3.2%) | Inflasi pangan bulanan: 0.8%.',
    brevity_big_picture: 'Jika tren kenaikan berlanjut, pemerintah daerah kemungkinan akan mengeluarkan kebijakan operasi pasar untuk stabilisasi.',
    status: 'published',
    is_investigative: false,
    read_time_minutes: 4,
    published_at: new Date(),
    category_id: categories[3].id,
    region_id: garut.id,
    author_id: editor.id,
  });

  // ==== Hoax Archive ====
  await HoaxArchive.create({
    title: "Hoaks 'Bansos Rp5 Juta via Link WhatsApp' Beredar Lagi Jelang Akhir Tahun",
    claim_false: 'Pesan berantai WhatsApp menyebut warga Jabar bisa klaim bansos Rp5 juta hanya dengan mengisi formulir di sebuah link.',
    verified_fact: 'Dinas Sosial Provinsi Jawa Barat memastikan tidak ada program bansos dengan mekanisme klaim via link WhatsApp. Link tersebut terindikasi phishing.',
    source_reference: 'hash:0xA1F2...KG-HOAX-0001',
    verified_at: new Date(),
  });

  await HoaxArchive.create({
    title: "Video Lawas Banjir Dikaitkan dengan Kejadian Baru di Cirebon",
    claim_false: 'Sebuah video banjir besar diklaim terjadi di Kabupaten Cirebon minggu ini.',
    verified_fact: 'Video tersebut terbukti diambil dari kejadian banjir di provinsi lain pada tahun 2021 berdasarkan analisis metadata dan reverse image search.',
    source_reference: 'hash:0xB7C4...KG-HOAX-0002',
    verified_at: new Date(),
  });

  console.log('✅ Seeding selesai!');
  console.log(`👤 Login demo -> email: admin@korangala.id / fajrin@korangala.id / andi@korangala.id, password: password123`);
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding gagal:', err);
  process.exit(1);
});
