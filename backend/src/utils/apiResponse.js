/**
 * Helper standar agar seluruh controller mengembalikan bentuk response yang seragam.
 * Dipakai di semua controller supaya tidak ada duplikasi format JSON (DRY).
 */
const success = (res, data, meta = null, statusCode = 200) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const fail = (res, message = 'Terjadi kesalahan', statusCode = 400, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const paginate = (page = 1, limit = 10) => {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  return { limit: l, offset: (p - 1) * l, page: p };
};

const buildMeta = (count, page, limit) => ({
  total: count,
  page,
  limit,
  totalPages: Math.ceil(count / limit) || 1,
});

module.exports = { success, fail, paginate, buildMeta };
