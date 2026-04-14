// Routes admin (yêu cầu auth + staff/admin role) — dashboard, products, orders, users, reviews, blog, chatbox, banners, vouchers
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { requireStaff, requireAdmin } = require('../middleware/role');
const upload = require('../middleware/upload');
const { success, error } = require('../utils/response');

const DashboardController = require('../controllers/admin/dashboard.controller');
const AdminProductController = require('../controllers/admin/product.admin.controller');
const {
  AdminOrderController,
  AdminUserController,
  AdminReviewController,
  AdminBlogController,
  AdminChatboxController,
  AdminBannerController,
} = require('../controllers/admin/admin.controller');

router.use(authenticate, requireStaff);

// ── Dashboard ──
router.get('/dashboard', DashboardController.getSummary);
router.get('/dashboard/revenue', DashboardController.getRevenue);
router.get('/dashboard/top-products', DashboardController.getTopProducts);
router.get('/dashboard/recent-orders', DashboardController.getRecentOrders);
router.get('/stats/orders-by-status', DashboardController.getOrdersByStatus);

// ── Products ──
router.get('/products', AdminProductController.getAll);
router.get('/products/:id', AdminProductController.getById);
router.post('/products', upload.array('images', 10), AdminProductController.create);
router.put('/products/:id', upload.array('images', 10), AdminProductController.update);
router.delete('/products/:id', requireAdmin, AdminProductController.delete);
router.delete('/products/:id/images/:imgId', AdminProductController.deleteImage);
router.put('/products/:id/images/:imgId/main', AdminProductController.setMainImage);
router.put('/products/:id/variants/:variantId', AdminProductController.updateVariant);
router.post('/products/:id/variants', AdminProductController.addVariant);

// ── Categories ──
router.get('/categories', AdminProductController.getCategories);
router.post('/categories', requireAdmin, AdminProductController.createCategory);
router.put('/categories/:id', AdminProductController.updateCategory);
router.delete('/categories/:id', requireAdmin, AdminProductController.deleteCategory);

// ── Brands ──
router.get('/brands', AdminProductController.getBrands);
router.post('/brands', upload.single('logo'), AdminProductController.createBrand);
router.put('/brands/:id', upload.single('logo'), AdminProductController.updateBrand);
router.delete('/brands/:id', requireAdmin, AdminProductController.deleteBrand);

// ── Inventory ──
router.get('/inventory', AdminProductController.getInventory);
router.put('/inventory/:variantId', AdminProductController.updateStock);

// ── Orders ──
router.get('/orders', AdminOrderController.getAll);
router.get('/orders/:id', AdminOrderController.getDetail);
router.put('/orders/:id/status', AdminOrderController.updateStatus);

// ── Users ──
router.get('/users', AdminUserController.getAll);
router.get('/users/:id', AdminUserController.getById);
router.put('/users/:id/status', requireAdmin, AdminUserController.updateStatus);
router.put('/users/:id/role', requireAdmin, AdminUserController.updateRole);
router.get('/roles', AdminUserController.getRoles);

// ── Reviews ──
router.get('/reviews', AdminReviewController.getAll);
router.put('/reviews/:id/status', AdminReviewController.updateStatus);
router.delete('/reviews/:id', requireAdmin, AdminReviewController.delete);

// ── Blog ──
router.get('/blogs', AdminBlogController.getAll);
router.get('/blogs/:id', AdminBlogController.getById);
router.post('/blogs', upload.single('thumbnail'), AdminBlogController.create);
router.put('/blogs/:id', upload.single('thumbnail'), AdminBlogController.update);
router.delete('/blogs/:id', requireAdmin, AdminBlogController.delete);

// ── Chatbox ──
router.get('/chatbox/conversations', AdminChatboxController.getConversations);
router.get('/chatbox/:conversationId/messages', AdminChatboxController.getMessages);
router.post('/chatbox/:conversationId/messages', AdminChatboxController.sendMessage);

// ── Banners ──
router.get('/banners', AdminBannerController.getAll);
router.post('/banners', upload.single('image'), AdminBannerController.create);
router.put('/banners/:id', upload.single('image'), AdminBannerController.update);
router.delete('/banners/:id', requireAdmin, AdminBannerController.delete);

// ── Vouchers (một bộ route duy nhất, có used_count) ──
router.get('/vouchers', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = `
      SELECT v.*,
        (SELECT COUNT(*) FROM voucher_usage vu WHERE vu.voucher_id = v.id) AS used_count
      FROM vouchers v`;
    const params = [];
    if (search) {
      sql += ' WHERE v.code LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY v.id DESC';
    const [rows] = await db.query(sql, params);
    return success(res, { vouchers: rows });
  } catch {
    return error(res, 'Lỗi lấy danh sách voucher');
  }
});

router.post('/vouchers', requireAdmin, async (req, res) => {
  try {
    const {
      code,
      discount_type = 'percent',
      discount_value,
      max_discount,
      min_order_value,
      quantity,
      start_date,
      end_date,
    } = req.body;
    if (!code || discount_value === undefined || discount_value === '') {
      return error(res, 'Thiếu mã hoặc giá trị giảm giá', 400);
    }
    const codeNorm = String(code).trim().toUpperCase();
    const [r] = await db.query(
      `INSERT INTO vouchers (code, discount_type, discount_value, max_discount, min_order_value, quantity, start_date, end_date)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        codeNorm,
        discount_type,
        discount_value,
        max_discount || null,
        min_order_value ?? 0,
        quantity ?? 100,
        start_date || null,
        end_date || null,
      ]
    );
    return success(res, { id: r.insertId }, 'Tạo voucher thành công', 201);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return error(res, 'Mã voucher đã tồn tại', 409);
    return error(res, 'Lỗi tạo voucher');
  }
});

router.put('/vouchers/:id', requireAdmin, async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      max_discount,
      min_order_value,
      quantity,
      start_date,
      end_date,
    } = req.body;
    if (!code || discount_value === undefined || discount_value === '') {
      return error(res, 'Thiếu mã hoặc giá trị giảm giá', 400);
    }
    const codeNorm = String(code).trim().toUpperCase();
    await db.query(
      `UPDATE vouchers SET code=?, discount_type=?, discount_value=?, max_discount=?, min_order_value=?, quantity=?, start_date=?, end_date=?
       WHERE id=?`,
      [
        codeNorm,
        discount_type,
        discount_value,
        max_discount || null,
        min_order_value ?? 0,
        quantity ?? 100,
        start_date || null,
        end_date || null,
        req.params.id,
      ]
    );
    return success(res, null, 'Cập nhật voucher thành công');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return error(res, 'Mã voucher đã tồn tại', 409);
    return error(res, 'Lỗi cập nhật voucher');
  }
});

router.delete('/vouchers/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM vouchers WHERE id=?', [req.params.id]);
    return success(res, null, 'Đã xóa voucher');
  } catch {
    return error(res, 'Lỗi xóa voucher');
  }
});

module.exports = router;
