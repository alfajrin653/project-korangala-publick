const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgresql://neondb_owner:npg_IvEF6P1HfaKX@ep-wild-violet-b4rgvt77-pooler.c-6.us-east-2.aws.neon.tech/neondb', {
  dialect: 'postgres',
  logging: false,
  // INI KUNCI JAWABANNYA: Kasih tahu terjemahannya ke Node.js
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi PostgreSQL berhasil.');
  } catch (error) {
    console.error('❌ Gagal konek ke PostgreSQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
