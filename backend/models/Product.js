// Model Product — getAll với filter/sort/paginate, getBySlug, adminGetAll
const db = require('../config/db');
const slugify = require('slugify');

const Product = {
  // Lấy danh sách sản phẩm với filter, sort, pagination
  async getAll({ search = '', category = '', brand = '', gender = '', minPrice, maxPrice, sort = 'newest', page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['p.status = "active"'];
    const params = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR b.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push('(c.slug = ? OR c.id = ?)');
      params.push(category, category);
    }
    if (brand) {
      conditions.push('(b.slug = ? OR b.id = ?)');
      params.push(brand, brand);
    }
    if (gender) {
      conditions.push('p.gender = ?');
      params.push(gender);
    }
    if (minPrice) { conditions.push('p.price >= ?'); params.push(minPrice); }
    if (maxPrice) { conditions.push('p.price <= ?'); params.push(maxPrice); }

    const where = conditions.join(' AND ');
    const orderMap = {
      newest: 'p.created_at DESC',
      'price-asc': 'p.price ASC',
      'price-desc': 'p.price DESC',
      rating: 'avg_rating DESC',
      popular: 'p.created_at DESC',
    };
    const orderBy = orderMap[sort] || 'p.created_at DESC';

    const [rows] = await db.query(
      `SELECT p.id, p.name, p.slug, p.gender, p.price, p.sale_price, p.concentration, p.status,
              b.name as brand_name, b.slug as brand_slug,
              c.name as category_name, c.slug as category_slug,
              img.image_url as thumbnail,
              COALESCE(AVG(r.rating), 0) as avg_rating,
              COUNT(DISTINCT r.id) as review_count,
              MIN(pv.stock) as min_stock
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
       LEFT JOIN reviews r ON r.product_id = p.id AND r.status = 'visible'
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       WHERE ${where}
       GROUP BY p.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${where}`,
      params
    );

    return { rows, total };
  },

  // Lấy chi tiết sản phẩm theo slug
  async getBySlug(slug) {
    const [rows] = await db.query(
      `SELECT p.*, b.name as brand_name, b.slug as brand_slug,
              c.name as category_name, c.slug as category_slug,
              COALESCE(AVG(r.rating), 0) as avg_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON r.product_id = p.id AND r.status = 'visible'
       WHERE p.slug = ? AND p.status = 'active'
       GROUP BY p.id LIMIT 1`,
      [slug]
    );
    if (!rows.length) return null;

    const product = rows[0];

    // Lấy ảnh
    const [images] = await db.query(
      'SELECT id, image_url, is_main FROM product_images WHERE product_id = ? ORDER BY is_main DESC',
      [product.id]
    );

    // Lấy variants (dung tích + giá + tồn kho)
    const [variants] = await db.query(
      'SELECT id, volume_ml, price, stock FROM product_variants WHERE product_id = ? ORDER BY volume_ml ASC',
      [product.id]
    );

    // Lấy tags
    const [tags] = await db.query(
      `SELECT pt.name FROM product_tags pt
       JOIN product_tag_map ptm ON pt.id = ptm.tag_id
       WHERE ptm.product_id = ?`,
      [product.id]
    );

    return { ...product, images, variants, tags: tags.map(t => t.name) };
  },

  // Lấy sản phẩm theo id
  async getById(id) {
    const [rows] = await db.query(
      `SELECT p.*, b.name as brand_name, c.name as category_name
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  // Sản phẩm liên quan
  async getRelated(productId, categoryId, brandId, limit = 4) {
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.slug, p.price, p.sale_price,
              b.name as brand_name, img.image_url as thumbnail,
              COALESCE(AVG(r.rating), 0) as avg_rating
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
       LEFT JOIN reviews r ON r.product_id = p.id AND r.status = 'visible'
       WHERE p.id != ? AND p.status = 'active'
         AND (p.category_id = ? OR p.brand_id = ?)
       GROUP BY p.id
       ORDER BY RAND()
       LIMIT ?`,
      [productId, categoryId, brandId, limit]
    );
    return rows;
  },

  // Tạo sản phẩm (admin)
  async create({ name, brand_id, category_id, description, gender, concentration, price, sale_price }) {
    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' }) + '-' + Date.now();
    const [result] = await db.query(
      `INSERT INTO products (name, slug, brand_id, category_id, description, gender, concentration, price, sale_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [name, slug, brand_id, category_id, description, gender, concentration, price, sale_price || null]
    );
    return result.insertId;
  },

  // Cập nhật sản phẩm (admin)
  async update(id, fields) {
    const allowed = ['name', 'brand_id', 'category_id', 'description', 'gender', 'concentration', 'price', 'sale_price', 'status'];
    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }
    if (!updates.length) return false;
    values.push(id);
    await db.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },

  // Xóa sản phẩm (soft delete)
  async delete(id) {
    await db.query('UPDATE products SET status = "inactive" WHERE id = ?', [id]);
    return true;
  },

  // Tìm kiếm (admin)
  async adminGetAll({ search = '', category = '', brand = '', status = '', page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR b.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) { conditions.push('c.id = ?'); params.push(category); }
    if (brand) { conditions.push('b.id = ?'); params.push(brand); }
    if (status) { conditions.push('p.status = ?'); params.push(status); }

    const where = conditions.join(' AND ');
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.slug, p.price, p.sale_price, p.status, p.gender, p.created_at,
              b.name as brand_name, c.name as category_name,
              img.image_url as thumbnail,
              COALESCE(SUM(pv.stock), 0) as total_stock,
              COALESCE((SELECT SUM(oi.quantity) FROM order_items oi
                        JOIN orders o ON o.id = oi.order_id
                        WHERE oi.product_id = p.id AND o.status = 'completed'), 0) as total_sold
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       WHERE ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${where}`,
      params
    );
    return { rows, total };
  },
};

module.exports = Product;
