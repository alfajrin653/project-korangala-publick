const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Nama icon lucide-react di frontend',
  },
}, {
  tableName: 'categories',
});

module.exports = Category;
