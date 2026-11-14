const { Category } = require('../models');
const { success, fail } = require('../utils/apiResponse');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    return success(res, categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (!category) return fail(res, 'Kanal tidak ditemukan.', 404);
    return success(res, category);
  } catch (err) {
    next(err);
  }
};
