const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// Admin dashboard
router.get('/admin', (req, res) => {
  res.render('admin-dashboard');
});

// Manage Products
router.get('/admin/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('admin-products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Add Product Form
router.get('/admin/products/add', (req, res) => {
  res.render('admin-add-product');
});

// Add Product
router.post('/admin/products/add', async (req, res) => {
  const { name, price, description, stock } = req.body;

  if (!name || isNaN(price) || isNaN(stock)) {
    return res.status(400).send('Invalid input.');
  }

  try {
    await Product.create({ name, price, description, stock });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
});

// Edit Product Form
router.get('/admin/products/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send('Product not found.');
    }
    res.render('admin-edit-product', { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

// Update Product
router.post('/admin/products/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    await Product.update({ name, price, description, stock }, {
      where: { id }
    });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

// Delete Product
router.post('/admin/products/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.destroy({ where: { id } });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

// Manage Orders
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.render('admin-orders', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});

module.exports = router;
