const { HoaxArchive } = require('../models');
const { success, fail, paginate, buildMeta } = require('../utils/apiResponse');

exports.getHoaxList = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset, page: p } = paginate(page, limit);

    const { rows, count } = await HoaxArchive.findAndCountAll({
      order: [['verified_at', 'DESC']],
      limit: l,
      offset,
    });

    return success(res, rows, buildMeta(count, p, l));
  } catch (err) {
    next(err);
  }
};

exports.getHoaxById = async (req, res, next) => {
  try {
    const hoax = await HoaxArchive.findByPk(req.params.id);
    if (!hoax) return fail(res, 'Data hoaks tidak ditemukan.', 404);
    return success(res, hoax);
  } catch (err) {
    next(err);
  }
};

exports.createHoax = async (req, res, next) => {
  try {
    const hoax = await HoaxArchive.create(req.body);
    return success(res, hoax, null, 201);
  } catch (err) {
    next(err);
  }
};
