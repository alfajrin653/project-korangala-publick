const { Region } = require('../models');
const { success, fail } = require('../utils/apiResponse');

// GET /api/regions?type=kabupaten_kota  -> daftar 27 kab/kota
// GET /api/regions?parent=slug-kabupaten -> daftar kecamatan di kab/kota tsb
exports.getRegions = async (req, res, next) => {
  try {
    const { type, parent } = req.query;
    const where = {};

    if (parent) {
      const parentRegion = await Region.findOne({ where: { slug: parent } });
      if (!parentRegion) return fail(res, 'Wilayah induk tidak ditemukan.', 404);
      where.parent_id = parentRegion.id;
    } else if (type) {
      where.type = type;
    } else {
      where.type = 'kabupaten_kota';
    }

    const regions = await Region.findAll({ where, order: [['name', 'ASC']] });
    return success(res, regions);
  } catch (err) {
    next(err);
  }
};

exports.getRegionBySlug = async (req, res, next) => {
  try {
    const region = await Region.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Region, as: 'children' }],
    });
    if (!region) return fail(res, 'Wilayah tidak ditemukan.', 404);
    return success(res, region);
  } catch (err) {
    next(err);
  }
};
