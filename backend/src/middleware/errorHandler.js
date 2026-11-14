const { fail } = require('../utils/apiResponse');

// Menangkap 404 untuk route yang tidak terdaftar
const notFound = (req, res, next) => {
  fail(res, `Endpoint tidak ditemukan: ${req.originalUrl}`, 404);
};

// Error handler global — satu tempat untuk semua error di aplikasi (DRY)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return fail(res, 'Validasi data gagal.', 422, errors);
  }

  const statusCode = err.statusCode || 500;
  fail(res, err.message || 'Terjadi kesalahan pada server.', statusCode);
};

module.exports = { notFound, errorHandler };
