const { Op } = require('sequelize');
const slugify = require('slugify'); // Modul bawaan yang sudah di-import di atas
const { Article, Category, Region, User, HoaxArchive } = require('../models');
const { success, fail, paginate, buildMeta } = require('../utils/apiResponse');

const defaultIncludes = [
  { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
  { model: Region, as: 'region', required: false, attributes: ['id', 'name', 'type', 'slug'] },
  { model: User, as: 'author', attributes: ['id', 'name', 'avatar_url', 'nik_verified'] },
];

// (Fungsi buatan manual 'slugify' SUDAH DIHAPUS dari sini agar tidak bentrok)

// GET /api/articles
exports.getArticles = async (req, res, next) => {
  try {
    const { category, region, investigative, q, page, limit } = req.query;
    const { limit: l, offset, page: p } = paginate(page, limit);

    const where = { status: 'published' };

    // 1. FILTER KATEGORI YANG AMAN
    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) {
        where.category_id = cat.id;
      } else {
        where.category_id = -1; // Mencegah tampilnya semua berita jika slug salah
      }
    }

    // 2. FILTER WILAYAH (REGION) YANG AMAN
    if (region) {
      const reg = await Region.findOne({ where: { slug: region } });
      if (reg) {
        where.region_id = reg.id;
      } else {
        where.region_id = -1; // Mencegah tampilnya semua berita jika slug salah
      }
    }

    if (investigative === 'true') where.is_investigative = true;

    if (q) {
      where[Op.or] = [{ title: { [Op.like]: `%${q}%` } }, { excerpt: { [Op.like]: `%${q}%` } }];
    }

    const { rows, count } = await Article.findAndCountAll({
      where,
      include: defaultIncludes,
      order: [['published_at', 'DESC']],
      limit: l,
      offset,
      distinct: true,
      // Hapus subQuery: false karena sekarang kita menggunakan direct ID,
      // sehingga Sequelize bisa menangani paginasinya dengan normal.
    });

    return success(res, rows, buildMeta(count, p, l));
  } catch (err) {
    console.error('DEBUG ERROR GET ARTICLES:', err);
    next(err);
  }
};

// GET /api/articles/:slug
// GET /api/articles/:slug — Menarik data berdasarkan Slug (untuk pembaca) atau ID (untuk editor)
exports.getArticleBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;

    // KECERDASAN BUATAN: Cek apakah yang dikirim ini murni Angka (ID) atau huruf (Slug)?
    const isNumeric = /^\d+$/.test(param);

    let whereClause = {};
    if (isNumeric) {
      whereClause = { id: param }; // Jika angka, cari berdasarkan ID (Untuk mode Edit)
    } else {
      whereClause = { slug: param }; // Jika huruf, cari berdasarkan Slug (Untuk halaman baca)
    }

    const article = await Article.findOne({
      where: whereClause,
      include: defaultIncludes,
    });

    if (!article) return fail(res, 'Artikel tidak ditemukan.', 404);

    // Tambah jumlah view (dilihat) HANYA JIKA diakses via Slug (oleh pembaca)
    // Jika diakses via ID (oleh editor), jangan tambah view_count.
    if (!isNumeric) {
      article.view_count += 1;
      await article.save();
    }

    return success(res, article);
  } catch (err) {
    next(err);
  }
};

// POST /api/articles
// POST /api/articles
exports.createArticle = async (req, res, next) => {
  try {
    const { title, category_id, region_id, keywords, cover_source } = req.body;
    let content = req.body.content;

    // 1. Ambil foto sampul (cover_image)
    const coverImage = req.files && req.files['cover_image'] ? req.files['cover_image'][0] : null;
    const coverImageUrl = coverImage ? coverImage.path : null;

    // 2. Ambil kumpulan file inline images (jika ada)
    const inlineFiles = req.files && req.files['inline_images'] ? req.files['inline_images'] : [];

    // 3. Parse content dari string JSON ke array objek blok
    let parsedContent = [];
    try {
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      parsedContent = [{ type: 'richtext', value: content }];
    }

    // 4. Petakan blok dan pasangkan dengan URL Cloudinary
    let fileIndex = 0;
    const processedContent = parsedContent.map((block) => {
      if (block.type === 'image') {
        if (inlineFiles[fileIndex]) {
          const cloudUrl = inlineFiles[fileIndex].path;
          fileIndex++;
          return {
            type: 'image',
            value: cloudUrl,
            source: block.source || '',
          };
        }
      }
      return block;
    });

    const generatedSlug = slugify(title, { lower: true, strict: true });

    // 5. Buat artikel ke database
    const newArticle = await Article.create({
      title,
      slug: generatedSlug,
      category_id: category_id ? parseInt(category_id) : null, // Pastikan jadi Integer
      region_id: region_id && region_id !== '' && region_id !== 'undefined' ? parseInt(region_id) : null, // Pastikan aman
      keywords,
      content: JSON.stringify(processedContent),
      cover_image: coverImageUrl,
      cover_source,
      status: req.body.status || 'draft',
      author_id: req.user.id,
    });

    return success(res, newArticle, 'Artikel berhasil dibuat', 201);
  } catch (err) {
    console.error('DEBUG ERROR CREATE ARTICLE:', err); // <-- Lihat teks error lengkap di terminal backend
    next(err);
  }
};

// PUT /api/articles/:id
// PUT /api/articles/:id — Update artikel
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return fail(res, 'Artikel tidak ditemukan.', 404);

    if (article.author_id !== req.user.id && req.user.role !== 'admin') {
      return fail(res, 'Anda tidak memiliki akses untuk mengubah artikel ini.', 403);
    }

    const body = req.body;

    // 1. Update Slug jika judul berubah
    if (body.title) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // --- TAMBAHKAN PENGAMAN INI AGAR REGION TIDAK ERROR 500 ---
    if (body.region_id === '' || body.region_id === 'undefined' || body.region_id === 'null') {
      body.region_id = null;
    }

    // 2. Update Foto Sampul jika ada yang baru
    if (req.files && req.files['cover_image']) {
      body.cover_image = req.files['cover_image'][0].path;
    }

    // 3. LOGIKA BARU: Proses foto inline baru jika ada saat mode Edit
    if (body.content) {
      let parsedContent = [];
      try {
        parsedContent = typeof body.content === 'string' ? JSON.parse(body.content) : body.content;
      } catch (e) {
        parsedContent = [{ type: 'richtext', value: body.content }];
      }

      const inlineFiles = req.files && req.files['inline_images'] ? req.files['inline_images'] : [];
      let fileIndex = 0;

      console.log(`[DEBUG] Mode Edit: Ditemukan ${inlineFiles.length} foto inline baru dari frontend.`);

      const processedContent = parsedContent.map((block) => {
        if (block.type === 'image') {
          if (block.fileName && inlineFiles[fileIndex]) {
            const cloudUrl = inlineFiles[fileIndex].path;
            console.log(`[DEBUG] Berhasil memproses gambar baru ke: ${cloudUrl}`);
            fileIndex++;
            return {
              type: 'image',
              value: cloudUrl,
              source: block.source || '',
            };
          } else if (block.value) {
            return block;
          }
        }
        return block;
      });

      body.content = JSON.stringify(processedContent);
    }

    // Reset status jika sebelumnya ditolak
    if (article.status === 'rejected') {
      body.status = 'pending_review';
      body.rejection_notes = null;
    }

    await article.update(body);
    return success(res, article);
  } catch (err) {
    console.error('DEBUG ERROR UPDATE:', err);
    next(err);
  }
};

// DELETE /api/articles/:id
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return fail(res, 'Artikel tidak ditemukan.', 404);
    await article.destroy();
    return success(res, { message: 'Artikel berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/articles/my-articles
exports.getMyArticles = async (req, res, next) => {
  try {
    const author_id = req.user.id;
    const { status } = req.query;

    const where = { author_id };
    if (status) {
      where.status = status;
    }

    const articles = await Article.findAll({
      where,
      order: [['updated_at', 'DESC']],
    });

    return success(res, articles);
  } catch (err) {
    next(err);
  }
};

// GET /api/articles/hero
exports.getHeroArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      where: { status: 'published' },
      include: defaultIncludes,
      order: [
        ['view_count', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });
    return success(res, article);
  } catch (err) {
    next(err);
  }
};

// PUT /api/articles/:id/review
// PUT /api/articles/:id/review
exports.reviewArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return fail(res, 'Artikel tidak ditemukan.', 404);

    // KUNCI PERBAIKAN: Tambahkan region_id di sini agar ditangkap backend!
    const { status, rejection_notes, category_id, region_id, is_hoax } = req.body;

    article.status = status;

    if (category_id) article.category_id = category_id;

    // SIMPAN WILAYAH KE DATABASE JIKA DIUBAH EDITOR
    if (region_id !== undefined) {
      article.region_id = region_id === '' || region_id === null ? null : region_id;
    }

    if (is_hoax !== undefined) {
      article.is_hoax = is_hoax;

      if (is_hoax === true && status === 'rejected') {
        const { HoaxArchive } = require('../models');
        await HoaxArchive.findOrCreate({
          where: { title: `[INDIKASI HOAKS] ${article.title}` },
          defaults: {
            title: `[INDIKASI HOAKS] ${article.title}`,
            claim_false: article.excerpt || 'Isi artikel mengklaim informasi yang tidak dapat dipertanggungjawabkan.',
            verified_fact: `Catatan Redaksi: ${rejection_notes || 'Menunggu penelusuran lebih lanjut dari tim pemeriksa fakta.'}`,
            screenshot_url: article.cover_image,
            source_reference: `Internal Submission ID: ${article.id}`,
          },
        });
      }
    }

    if (status === 'rejected') {
      article.rejection_notes = rejection_notes;
    } else {
      article.rejection_notes = null;
      if (status === 'published' && !article.published_at) {
        article.published_at = new Date();
      }
    }

    await article.save();
    return success(res, article, 'Status artikel berhasil diperbarui.');
  } catch (err) {
    console.error('DEBUG ERROR REVIEW:', err);
    next(err);
  }
};

// GET /api/articles/editor/pending
exports.getPendingArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll({
      where: { status: 'pending_review' },
      include: defaultIncludes,
      order: [['updated_at', 'ASC']],
    });

    return success(res, articles);
  } catch (err) {
    next(err);
  }
};

// GET /api/articles/search?q=keyword
exports.searchArticles = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return success(res, []);

    const articles = await Article.findAll({
      where: {
        status: 'published',
        [Op.or]: [{ title: { [Op.iLike]: `%${q}%` } }, { excerpt: { [Op.iLike]: `%${q}%` } }, { content: { [Op.iLike]: `%${q}%` } }],
      },
      include: ['category', 'author'],
      order: [['published_at', 'DESC']],
      limit: 20,
    });

    return success(res, articles, 'Hasil pencarian berhasil ditarik.');
  } catch (err) {
    next(err);
  }
};
