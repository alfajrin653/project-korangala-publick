const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Region = require('./Region');
const Article = require('./Article');
const HoaxArchive = require('./HoaxArchive');
const TickerData = require('./TickerData');
const Comment = require('./Comment'); // <-- Import biasa

// ===== Relasi Region (self-referencing: Kabupaten -> Kecamatan) =====
Region.hasMany(Region, { as: 'children', foreignKey: 'parent_id' });
Region.belongsTo(Region, { as: 'parent', foreignKey: 'parent_id' });

// ===== Relasi Article =====
Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });

Article.belongsTo(Region, { foreignKey: 'region_id', as: 'region' });
Region.hasMany(Article, { foreignKey: 'region_id', as: 'articles' });

Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });

// ===== Relasi Comment =====
Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Region,
  Article,
  HoaxArchive,
  TickerData,
  Comment,
};