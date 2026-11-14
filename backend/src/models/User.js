const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true, // <-- DIUBAH JADI TRUE KARENA GOOGLE LOGIN TIDAK PAKAI PASSWORD
    },
    role: {
      type: DataTypes.ENUM('reader', 'citizen_reporter', 'editor', 'admin'),
      defaultValue: 'reader',
    },

    // ==== TAMBAHAN BARU UNTUK GOOGLE OAUTH ====
    google_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    auth_provider: {
      type: DataTypes.ENUM('local', 'google'),
      defaultValue: 'local',
    },
    // ==========================================

    nik_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '1 NIK 1 ID e-KYC verification flag',
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    wallet_balance_nidr: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0,
      comment: 'Contributor wallet balance in NIDR',
    },
  },
  {
    tableName: 'users',
  }
);

// ==== BLOK RELASI TETAP AMAN DI SINI ====
User.associate = (models) => {
  User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
};
// ===========================================

module.exports = User;
