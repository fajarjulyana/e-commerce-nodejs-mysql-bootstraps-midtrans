// paymentController.js

const midtransClient = require('midtrans-client');
const Order = require('../models/Order'); // Import model Order
const Cart = require('../models/Cart'); // Import model Cart
const Product = require('../models/Product'); // Import model Product

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true jika ingin menggunakan mode produksi
  serverKey: "SB-Mid-server-Q0c6-jhpGpDXtpgmQT6Y5Y8V", // Ambil server key dari .env
  clientKey: "SB-Mid-client-9ZdGFrm-QivuCUjE"  // Ambil client key dari .env
});

// Fungsi untuk membuat transaksi Midtrans
exports.createTransaction = async (req, res) => {
  const userId = 1; // Simulasi user ID, ubah dengan user ID sebenarnya

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

    // Siapkan parameter transaksi untuk Midtrans
    const transactionDetails = {
      transaction_details: {
        order_id: 'order-id-nodejs-' + new Date().getTime(), // Buat ID unik untuk pesanan
        gross_amount: totalPrice
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: 'John', // Contoh data user, ubah dengan data sebenarnya
        last_name: 'Doe',
        email: 'john.doe@example.com', // Contoh email user, ubah dengan data sebenarnya
        phone: '+628123456789' // Contoh nomor telepon, ubah dengan data sebenarnya
      }
    };

    // Buat transaksi dengan Snap Midtrans
    const transaction = await snap.createTransaction(transactionDetails);

    // Simpan detail transaksi ke database jika diperlukan
    await Order.create({
      UserId: userId,
      totalItems,
      totalPrice,
      status: 'Pending', // Set status pesanan menjadi 'Pending' sampai pembayaran dikonfirmasi
      order_id: transactionDetails.transaction_details.order_id
    });

    // Redirect ke halaman pembayaran Midtrans
    res.redirect(transaction.redirect_url);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).send('Error creating transaction');
  }
};

// Fungsi untuk menangani notifikasi dari Midtrans
exports.handleNotification = async (req, res) => {
  try {
    // Buat instance dari midtransClient.Snap untuk memproses notifikasi
    const notification = req.body;

    // Ambil detail notifikasi dari Midtrans
    const statusResponse = await snap.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received for Order ID: ${orderId}`);
    console.log(`Transaction status: ${transactionStatus}`);
    console.log(`Fraud status: ${fraudStatus}`);

    // Temukan pesanan berdasarkan order_id
    const order = await Order.findOne({ where: { order_id: orderId } });

    if (order) {
      // Update status pesanan berdasarkan status transaksi dari Midtrans
      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          order.status = 'Challenge';
        } else if (fraudStatus === 'accept') {
          order.status = 'Paid';
        }
      } else if (transactionStatus === 'settlement') {
        order.status = 'Paid';
      } else if (transactionStatus === 'deny') {
        order.status = 'Deny';
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
        order.status = 'Canceled';
      } else if (transactionStatus === 'pending') {
        order.status = 'Pending';
      }

      // Simpan perubahan status pesanan
      await order.save();
    }

    res.status(200).send('Notification handled');
  } catch (error) {
    console.error('Error handling notification:', error);
    res.status(500).send('Error handling notification');
  }
};
