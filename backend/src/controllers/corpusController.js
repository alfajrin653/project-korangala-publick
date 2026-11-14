const { Op } = require('sequelize');
const { Article, Category, User } = require('../models');
const { success, fail, paginate, buildMeta } = require('../utils/apiResponse');
const { generateCitations } = require('../utils/citationGenerator');

// GET /api/corpus/search?q=...&tag=...  — mesin pencari arsip 150rb+ data historis (mocked via tabel articles)
exports.searchCorpus = async (req, res, next) => {
  try {
    const { q, tag, page, limit } = req.query;
    const { limit: l, offset, page: p } = paginate(page, limit);

    const where = { status: 'published' };
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ];
    }
    if (tag) where['$category.slug$'] = tag;

    const { rows, count } = await Article.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'author', attributes: ['id', 'name'] },
      ],
      order: [['published_at', 'DESC']],
      limit: l,
      offset,
      distinct: true,
      subQuery: false,
    });

    // Buat archive_id hash sederhana + snippet untuk setiap hasil
    const results = rows.map((a) => ({
      id: a.id,
      archive_hash: `KG-${String(a.id).padStart(6, '0')}`,
      title: a.title,
      slug: a.slug,
      category: a.category?.name,
      published_at: a.published_at,
      snippet: (a.excerpt || a.content || '').slice(0, 200),
    }));

    return success(res, results, buildMeta(count, p, l));
  } catch (err) {
    next(err);
  }
};

// GET /api/corpus/:id/citation — generator sitasi otomatis APA/Harvard/Chicago/BibTeX
exports.getCitation = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
    });
    if (!article) return fail(res, 'Artikel tidak ditemukan di arsip.', 404);

    const citations = generateCitations(article);
    return success(res, citations);
  } catch (err) {
    next(err);
  }
};
