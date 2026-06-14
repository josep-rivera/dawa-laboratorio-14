const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING },
  CategoryId: { type: DataTypes.INTEGER, references: { model: 'categories', key: 'id' } },
}, { tableName: 'products', timestamps: true });

module.exports = Product;
