const jwt = require('jsonwebtoken');
const { fail } = require('../utils/apiResponse');

const protect = (req, res, next) => {
  console.log('[AUTH DEBUG]', {
  url: req.originalUrl,
  hasCookieHeader: Boolean(req.headers.cookie),
  parsedCookieNames: Object.keys(req.cookies || {}),
});
  const token = req.cookies.token; 
  
  if (!token) {
    // CCTV 1: Jika tulisan ini muncul di terminal, berarti browser pelit tidak mau ngirim Cookie ke Backend!
    console.log("❌ CCTV 1: Token KOSONG! Cookie tidak terkirim dari Frontend."); 
    return fail(res, 'Tidak ada token akses, silakan login.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    // CCTV 2: Jika ini muncul, berarti Cookie terkirim, tapi kuncinya (JWT_SECRET) salah atau tokennya kadaluarsa.
    console.log("❌ CCTV 2: Token GAGAL diverifikasi! Alasan:", err.message);
    return fail(res, 'Token tidak valid atau kadaluarsa.', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return fail(res, 'Anda tidak memiliki akses untuk aksi ini.', 403);
  }
  next();
};

module.exports = { protect, authorize };