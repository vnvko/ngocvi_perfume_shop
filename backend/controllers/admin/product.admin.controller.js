// Admin Controller sản phẩm — CRUD, variants, ảnh, danh mục, thương hiệu, kho
const Product = require('../../models/Product');
const { Category, Brand } = require('../../models/index');
const db = require('../../config/db');
const slugify = require('slugify');
const { success, error, paginate } = require('../../utils/response');

const AdminProductController = {
  // GET /api/admin/products
  async getAll(req, res) {
    try {
      const { search, category, brand, status, page = 1, limit = 10 } = req.query;
      const { rows, total } = await Product.adminGetAll({ search, category, brand, status, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      console.error('Admin getAll products error:', err);
      return error(res, 'Lỗi lấy danh sách sản phẩm');
    }
  },

  // GET /api/admin/products/:id
  async getById(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return error(res, 'Không tìm thấy sản phẩm', 404);

      const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [product.id]);
      const [variants] = await db.query('SELECT * FROM product_variants WHERE product_id = ? ORDER BY volume_ml', [product.id]);
      return success(res, { product: { ...product, images, variants } });
    } catch (err) {
      return error(res, 'Lỗi lấy sản phẩm');
    }
  },

  // POST /api/admin/products
  async create(req, res) {
    try {
      const { name, brand_id, category_id, description, gender, concentration, price, sale_price, variants } = req.body;
      if (!name || !price) return error(res, 'Thiếu thông tin bắt buộc', 400);

      const productId = await Product.create({ name, brand_id, category_id, description, gender, concentration, price, sale_price });

      // Thêm variants
      if (variants && variants.length) {
        for (const v of variants) {
          await db.query(
            'INSERT INTO product_variants (product_id, volume_ml, price, stock) VALUES (?, ?, ?, ?)',
            [productId, v.volume_ml, v.price || price, v.stock || 0]
          );
        }
      }

      // Thêm ảnh nếu upload
      if (req.files && req.files.length) {
        for (let i = 0; i < req.files.length; i++) {
          await db.query(
            'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
            [productId, `/uploads/products/${req.files[i].filename}`, i === 0 ? 1 : 0]
          );
        }
      }

      return success(res, { id: productId }, 'Tạo sản phẩm thành công', 201);
    } catch (err) {
      console.error('Admin create product error:', err);
      return error(res, 'Lỗi tạo sản phẩm');
    }
  },

  // PUT /api/admin/products/:id
  async update(req, res) {
    try {
      const { name, brand_id, category_id, description, gender, concentration, price, sale_price, status } = req.body;
      await Product.update(req.params.id, { name, brand_id, category_id, description, gender, concentration, price, sale_price, status });

      // Xử lý ảnh mới nếu có
      if (req.files && req.files.length) {
        for (let i = 0; i < req.files.length; i++) {
          await db.query(
            'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, 0)',
            [req.params.id, `/uploads/products/${req.files[i].filename}`]
          );
        }
      }

      return success(res, null, 'Cập nhật sản phẩm thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật sản phẩm');
    }
  },

  // DELETE /api/admin/products/:id (soft delete)
  async delete(req, res) {
    try {
      await Product.delete(req.params.id);
      return success(res, null, 'Đã ẩn sản phẩm');
    } catch (err) {
      return error(res, 'Lỗi xóa sản phẩm');
    }
  },

  // DELETE /api/admin/products/:id/images/:imgId
  async deleteImage(req, res) {
    try {
      await db.query('DELETE FROM product_images WHERE id = ? AND product_id = ?', [req.params.imgId, req.params.id]);
      return success(res, null, 'Đã xóa ảnh');
    } catch (err) {
      return error(res, 'Lỗi xóa ảnh');
    }
  },

  // PUT /api/admin/products/:id/images/:imgId/main
  async setMainImage(req, res) {
    try {
      await db.query('UPDATE product_images SET is_main = 0 WHERE product_id = ?', [req.params.id]);
      await db.query('UPDATE product_images SET is_main = 1 WHERE id = ? AND product_id = ?', [req.params.imgId, req.params.id]);
      return success(res, null, 'Đã đặt ảnh chính');
    } catch (err) {
      return error(res, 'Lỗi cập nhật ảnh chính');
    }
  },

  // PUT /api/admin/products/:id/variants/:variantId
  async updateVariant(req, res) {
    try {
      const { volume_ml, price, stock } = req.body;
      await db.query(
        'UPDATE product_variants SET volume_ml = ?, price = ?, stock = ? WHERE id = ? AND product_id = ?',
        [volume_ml, price, stock, req.params.variantId, req.params.id]
      );
      return success(res, null, 'Cập nhật variant thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật variant');
    }
  },

  // POST /api/admin/products/:id/variants
  async addVariant(req, res) {
    try {
      const { volume_ml, price, stock } = req.body;
      const [r] = await db.query(
        'INSERT INTO product_variants (product_id, volume_ml, price, stock) VALUES (?, ?, ?, ?)',
        [req.params.id, volume_ml, price, stock || 0]
      );
      return success(res, { id: r.insertId }, 'Thêm variant thành công', 201);
    } catch (err) {
      return error(res, 'Lỗi thêm variant');
    }
  },

  // Quản lý danh mục
  async getCategories(req, res) {
    try {
      const categories = await Category.getAll();
      return success(res, { categories });
    } catch (err) { return error(res, 'Lỗi lấy danh mục'); }
  },
  async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) return error(res, 'Thiếu tên danh mục', 400);
      const slug = slugify(name, { lower: true, strict: true });
      const id = await Category.create({ name, slug });
      return success(res, { id }, 'Tạo danh mục thành công', 201);
    } catch (err) { return error(res, 'Lỗi tạo danh mục'); }
  },
  async updateCategory(req, res) {
    try {
      const { name } = req.body;
      const slug = slugify(name, { lower: true, strict: true });
      await Category.update(req.params.id, { name, slug });
      return success(res, null, 'Cập nhật danh mục thành công');
    } catch (err) { return error(res, 'Lỗi cập nhật danh mục'); }
  },
  async deleteCategory(req, res) {
    try {
      await Category.delete(req.params.id);
      return success(res, null, 'Đã xóa danh mục');
    } catch (err) { return error(res, 'Lỗi xóa danh mục'); }
  },

  // Quản lý thương hiệu
  async getBrands(req, res) {
    try {
      const brands = await Brand.getAll();
      return success(res, { brands });
    } catch (err) { return error(res, 'Lỗi lấy thương hiệu'); }
  },
  async createBrand(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) return error(res, 'Thiếu tên thương hiệu', 400);
      const slug = slugify(name, { lower: true, strict: true });
      const logo = req.file ? `/uploads/brands/${req.file.filename}` : null;
      const id = await Brand.create({ name, slug, logo, description });
      return success(res, { id }, 'Tạo thương hiệu thành công', 201);
    } catch (err) { return error(res, 'Lỗi tạo thương hiệu'); }
  },
  async updateBrand(req, res) {
    try {
      const { name, description } = req.body;
      const slug = name ? slugify(name, { lower: true, strict: true }) : undefined;
      const logo = req.file ? `/uploads/brands/${req.file.filename}` : undefined;
      await Brand.update(req.params.id, { name, slug, logo, description });
      return success(res, null, 'Cập nhật thương hiệu thành công');
    } catch (err) { return error(res, 'Lỗi cập nhật thương hiệu'); }
  },
  async deleteBrand(req, res) {
    try {
      await Brand.delete(req.params.id);
      return success(res, null, 'Đã xóa thương hiệu');
    } catch (err) { return error(res, 'Lỗi xóa thương hiệu'); }
  },

  // Quản lý kho (inventory)
  async getInventory(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;
      const conditions = search ? ['(p.name LIKE ? OR pv.id LIKE ?)'] : ['1=1'];
      const params = search ? [`%${search}%`, `%${search}%`] : [];

      const [rows] = await db.query(
        `SELECT p.id as product_id, p.name, pv.id as variant_id, pv.volume_ml,
                pv.stock, pv.price, img.image_url as thumbnail,
                COALESCE(
                  (SELECT SUM(quantity) FROM order_items oi
                   JOIN orders o ON oi.order_id = o.id
                   WHERE oi.variant_id = pv.id AND o.status = 'shipping'), 0
                ) as shipping_qty
         FROM product_variants pv
         LEFT JOIN products p ON pv.product_id = p.id
         LEFT JOIN product_images img ON img.product_id = p.id AND img.is_main = 1
         WHERE ${conditions.join(' AND ')}
         ORDER BY pv.stock ASC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      );
      return success(res, { inventory: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy tồn kho');
    }
  },

  // PUT /api/admin/inventory/:variantId
  async updateStock(req, res) {
    try {
      const { stock, change_type = 'adjust', note } = req.body;
      const [variant] = await db.query('SELECT * FROM product_variants WHERE id = ?', [req.params.variantId]);
      if (!variant.length) return error(res, 'Không tìm thấy variant', 404);

      await db.query('UPDATE product_variants SET stock = ? WHERE id = ?', [stock, req.params.variantId]);
      await db.query(
        'INSERT INTO inventory_logs (product_id, variant_id, change_type, quantity) VALUES (?, ?, ?, ?)',
        [variant[0].product_id, req.params.variantId, change_type, stock - variant[0].stock]
      );
      return success(res, null, 'Cập nhật tồn kho thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật tồn kho');
    }
  },
};

module.exports = AdminProductController;
