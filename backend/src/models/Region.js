const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Struktur wilayah bertingkat: Kabupaten/Kota (parent_id = NULL) -> Kecamatan (parent_id = id kabupaten)
const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(160),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('kabupaten_kota', 'kecamatan'),
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true,
  },
}, {
  tableName: 'regions',
  indexes: [{ fields: ['parent_id'] }, { fields: ['type'] }],
});

module.exports = Region;
