// Models gộp — Category, Brand, Cart, Review, Blog, Wishlist, Voucher, Banner
const db = require('../config/db');
const { unlinkUploadUrl } = require('../utils/fileStorage');

async function attachReviewMediaToRows(rows) {
  if (!rows?.length) return;
  try {
    const ids = rows.map((r) => r.id);
    const [mediaRows] = await db.query(
      'SELECT review_id, id, media_type, file_url, sort_order FROM review_media WHERE review_id IN (?) ORDER BY review_id, sort_order',
      [ids]
    );
    const map = {};
    for (const m of mediaRows) {
      if (!map[m.review_id]) map[m.review_id] = [];
      map[m.review_id].push({ id: m.id, media_type: m.media_type, file_url: m.file_url });
    }
    for (const r of rows) r.media = map[r.id] || [];
  } catch (e) {
    if (e.code === 'ER_NO_SUCH_TABLE') for (const r of rows) r.media = [];
    else throw e;
  }
}

const Category = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.slug, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
       GROUP BY c.id, c.name, c.slug
       ORDER BY c.name`
    );
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ name, slug }) {
    const [r] = await db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    return r.insertId;
  },
  async update(id, { name, slug }) {
    await db.query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    return true;
  },
  async delete(id) {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return true;
  },
};

const Brand = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT b.id, b.name, b.slug, b.logo, b.description, COUNT(p.id) AS product_count
       FROM brands b
       LEFT JOIN products p ON p.brand_id = b.id AND p.status = 'active'
       GROUP BY b.id, b.name, b.slug, b.logo, b.description
       ORDER BY b.name`
    );
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ name, slug, logo, description }) {
    const [r] = await db.query(
      'INSERT INTO brands (name, slug, logo, description) VALUES (?, ?, ?, ?)',
      [name, slug, logo, description]
    );
    return r.insertId;
  },
  async update(id, fields) {
    const allowed = ['name', 'slug', 'logo', 'description'];
    const updates = [], values = [];
    for (const k of allowed) {
      if (fields[k] !== undefined) { updates.push(`${k} = ?`); values.push(fields[k]); }
    }
    if (!updates.length) return false;
    values.push(id);
    await db.query(`UPDATE brands SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },
  async delete(id) {
    await db.query('DELETE FROM brands WHERE id = ?', [id]);
    return true;
  },
};

const Cart = {
  // Lấy hoặc tạo cart của user
  async getOrCreate(userId) {
    let [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (!carts.length) {
      const [r] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      return r.insertId;
    }
    return carts[0].id;
  },

  async getItems(userId) {
    const cartId = await Cart.getOrCreate(userId);
    const [items] = await db.query(
      `SELECT ci.id, ci.quantity, ci.variant_id, ci.product_id,
              p.name, p.slug, pv.volume_ml, pv.price, pv.stock,
              img.image_url as thumbnail, b.name as brand_name
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       LEFT JOIN product_images img ON img.id = (
         SELECT pi.id
         FROM product_images pi
         WHERE pi.product_id = p.id
         ORDER BY pi.is_main DESC, pi.id ASC
         LIMIT 1
       )
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return items;
  },

  async addItem(userId, { product_id, variant_id, quantity = 1 }) {
    const cartId = await Cart.getOrCreate(userId);
    // Kiểm tra tồn tại
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND variant_id = ?',
      [cartId, product_id, variant_id]
    );
    if (existing.length) {
      await db.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, product_id, variant_id, quantity]
      );
    }
    return true;
  },

  async updateItem(userId, itemId, quantity) {
    const cartId = await Cart.getOrCreate(userId);
    if (quantity <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cartId]);
    } else {
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?', [quantity, itemId, cartId]);
    }
    return true;
  },

  async removeItem(userId, itemId) {
    const cartId = await Cart.getOrCreate(userId);
    await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cartId]);
    return true;
  },

  async clear(userId) {
    const cartId = await Cart.getOrCreate(userId);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    return true;
  },
};

const Review = {
  async getByProduct(productId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.name as user_name, u.avatar as user_avatar
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? AND r.status = 'visible'
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, parseInt(limit), offset]
    );
    await attachReviewMediaToRows(rows);
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) as total FROM reviews WHERE product_id = ? AND status = 'visible'",
      [productId]
    );
    const [[stats]] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = ? AND status = 'visible'",
      [productId]
    );
    return { rows, total, avg_rating: parseFloat(stats.avg_rating || 0).toFixed(1) };
  },

  async hasUserReviewed(user_id, product_id) {
    const [rows] = await db.query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1',
      [user_id, product_id]
    );
    return rows.length > 0;
  },

  /** mediaItems: { file_url, media_type }[] — image | video */
  async create({ user_id, product_id, rating, comment, mediaItems = [] }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [existing] = await conn.query(
        'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
        [user_id, product_id]
      );
      if (existing.length) {
        await conn.rollback();
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
      }
      const [r] = await conn.query(
        "INSERT INTO reviews (user_id, product_id, rating, comment, status) VALUES (?, ?, ?, ?, 'visible')",
        [user_id, product_id, rating, comment]
      );
      const reviewId = r.insertId;
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        await conn.query(
          'INSERT INTO review_media (review_id, media_type, file_url, sort_order) VALUES (?, ?, ?, ?)',
          [reviewId, item.media_type, item.file_url, i]
        );
      }
      await conn.commit();
      return reviewId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async adminGetAll({ search = '', minRating, maxRating, page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];
    if (search) {
      conditions.push('(p.name LIKE ? OR u.name LIKE ? OR r.comment LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (minRating) { conditions.push('r.rating >= ?'); params.push(minRating); }
    if (maxRating) { conditions.push('r.rating <= ?'); params.push(maxRating); }
    const where = conditions.join(' AND ');
    const [rows] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.status, r.created_at,
              u.name as user_name, p.name as product_name,
              img.image_url as product_thumbnail
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       LEFT JOIN product_images img ON img.id = (
         SELECT pi.id
         FROM product_images pi
         WHERE pi.product_id = p.id
         ORDER BY pi.is_main DESC, pi.id ASC
         LIMIT 1
       )
       WHERE ${where}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    await attachReviewMediaToRows(rows);
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       WHERE ${where}`,
      params
    );
    return { rows, total };
  },

  async updateStatus(id, status) {
    await db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    return true;
  },

  async delete(id) {
    try {
      const [media] = await db.query('SELECT file_url FROM review_media WHERE review_id = ?', [id]);
      for (const m of media) unlinkUploadUrl(m.file_url);
    } catch (e) {
      if (e.code !== 'ER_NO_SUCH_TABLE') throw e;
    }
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    return true;
  },
};

const Blog = {
  async getAll({ search = '', category = '', status = '', page = 1, limit = 9, onlyPublished = false } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];
    if (onlyPublished) conditions.push("b.status = 'published'");
    else if (status) { conditions.push('b.status = ?'); params.push(status); }
    if (search) { conditions.push('b.title LIKE ?'); params.push(`%${search}%`); }
    if (category) { conditions.push('(bc.slug = ? OR bc.id = ?)'); params.push(category, category); }
    const where = conditions.join(' AND ');
    const [rows] = await db.query(
      `SELECT b.id, b.title, b.slug, b.thumbnail, b.status, b.created_at,
              bc.name as category_name, bc.slug as category_slug,
              u.name as author_name
       FROM blogs b
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       LEFT JOIN users u ON b.author_id = u.id
       WHERE ${where}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM blogs b
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       WHERE ${where}`,
      params
    );
    return { rows, total };
  },

  async getBySlug(slug, { onlyPublished = false } = {}) {
    let sql = `SELECT b.*, bc.name as category_name, bc.slug as category_slug, u.name as author_name
       FROM blogs b
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       LEFT JOIN users u ON b.author_id = u.id
       WHERE b.slug = ?`;
    const params = [slug];
    if (onlyPublished) sql += " AND b.status = 'published'";
    sql += ' LIMIT 1';
    const [rows] = await db.query(sql, params);
    return rows[0] || null;
  },

  async create({ title, slug, content, author_id, category_id, thumbnail, status = 'published' }) {
    const st = ['published', 'draft', 'hidden'].includes(status) ? status : 'published';
    const [r] = await db.query(
      'INSERT INTO blogs (title, slug, content, author_id, category_id, thumbnail, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, author_id, category_id, thumbnail, st]
    );
    return r.insertId;
  },

  async update(id, fields) {
    const allowed = ['title', 'slug', 'content', 'category_id', 'thumbnail', 'status'];
    const updates = [], values = [];
    for (const k of allowed) {
      if (fields[k] !== undefined) { updates.push(`${k} = ?`); values.push(fields[k]); }
    }
    if (!updates.length) return false;
    values.push(id);
    await db.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async delete(id) {
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    return true;
  },

  async getCategories() {
    const [rows] = await db.query('SELECT * FROM blog_categories ORDER BY name');
    return rows;
  },
};

const Wishlist = {
  async getByUser(userId) {
    const [rows] = await db.query(
      `SELECT w.id, w.created_at, p.id as product_id, p.name, p.slug, p.price, p.sale_price,
              b.name as brand_name, img.image_url as thumbnail
       FROM wishlists w
       LEFT JOIN products p ON w.product_id = p.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN product_images img ON img.id = (
         SELECT pi.id
         FROM product_images pi
         WHERE pi.product_id = p.id
         ORDER BY pi.is_main DESC, pi.id ASC
         LIMIT 1
       )
       WHERE w.user_id = ? ORDER BY w.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async toggle(userId, productId) {
    const [existing] = await db.query(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    if (existing.length) {
      await db.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
      return { added: false };
    } else {
      await db.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      return { added: true };
    }
  },
};

const Voucher = {
  async _loadValid(whereSql, params) {
    const [rows] = await db.query(
      `SELECT v.* FROM vouchers v
       WHERE ${whereSql}
         AND v.start_date <= NOW()
         AND (v.end_date IS NULL OR v.end_date >= NOW())
         AND v.quantity > 0
       LIMIT 1`,
      params
    );
    return rows[0] || null;
  },

  _discountForOrder(voucher, orderValue) {
    const min = Number(voucher.min_order_value) || 0;
    if (orderValue < min) {
      throw new Error(`Đơn hàng tối thiểu ${min.toLocaleString('vi-VN')}đ để dùng mã này`);
    }
    let discountAmount = 0;
    if (voucher.discount_type === 'percent') {
      discountAmount = (orderValue * Number(voucher.discount_value)) / 100;
      if (voucher.max_discount != null && discountAmount > Number(voucher.max_discount)) {
        discountAmount = Number(voucher.max_discount);
      }
    } else {
      discountAmount = Number(voucher.discount_value);
    }
    return discountAmount;
  },

  async check(code, userId, orderValue) {
    const voucher = await Voucher._loadValid('v.code = ?', [String(code).trim()]);
    if (!voucher) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');

    const [used] = await db.query(
      'SELECT id FROM voucher_usage WHERE voucher_id = ? AND user_id = ?',
      [voucher.id, userId]
    );
    if (used.length) throw new Error('Bạn đã sử dụng mã này rồi');

    const discountAmount = Voucher._discountForOrder(voucher, orderValue);
    return { voucher, discountAmount };
  },

  /** Dùng khi đặt hàng: frontend gửi voucher_id sau bước check mã */
  async validateById(voucherId, userId, orderValue) {
    const id = parseInt(voucherId, 10);
    if (!id) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    const voucher = await Voucher._loadValid('v.id = ?', [id]);
    if (!voucher) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');

    const [used] = await db.query(
      'SELECT id FROM voucher_usage WHERE voucher_id = ? AND user_id = ?',
      [voucher.id, userId]
    );
    if (used.length) throw new Error('Bạn đã sử dụng mã này rồi');

    const discountAmount = Voucher._discountForOrder(voucher, orderValue);
    return { voucher, discountAmount };
  },
};

const Banner = {
  async getActive() {
    const [rows] = await db.query('SELECT * FROM banners WHERE status = 1 ORDER BY id DESC');
    return rows;
  },
};

module.exports = { Category, Brand, Cart, Review, Blog, Wishlist, Voucher, Banner };
