const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');


require('dotenv').config();

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
// TAMBAHKAN BARIS INI TEPAT DI SINI:
app.set('trust proxy', 1);
// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// Daftar frontend yang diizinkan
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://koran-gala-v5.vercel.app', process.env.CLIENT_URL].filter(Boolean);

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Request tanpa origin biasanya berasal dari:
      // Postman, server-to-server, curl, dll.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: Origin ${origin} tidak diizinkan`));
    },

    // WAJIB true jika menggunakan cookie / session
    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// =====================================================
// SECURITY
// =====================================================

app.use(helmet());

// =====================================================
// COOKIE
// =====================================================

app.use(cookieParser());

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// LOGGER
// =====================================================

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// =====================================================
// STATIC FILES
// =====================================================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Koran Gala 5.0 API is running 🚀',
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use('/api', routes);

// Taruh di deretan app.use route lainnya
app.use('/api/payment', require('./routes/paymentRoutes'));

// =====================================================
// ERROR HANDLER
// =====================================================

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
