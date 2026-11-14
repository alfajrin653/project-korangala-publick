const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HoaxArchive = sequelize.define('HoaxArchive', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  claim_false: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Klaim Palsu yang beredar',
  },
  verified_fact: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Fakta Terverifikasi',
  },
  screenshot_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Screenshot blur berita hoaks',
  },
  source_reference: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Link/hash sumber verifikasi',
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'hoax_archives',
});

module.exports = HoaxArchive;
