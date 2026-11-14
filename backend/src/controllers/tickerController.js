const { TickerData } = require('../models');
const { success } = require('../utils/apiResponse');

exports.getTicker = async (req, res, next) => {
  try {
    const ticker = await TickerData.findAll({ order: [['display_order', 'ASC']] });
    return success(res, ticker);
  } catch (err) {
    next(err);
  }
};
