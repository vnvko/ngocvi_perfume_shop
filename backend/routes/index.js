// Router gốc — gộp tất cả routes vào /api
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/admin', require('./admin.routes'));

// Store routes (orders, cart, reviews, blogs, wishlist, vouchers, banners, categories, brands)
router.use('/', require('./store.routes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'NGOCVI API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
