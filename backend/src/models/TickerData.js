const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TickerData = sequelize.define('TickerData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Contoh: NIDR/IDR, Beras IR64 Jabar, GDP Growth Jabar',
  },
  value: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Nilai yang ditampilkan, contoh: Rp 14.200/kg',
  },
  trend: {
    type: DataTypes.ENUM('up', 'down', 'flat'),
    defaultValue: 'flat',
  },
  display_order: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
}, {
  tableName: 'ticker_data',
});

module.exports = TickerData;
