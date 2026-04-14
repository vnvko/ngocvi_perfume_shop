// Router gốc — gộp tất cả routes vào /api
const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/admin', require('./admin.routes'));

// Store routes (orders, cart, reviews, blogs, wishlist, vouchers, banners, categories, brands)
router.use('/', require('./store.routes'));

// Health check — kèm ping MySQL để biết API có đọc được DB không
router.get('/health', async (req, res) => {
  const payload = {
    success: true,
    message: 'NGOCVI API is running',
    timestamp: new Date().toISOString(),
    database: 'unknown',
  };
  try {
    await db.query('SELECT 1 AS ok');
    payload.database = 'connected';
  } catch (err) {
    payload.database = 'error';
    payload.dbError = err.code || err.message;
    if (process.env.NODE_ENV === 'development') {
      payload.dbMessage = err.message;
    }
  }
  res.json(payload);
});

module.exports = router;
