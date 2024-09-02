const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/config');
const Product = require('./models/Product'); // Adjust the path to reflect your project structure
const Cart = require('./models/Cart');
const Order = require('./models/Order'); // Tambahkan model Order
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const paymentController = require('./controllers/paymentController'); // Import payment controller

const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Untuk menangani payload JSON dari Midtrans

// Rute pembayaran
app.post('/checkout', paymentController.createTransaction);
app.post('/midtrans-notification', paymentController.handleNotification);

// Endpoint untuk halaman utama
app.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('index', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Endpoint untuk menambah produk ke keranjang
app.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = 1; // Simulasi user ID

  if (!productId || isNaN(productId) || !quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).send('Invalid product ID or quantity.');
  }

  try {
    let cartItem = await Cart.findOne({ where: { UserId: userId, ProductId: productId } });

    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      await Cart.create({ UserId: userId, ProductId: productId, quantity });
    }

    res.redirect('/cart');
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).send(`Error adding item to cart: ${error.message}`);
  }
});

// Endpoint untuk menampilkan keranjang
app.get('/cart', async (req, res) => {
  const userId = 1; // Simulasi user ID
  try {
    const cartItems = await Cart.findAll({
      where: { UserId: userId },
      include: [Product]
    });

    // Hitung total harga dan jumlah item
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.Product.price;
    });

    res.render('cart', { cartItems, totalItems, totalPrice });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Error fetching cart');
  }
});

// Endpoint untuk menghapus item dari keranjang
app.post('/cart/delete', async (req, res) => {
  const { cartItemId } = req.body;
  const userId = 1; // Simulasi user ID

  if (!cartItemId || isNaN(cartItemId)) {
    return res.status(400).send('Invalid cart item ID.');
  }

  try {
    // Cari item di keranjang berdasarkan ID dan UserId
    const cartItem = await Cart.findOne({ where: { id: cartItemId, UserId: userId } });

    if (cartItem) {
      await cartItem.destroy();
      res.redirect('/cart');
    } else {
      res.status(404).send('Item not found in cart.');
    }
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).send('Error deleting item from cart');
  }
});

// Endpoint untuk memproses pembayaran
app.post('/checkout', async (req, res) => {
  const userId = 1; // Simulasi user ID

  try {
    const cartItems = await Cart.findAll({
      where: { UserId: userId },
      include: [Product]
    });

    if (!cartItems.length) {
      return res.status(400).send('Cart is empty.');
    }

    // Hitung total harga dan jumlah item
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.Product.price;
    });

    // Buat pesanan baru
    const order = await Order.create({
      UserId: userId,
      totalItems,
      totalPrice,
      status: 'Paid'
    });

    // Hapus semua item dari keranjang setelah checkout berhasil
    await Cart.destroy({ where: { UserId: userId } });

    res.redirect('/order-success');
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).send('Error processing checkout');
  }
});

// Endpoint untuk halaman sukses pesanan
app.get('/order-success', (req, res) => {
  res.send('Order has been placed successfully!');
});

// Endpoint untuk halaman kontak
app.get('/contact', (req, res) => {
  res.render('contact'); // Pastikan ada file contact.ejs di dalam folder views
});

// Endpoint untuk halaman produk
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('products', { products }); // Pastikan ada file products.ejs di folder views
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


// Use admin routes
app.use('/', adminRoutes);

// Sinkronisasi database dan menjalankan server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch(err => console.log('Error syncing database:', err));
