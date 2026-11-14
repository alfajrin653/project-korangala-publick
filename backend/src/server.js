require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./config/db');
require('./models'); // registrasi model & asosiasi




const PORT = process.env.PORT || 4000;

const start = async () => {
  await testConnection();
  // Sinkronisasi model ke tabel MySQL (gunakan migration terpisah untuk produksi)
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  console.log('✅ Model tersinkronisasi dengan database.');

  // Tambahkan '0.0.0.0' di sini agar Railway bisa ngebuka jalurnya!
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Koran Gala 5.0 API berjalan di port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('❌ Gagal menjalankan server:', err);
  process.exit(1);
});
