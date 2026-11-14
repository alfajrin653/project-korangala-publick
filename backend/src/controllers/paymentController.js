const midtransClient = require('midtrans-client');
const { User } = require('../models');
const { success, fail } = require('../utils/apiResponse');

// Inisialisasi Snap Midtrans
let snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createCitizenSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id; // Didapat dari middleware auth
    const user = await User.findByPk(userId);

    if (!user) return fail(res, 'User tidak ditemukan', 404);
    if (user.role !== 'free_user' && user.role !== 'reader') {
      return fail(res, 'Anda sudah menjadi member atau memiliki akses lebih tinggi.', 400);
    }

    // Buat ID Transaksi unik (misal: CITIZEN-12-169800000)
    const orderId = `CITIZEN-${user.id}-${Date.now()}`;
    const grossAmount = 150000; // Rp 150.000

    // Siapkan parameter tagihan untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone || '081322671045' // Midtrans butuh nomor HP
      },
      item_details: [{
        id: 'UPGRADE-CITIZEN',
        price: grossAmount,
        quantity: 1,
        name: 'Akses Citizen Journalist Seumur Hidup'
      }]
    };

    // Minta token Snap ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Kembalikan token ke Frontend agar bisa memunculkan pop-up pembayaran
    return success(res, {
      token: transaction.token,
      redirect_url: transaction.redirect_url
    }, 'Tagihan berhasil dibuat');

  } catch (error) {
    console.error('Midtrans Error:', error.message);
    return fail(res, 'Gagal membuat transaksi pembayaran', 500);
  }
};