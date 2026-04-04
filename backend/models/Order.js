// Model Order — tạo đơn với transaction, trừ kho, lịch sử trạng thái
const db = require('../config/db');

const Order = {
  // Tạo đơn hàng mới
  async create({ user_id, items, shipping_address, payment_method = 'COD', shipping_fee = 0, discount = 0, voucher_id = null }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Tính tổng tiền
      let subtotal = 0;
      for (const item of items) {
        const [variants] = await conn.query(
          'SELECT price, stock FROM product_variants WHERE id = ? AND product_id = ?',
          [item.variant_id, item.product_id]
        );
        if (!variants.length) throw new Error(`Variant ${item.variant_id} không tồn tại`);
        if (variants[0].stock < item.quantity) throw new Error(`Sản phẩm không đủ tồn kho`);
        subtotal += variants[0].price * item.quantity;
        item._price = variants[0].price;
      }

      const total_price = subtotal + shipping_fee - discount;
      const order_code = 'NGV-' + Date.now();

      // Tạo order
      const [orderResult] = await conn.query(
        `INSERT INTO orders (user_id, order_code, total_price, shipping_fee, discount, payment_method, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [user_id, order_code, total_price, shipping_fee, discount, payment_method]
      );
      const orderId = orderResult.insertId;

      // Tạo order items + trừ tồn kho
      for (const item of items) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, variant_id, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.variant_id, item._price, item.quantity]
        );
        await conn.query(
          'UPDATE product_variants SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.variant_id]
        );
        // Ghi inventory log
        await conn.query(
          'INSERT INTO inventory_logs (product_id, variant_id, change_type, quantity) VALUES (?, ?, "export", ?)',
          [item.product_id, item.variant_id, item.quantity]
        );
      }

      // Ghi status history
      await conn.query(
        'INSERT INTO order_status_history (order_id, status) VALUES (?, "pending")',
        [orderId]
      );

      // Xóa giỏ hàng
      const [carts] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [user_id]);
      if (carts.length) {
        await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
      }

      // Ghi voucher usage nếu có
      if (voucher_id) {
        await conn.query(
          'INSERT INTO voucher_usage (voucher_id, user_id, order_id) VALUES (?, ?, ?)',
          [voucher_id, user_id, orderId]
        );
      }

      await conn.commit();
      return { orderId, order_code };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Lấy đơn hàng của user
  async getByUser(userId, { page = 1, limit = 10, status = '' } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['o.user_id = ?'];
    const params = [userId];
    if (status) { conditions.push('o.status = ?'); params.push(status); }

    const [rows] = await db.query(
      `SELECT o.id, o.order_code, o.total_price, o.shipping_fee, o.discount,
              o.payment_method, o.status, o.created_at,
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE ${conditions.join(' AND ')}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM orders o WHERE ${conditions.join(' AND ')}`,
      params
    );
    return { rows, total };
  },

  // Chi tiết đơn hàng
  async getDetail(orderId, userId = null) {
    const conditions = ['o.id = ?'];
    const params = [orderId];
    if (userId) { conditions.push('o.user_id = ?'); params.push(userId); }

    const [rows] = await db.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE ${conditions.join(' AND ')} LIMIT 1`,
      params
    );
    if (!rows.length) return null;

    const order = rows[0];

    // Order items
    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.slug as product_slug,
              pv.volume_ml, img.image_url as thumbnail
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_variants pv ON oi.variant_id = pv.id
       LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Status history
    const [history] = await db.query(
      'SELECT status, updated_at FROM order_status_history WHERE order_id = ? ORDER BY updated_at ASC',
      [orderId]
    );

    return { ...order, items, history };
  },

  // Cập nhật trạng thái (admin)
  async updateStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) throw new Error('Trạng thái không hợp lệ');

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    await db.query(
      'INSERT INTO order_status_history (order_id, status) VALUES (?, ?)',
      [orderId, status]
    );
    return true;
  },

  // Kiểm tra user có mua sản phẩm trong đơn hàng đã hoàn tất
  async hasPurchased(userId, productId) {
    const [rows] = await db.query(
      `SELECT 1 FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'completed'
       LIMIT 1`,
      [userId, productId]
    );
    return rows.length > 0;
  },

  // Lấy tất cả đơn hàng (admin)
  async adminGetAll({ search = '', status = '', payment = '', page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];

    if (search) {
      conditions.push('(o.order_code LIKE ? OR u.name LIKE ? OR u.phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) { conditions.push('o.status = ?'); params.push(status); }
    if (payment) { conditions.push('o.payment_method = ?'); params.push(payment); }

    const where = conditions.join(' AND ');
    const [rows] = await db.query(
      `SELECT o.id, o.order_code, o.total_price, o.payment_method, o.status, o.created_at,
              u.name as customer_name, u.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE ${where}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE ${where}`,
      params
    );
    return { rows, total };
  },
};

module.exports = Order;
