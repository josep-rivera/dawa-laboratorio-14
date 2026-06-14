const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: 'categories', timestamps: true });

module.exports = Category;
