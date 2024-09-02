const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Product = require('./Product');

const Order = sequelize.define('Order', {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalItems: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  }
});

// Relasi dengan Product (Opsional, jika Anda ingin menyimpan detail produk per pesanan)
Order.belongsToMany(Product, { through: 'OrderProduct' });

module.exports = Order;
