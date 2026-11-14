// const { Comment, User } = require('../models');
// const { success, fail } = require('../utils/apiResponse');

// // GET /api/articles/:articleId/comments — Ambil daftar komentar artikel
// exports.getArticleComments = async (req, res, next) => {
//   try {
//     const comments = await Comment.findAll({
//       where: { article_id: req.params.articleId },
//       include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar_url'] }],
//       order: [['createdAt', 'DESC']],
//     });
//     return success(res, comments);
//   } catch (err) {
//     next(err);
//   }
// };

// // POST /api/articles/:articleId/comments — Buat komentar baru (Butuh Auth)
// exports.createComment = async (req, res, next) => {
//   try {
//     const { content } = req.body;
//     if (!content || !content.trim()) {
//       return fail(res, 'Isi komentar tidak boleh kosong.', 400);
//     }

//     const newComment = await Comment.create({
//       content,
//       article_id: req.params.articleId,
//       user_id: req.user.id, // Ambil ID dari token login JWT
//     });

//     // Load data user untuk balasan response
//     const commentWithUser = await Comment.findByPk(newComment.id, {
//       include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar_url'] }],
//     });

//     return success(res, commentWithUser, 'Komentar berhasil dikirim.', 201);
//   } catch (err) {
//     next(err);
//   }
// };


const { Comment, User } = require('../models');
const { success, fail } = require('../utils/apiResponse');

// GET /api/articles/:articleId/comments
// Menarik semua komentar untuk satu artikel tertentu
exports.getArticleComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { article_id: req.params.articleId },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'name'] // Koma berlebih sudah dihapus
        }
      ],
      // KUNCI PERBAIKAN: Gunakan 'created_at', bukan 'createdAt'
      order: [['created_at', 'DESC']], 
    });
    
    return success(res, comments);
  } catch (err) {
    console.error('DEBUG ERROR GET COMMENTS:', err);
    next(err);
  }
};

// POST /api/articles/:articleId/comments
// Membuat komentar baru (Pengguna WAJIB login)
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return fail(res, 'Isi komentar tidak boleh kosong.', 400);
    }

    // req.user.id didapat dari middleware autentikasi (token JWT)
    const newComment = await Comment.create({
      content: content.trim(),
      article_id: req.params.articleId,
      user_id: req.user.id, 
    });

    // Ambil kembali data komentar yang baru dibuat beserta data User-nya 
    // agar Frontend bisa langsung menampilkannya tanpa perlu refresh halaman
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'name'] // Koma berlebih sudah dihapus
        }
      ],
    });

    return success(res, commentWithUser, 'Komentar berhasil dikirim.', 201);
  } catch (err) {
    console.error('DEBUG ERROR CREATE COMMENT:', err);
    next(err);
  }
};