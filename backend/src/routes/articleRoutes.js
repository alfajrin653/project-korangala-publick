const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, authorize, authenticate } = require('../middleware/auth');
// const { authenticate } = require('../middleware/auth');
// 1. IMPORT ADAPTOR CLOUDINARY KITA DI SINI
const { upload } = require('../middleware/upload');
const commentController = require('../controllers/commentController');


// ==========================================================
// RUTE SPESIFIK
// ==========================================================
router.get('/search', articleController.searchArticles);
router.get('/hero', articleController.getHeroArticle);
router.get('/my-articles', protect, articleController.getMyArticles);
router.get('/editor/pending', protect, authorize('editor', 'admin'), articleController.getPendingArticles);
// Endpoint Komentar Artikel
router.get('/:articleId/comments', commentController.getArticleComments);
router.post('/:articleId/comments', protect, commentController.createComment); 
// Catatan: Gunakan nama middleware auth yang Anda pakai (misal: 'authenticate', 'verifyToken', atau 'isAuth')


// ==========================================================
// RUTE UTAMA & MANAJEMEN KONTEN (Gunakan upload.single('cover_image'))
// ==========================================================

const multiUpload = upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'inline_images', maxCount: 10 },
]);

router.get('/', articleController.getArticles);
router.post('/', protect, authorize('editor', 'admin', 'citizen_reporter'), multiUpload, articleController.createArticle);
router.put('/:id', protect, authorize('editor', 'admin'), multiUpload, articleController.updateArticle);
router.delete('/:id', protect, authorize('admin'), articleController.deleteArticle);
router.put('/:id/review', protect, authorize('editor', 'admin'), articleController.reviewArticle);

// ==========================================================
// RUTE SLUG (WAJIB PALING BAWAH)
// ==========================================================
router.get('/:slug', articleController.getArticleBySlug);

module.exports = router;
