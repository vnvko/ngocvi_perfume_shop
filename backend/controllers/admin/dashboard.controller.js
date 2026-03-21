// Admin Controller Dashboard — thống kê KPI, doanh thu, top sản phẩm, đơn gần đây
const db = require('../../config/db');
const { success, error } = require('../../utils/response');

const DashboardController = {
  // GET /api/admin/dashboard
  async getSummary(req, res) {
    try {
      const [[products]] = await db.query(
        "SELECT COUNT(*) as total FROM products WHERE status = 'active'"
      );
      const [[orders]] = await db.query(
        "SELECT COUNT(*) as total, SUM(total_price) as revenue FROM orders WHERE DATE(created_at) = CURDATE()"
      );
      const [[ordersAll]] = await db.query(
        "SELECT COUNT(*) as total, SUM(total_price) as revenue FROM orders WHERE status != 'cancelled'"
      );
      const [[users]] = await db.query(
        "SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()"
      );

      return success(res, {
        stats: {
          total_products: products.total,
          orders_today: orders.total,
          revenue_today: orders.revenue || 0,
          new_users_today: users.total,
          total_orders: ordersAll.total,
          total_revenue: ordersAll.revenue || 0,
        },
      });
    } catch (err) {
      console.error('Dashboard summary error:', err);
      return error(res, 'Lỗi lấy thống kê');
    }
  },

  // GET /api/admin/dashboard/revenue?period=30
  async getRevenue(req, res) {
    try {
      const period = parseInt(req.query.period) || 30;
      const [rows] = await db.query(
        `SELECT DATE(created_at) as date,
                SUM(total_price) as revenue,
                COUNT(*) as orders
         FROM orders
         WHERE status != 'cancelled'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [period]
      );
      return success(res, { revenue: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy dữ liệu doanh thu');
    }
  },

  // GET /api/admin/dashboard/top-products
  async getTopProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const [rows] = await db.query(
        `SELECT p.id, p.name, p.slug, img.image_url as thumbnail,
                b.name as brand_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.quantity * oi.price) as total_revenue
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         LEFT JOIN brands b ON p.brand_id = b.id
         LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
         LEFT JOIN orders o ON oi.order_id = o.id
         WHERE o.status != 'cancelled'
         GROUP BY p.id
         ORDER BY total_sold DESC
         LIMIT ?`,
        [limit]
      );
      return success(res, { top_products: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy sản phẩm bán chạy');
    }
  },

  // GET /api/admin/dashboard/recent-orders
  async getRecentOrders(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const [rows] = await db.query(
        `SELECT o.id, o.order_code, o.total_price, o.status, o.payment_method, o.created_at,
                u.name as customer_name, u.phone as customer_phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC
         LIMIT ?`,
        [limit]
      );
      return success(res, { orders: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy đơn hàng gần đây');
    }
  },

  // GET /api/admin/stats/orders-by-status?period=30
  async getOrdersByStatus(req, res) {
    try {
      const period = parseInt(req.query.period) || 30;
      const [rows] = await db.query(
        `SELECT status, COUNT(*) as count, SUM(total_price) as revenue
         FROM orders
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY status`,
        [period]
      );
      return success(res, { stats: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy thống kê đơn hàng');
    }
  },
};

module.exports = DashboardController;
