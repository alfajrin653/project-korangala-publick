const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { success, fail } = require('../utils/apiResponse');
const axios = require('axios');

const signToken = (user) => jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  nik_verified: user.nik_verified,
  wallet_balance_nidr: user.wallet_balance_nidr,
  avatar_url: user.avatar_url,
});

// Konfigurasi Dinamis: Aman untuk Localhost (HTTP) & Production Railway (HTTPS)
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return fail(res, 'Nama, email, dan password wajib diisi.', 422);
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return fail(res, 'Email sudah terdaftar.', 409);

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });

    const token = signToken(user);

    // Set token ke dalam Cookie
    res.cookie('token', token, getCookieOptions());

    // Kembalikan JSON tanpa token, hanya data user
    return success(res, { user: sanitizeUser(user) }, 'Registrasi berhasil', 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // 1. Cek apakah email terdaftar
    if (!user) return fail(res, 'Email atau password salah.', 401);

    // 2. Cegat user Google yang iseng login manual
    if (!user.password_hash) {
      return fail(res, "Akun ini terdaftar menggunakan Google. Silakan klik 'Lanjutkan dengan Google' untuk masuk.", 400);
    }

    // 3. Cek password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return fail(res, 'Email atau password salah.', 401);

    const token = signToken(user);

    // Set token ke dalam Cookie
    res.cookie('token', token, getCookieOptions());

    return success(res, { user: sanitizeUser(user) }, 'Login berhasil');
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return fail(res, 'Pengguna tidak ditemukan.', 404);
    return success(res, sanitizeUser(user));
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    return res.status(200).json({ success: true, message: 'Berhasil logout' });
  } catch (err) {
    next(err);
  }
};

exports.googleSignIn = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // 1. Minta data profil langsung ke Google
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 2. Ekstrak datanya dari Google
    const { sub: googleId, email, name, picture } = googleResponse.data;

    let user = await User.findOne({ where: { email } });

    if (user) {
      if (!user.google_id) {
        user.google_id = googleId;
        user.auth_provider = 'google';
        if (!user.avatar_url) user.avatar_url = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        google_id: googleId,
        auth_provider: 'google',
        role: 'reader',
        avatar_url: picture,
      });
    }

    const jwtToken = signToken(user);

    // Set cookie
    res.cookie('token', jwtToken, getCookieOptions());

    return success(res, { user: sanitizeUser(user) }, 'Berhasil masuk dengan Google');
  } catch (error) {
    console.error('Google Auth Error:', error.message); 
    return fail(res, 'Gagal autentikasi dengan Google', 500);
  }
};