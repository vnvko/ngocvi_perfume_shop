// Routes store — banners, categories, brands, orders, cart, reviews, blog, wishlist, voucher, chatbox
const express = require('express');
const router = express.Router();
const {
  OrderController, CartController, ReviewController,
  BlogController, WishlistController, VoucherController, BannerController,
} = require('../controllers/store.controller');
const ProductController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth');

// ── Banners ──
router.get('/banners', BannerController.getActive);

// ── Categories & Brands ──
router.get('/categories', ProductController.getCategories);
router.get('/brands', ProductController.getBrands);

// ── Orders (cần đăng nhập) ──
router.post('/orders', authenticate, OrderController.create);
router.get('/orders', authenticate, OrderController.getMyOrders);
router.get('/orders/:id', authenticate, OrderController.getDetail);
router.put('/orders/:id/cancel', authenticate, OrderController.cancel);

// ── Cart (cần đăng nhập) ──
router.get('/cart', authenticate, CartController.getCart);
router.post('/cart', authenticate, CartController.addItem);
router.put('/cart/:itemId', authenticate, CartController.updateItem);
router.delete('/cart/:itemId', authenticate, CartController.removeItem);
router.delete('/cart', authenticate, CartController.clearCart);

// ── Reviews ──
router.get('/reviews/:productId', ReviewController.getByProduct);
router.post('/reviews', authenticate, ReviewController.create);

// ── Blog ──
router.get('/blogs', BlogController.getAll);
router.get('/blogs/:slug', BlogController.getBySlug);

// ── Wishlist (cần đăng nhập) ──
router.get('/wishlist', authenticate, WishlistController.getWishlist);
router.post('/wishlist', authenticate, WishlistController.toggle);

// ── Voucher ──
router.post('/vouchers/check', authenticate, VoucherController.check);

module.exports = router;

// ── Chatbox (user) ──
// POST /api/conversations — tạo/lấy conversation hiện tại của user
router.post('/conversations', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    let [rows] = await db.query(
      'SELECT id FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
    if (!rows.length) {
      const [r] = await db.query('INSERT INTO conversations (user_id) VALUES (?)', [req.user.id]);
      return success(res, { id: r.insertId }, 'Conversation created', 201);
    }
    return success(res, { id: rows[0].id });
  } catch (err) {
    return error(res, 'Lỗi tạo hội thoại');
  }
});

// POST /api/conversations/:id/messages — user gửi tin
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    const { message, sender_type = 'user' } = req.body;
    if (!message) return error(res, 'Tin nhắn không được trống', 400);
    const [r] = await db.query(
      'INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, ?, ?)',
      [req.params.id, sender_type, message]
    );
    return success(res, { id: r.insertId }, 'Tin nhắn đã gửi', 201);
  } catch (err) {
    return error(res, 'Lỗi gửi tin nhắn');
  }
});

// ── Addresses ──
router.get('/addresses', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    const [rows] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC',
      [req.user.id]
    );
    return success(res, { addresses: rows });
  } catch { return error(res, 'Lỗi lấy địa chỉ'); }
});

router.post('/addresses', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    const { receiver_name, phone, province, district, ward, address_detail, is_default } = req.body;
    if (is_default) await db.query('UPDATE addresses SET is_default=0 WHERE user_id=?', [req.user.id]);
    const [r] = await db.query(
      'INSERT INTO addresses (user_id, receiver_name, phone, province, district, ward, address_detail, is_default) VALUES (?,?,?,?,?,?,?,?)',
      [req.user.id, receiver_name, phone, province, district, ward, address_detail, is_default ? 1 : 0]
    );
    return success(res, { id: r.insertId }, 'Thêm địa chỉ thành công', 201);
  } catch { return error(res, 'Lỗi thêm địa chỉ'); }
});

router.put('/addresses/:id', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    const { receiver_name, phone, province, district, ward, address_detail, is_default } = req.body;
    if (is_default) await db.query('UPDATE addresses SET is_default=0 WHERE user_id=?', [req.user.id]);
    await db.query(
      'UPDATE addresses SET receiver_name=?,phone=?,province=?,district=?,ward=?,address_detail=?,is_default=? WHERE id=? AND user_id=?',
      [receiver_name, phone, province, district, ward, address_detail, is_default ? 1 : 0, req.params.id, req.user.id]
    );
    return success(res, null, 'Cập nhật địa chỉ thành công');
  } catch { return error(res, 'Lỗi cập nhật địa chỉ'); }
});

router.delete('/addresses/:id', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    await db.query('DELETE FROM addresses WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    return success(res, null, 'Xóa địa chỉ thành công');
  } catch { return error(res, 'Lỗi xóa địa chỉ'); }
});

router.patch('/addresses/:id/default', authenticate, async (req, res) => {
  const db = require('../config/db');
  const { success, error } = require('../utils/response');
  try {
    await db.query('UPDATE addresses SET is_default=0 WHERE user_id=?', [req.user.id]);
    await db.query('UPDATE addresses SET is_default=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    return success(res, null, 'Đã đặt địa chỉ mặc định');
  } catch { return error(res, 'Lỗi cập nhật mặc định'); }
});
