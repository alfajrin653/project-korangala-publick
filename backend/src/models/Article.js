const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Article = sequelize.define(
  'Article',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(280),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // ==== Axios Smart Brevity Mode fields (3-bullet summary) ====
    brevity_why_it_matters: { type: DataTypes.TEXT, allowNull: true },
    brevity_by_the_numbers: { type: DataTypes.TEXT, allowNull: true },
    brevity_big_picture: { type: DataTypes.TEXT, allowNull: true },
    // ==== Meta ====
    status: {
      type: DataTypes.ENUM('draft', 'pending_review', 'rejected', 'scheduled', 'published'),
      defaultValue: 'draft',
      allowNull: false,
    },
    rejection_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_hoax: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_investigative: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Tandai artikel kanal Investigasi APBD (Bocor Alus Jabar)',
    },
    read_time_minutes: {
      type: DataTypes.SMALLINT,
      defaultValue: 3,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gps_lat: { type: DataTypes.DECIMAL(9, 6), allowNull: true, comment: 'Citizen Studio GPS watermark' },
    gps_lng: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Kecamatan/Kabupaten terkait untuk fitur Hiper-Lokal',
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'articles',
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
    indexes: [{ fields: ['slug'] }, { fields: ['category_id'] }, { fields: ['region_id'] }, { fields: ['status', 'published_at'] }],
  }
);

// ==== TAMBAHKAN BLOK RELASI INI DI SINI ====
Article.associate = (models) => {
  // Jika sebelumnya Anda sudah punya relasi lain di sini, biarkan saja.
  // Tambahkan baris ini agar Artikel bisa menarik semua komentarnya:
  Article.hasMany(models.Comment, { foreignKey: 'article_id', as: 'comments' });
};
// ===========================================

module.exports = Article;
