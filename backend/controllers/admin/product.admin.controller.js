// Admin Controller sản phẩm — CRUD, variants, ảnh, danh mục, thương hiệu, kho
const Product = require('../../models/Product');
const { Category, Brand } = require('../../models/index');
const db = require('../../config/db');
const slugify = require('slugify');
const { success, error, paginate } = require('../../utils/response');
const { unlinkUploadUrl } = require('../../utils/fileStorage');

const parseJsonField = (value) => {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

const optInt = (v) => {
  if (v === '' || v === undefined || v === null) return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

/**
 * Đồng bộ biến thể khi sửa sản phẩm — không được xóa hàng loạt rồi INSERT lại vì
 * order_items / cart_items / inventory_logs tham chiếu variant_id (FK).
 */
async function syncProductVariants(productId, rawVariants, fallbackPrice) {
  const pid = parseInt(productId, 10);
  if (Number.isNaN(pid)) throw new Error('product_id không hợp lệ');

  const [refRows] = await db.query(
    `SELECT DISTINCT pv.id AS variant_id
     FROM product_variants pv
     WHERE pv.product_id = ?
       AND (
         EXISTS (SELECT 1 FROM order_items oi WHERE oi.variant_id = pv.id)
         OR EXISTS (SELECT 1 FROM cart_items ci WHERE ci.variant_id = pv.id)
         OR EXISTS (SELECT 1 FROM inventory_logs il WHERE il.variant_id = pv.id)
       )`,
    [pid]
  );
  const lockedIds = new Set(refRows.map((r) => Number(r.variant_id)).filter((id) => !Number.isNaN(id)));

  const [existingRows] = await db.query('SELECT id FROM product_variants WHERE product_id = ?', [pid]);
  const existingIds = new Set(existingRows.map((r) => Number(r.id)).filter((id) => !Number.isNaN(id)));

  const submittedIds = [];
  for (const v of rawVariants) {
    if (v.id === undefined || v.id === null || v.id === '') continue;
    const n = parseInt(v.id, 10);
    if (!Number.isNaN(n)) submittedIds.push(n);
  }
  const keepSet = new Set(submittedIds);

  const num = (x, def = 0) => {
    const n = typeof x === 'string' ? parseFloat(x) : Number(x);
    return Number.isNaN(n) ? def : n;
  };

  const fb =
    fallbackPrice != null && !Number.isNaN(Number(fallbackPrice)) ? Number(fallbackPrice) : 0;

  for (const v of rawVariants) {
    const vol = parseInt(v.volume_ml, 10);
    const volSafe = Number.isNaN(vol) ? 0 : vol;
    const pr =
      v.price !== undefined && v.price !== '' && v.price !== null ? num(v.price, fb) : fb;
    const st = parseInt(v.stock, 10);
    const stockSafe = Number.isNaN(st) ? 0 : st;

    const vid = v.id !== undefined && v.id !== null && v.id !== '' ? parseInt(v.id, 10) : null;

    if (vid != null && !Number.isNaN(vid) && existingIds.has(vid)) {
      await db.query(
        'UPDATE product_variants SET volume_ml = ?, price = ?, stock = ? WHERE id = ? AND product_id = ?',
        [volSafe, pr, stockSafe, vid, pid]
      );
    } else {
      const [ins] = await db.query(
        'INSERT INTO product_variants (product_id, volume_ml, price, stock) VALUES (?, ?, ?, ?)',
        [pid, volSafe, pr, stockSafe]
      );
      keepSet.add(ins.insertId);
    }
  }

  for (const row of existingRows) {
    const rid = Number(row.id);
    if (Number.isNaN(rid)) continue;
    if (keepSet.has(rid)) continue;
    if (lockedIds.has(rid)) continue;
    await db.query('DELETE FROM product_variants WHERE id = ? AND product_id = ?', [rid, pid]);
  }
}

/** FormData/multer gửi số dạng chuỗi; ô trống → null để MySQL nhận đúng */
const normalizeProductBody = (body) => {
  const saleRaw = body.sale_price;
  const sale =
    saleRaw === '' || saleRaw === undefined || saleRaw === null ? null : parseFloat(saleRaw);
  const priceRaw = body.price;
  const price =
    priceRaw === '' || priceRaw === undefined || priceRaw === null ? undefined : parseFloat(priceRaw);
  return {
    ...body,
    brand_id: optInt(body.brand_id),
    category_id: optInt(body.category_id),
    price: Number.isNaN(price) ? undefined : price,
    sale_price: sale === null || Number.isNaN(sale) ? null : sale,
  };
};

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
      const [tags] = await db.query(
        `SELECT pt.name FROM product_tags pt
         JOIN product_tag_map ptm ON pt.id = ptm.tag_id
         WHERE ptm.product_id = ?`,
        [product.id]
      );
      return success(res, { product: { ...product, images, variants, tags: tags.map(t => t.name) } });
    } catch (err) {
      console.error('Admin getById product error:', err);
      return error(res, err.message || 'Lỗi lấy sản phẩm', 500);
    }
  },

  // POST /api/admin/products
  async create(req, res) {
    try {
      const body = normalizeProductBody(req.body);
      const rawVariants = parseJsonField(req.body.variants);
      const tags = parseJsonField(req.body.tags) || [];
      const { name, brand_id, category_id, description, gender, concentration, price, sale_price } = body;
      if (!name || price === undefined || Number.isNaN(price)) return error(res, 'Thiếu thông tin bắt buộc', 400);

      const productId = await Product.create({ name, brand_id, category_id, description, gender, concentration, price, sale_price });

      // Thêm variants
      if (rawVariants && rawVariants.length) {
        for (const v of rawVariants) {
          await db.query(
            'INSERT INTO product_variants (product_id, volume_ml, price, stock) VALUES (?, ?, ?, ?)',
            [productId, v.volume_ml, v.price || price, v.stock || 0]
          );
        }
      }

      // Thêm tags
      if (tags && tags.length) {
        const normalizedTags = tags.map(t => String(t).trim()).filter(Boolean);
        for (const rawTagName of normalizedTags) {
          const tagName = rawTagName.toLowerCase();
          const [existing] = await db.query('SELECT id FROM product_tags WHERE LOWER(name) = ?', [tagName]);
          let tagId;
          if (existing.length) {
            tagId = existing[0].id;
          } else {
            const [tagResult] = await db.query('INSERT INTO product_tags (name) VALUES (?)', [rawTagName]);
            tagId = tagResult.insertId;
          }
          await db.query('INSERT INTO product_tag_map (product_id, tag_id) VALUES (?, ?)', [productId, tagId]);
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
      return error(res, err.message || 'Lỗi tạo sản phẩm', 500);
    }
  },

  // PUT /api/admin/products/:id
  async update(req, res) {
    try {
      const body = normalizeProductBody(req.body);
      const rawVariants = parseJsonField(req.body.variants);
      const tags = parseJsonField(req.body.tags);
      const { name, brand_id, category_id, description, gender, concentration, price, sale_price, status } = body;
      await Product.update(req.params.id, { name, brand_id, category_id, description, gender, concentration, price, sale_price, status });

      if (rawVariants && Array.isArray(rawVariants) && rawVariants.length > 0) {
        await syncProductVariants(req.params.id, rawVariants, price);
      }

      // Cập nhật tag nếu có
      if (tags) {
        const normalizedTags = Array.isArray(tags)
          ? tags.map(t => String(t).trim()).filter(Boolean)
          : [String(tags).trim()].filter(Boolean);
        await db.query('DELETE FROM product_tag_map WHERE product_id = ?', [req.params.id]);
        for (const rawTagName of normalizedTags) {
          const tagName = rawTagName.toLowerCase();
          const [existing] = await db.query('SELECT id FROM product_tags WHERE LOWER(name) = ?', [tagName]);
          let tagId;
          if (existing.length) {
            tagId = existing[0].id;
          } else {
            const [tagResult] = await db.query('INSERT INTO product_tags (name) VALUES (?)', [rawTagName]);
            tagId = tagResult.insertId;
          }
          await db.query('INSERT INTO product_tag_map (product_id, tag_id) VALUES (?, ?)', [req.params.id, tagId]);
        }
      }

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
      console.error('Admin update product error:', err);
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return error(
          res,
          'Không thể xóa biến thể đang có trong giỏ hàng, đơn hàng hoặc lịch sử kho. Hãy giữ lại biến thể đó hoặc xử lý giỏ/đơn trước.',
          409
        );
      }
      return error(res, err.message || 'Lỗi cập nhật sản phẩm', 500);
    }
  },

  // DELETE /api/admin/products/:id (soft delete)
  async delete(req, res) {
    const productId = parseInt(req.params.id, 10);
    if (!productId) return error(res, 'ID sản phẩm không hợp lệ', 400);
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [exists] = await conn.query('SELECT id, name FROM products WHERE id = ? LIMIT 1', [productId]);
      if (!exists.length) {
        await conn.rollback();
        return error(res, 'Không tìm thấy sản phẩm', 404);
      }

      const [[refStats]] = await conn.query(
        `SELECT
          (SELECT COUNT(*) FROM order_items WHERE product_id = ?) AS order_items_count,
          (SELECT COUNT(*) FROM inventory_logs WHERE product_id = ?) AS inventory_logs_count,
          (SELECT COUNT(*) FROM reviews WHERE product_id = ?) AS reviews_count`,
        [productId, productId, productId]
      );

      const hasHistory = Number(refStats.order_items_count) > 0
        || Number(refStats.inventory_logs_count) > 0
        || Number(refStats.reviews_count) > 0;

      if (hasHistory) {
        await conn.rollback();
        return error(
          res,
          'Sản phẩm đã có dữ liệu đơn hàng/review/lịch sử kho nên không thể xóa vĩnh viễn. Hãy dùng chức năng ẩn sản phẩm.',
          409
        );
      }

      const [images] = await conn.query('SELECT image_url FROM product_images WHERE product_id = ?', [productId]);

      await conn.query('DELETE FROM cart_items WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM wishlists WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM product_views WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM product_tag_map WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
      await conn.query('DELETE FROM products WHERE id = ?', [productId]);

      await conn.commit();

      for (const img of images) unlinkUploadUrl(img.image_url);

      return success(res, null, 'Đã xóa vĩnh viễn sản phẩm');
    } catch (err) {
      await conn.rollback();
      console.error('Admin delete product error:', err);
      return error(res, err.message || 'Lỗi xóa sản phẩm', 500);
    } finally {
      conn.release();
    }
  },

  // DELETE /api/admin/products/:id/images/:imgId — xóa DB + file trên đĩa (chỉ path /uploads/...)
  async deleteImage(req, res) {
    try {
      const productId = req.params.id;
      const imgId = req.params.imgId;
      const [imgRows] = await db.query(
        'SELECT id, image_url, is_main FROM product_images WHERE id = ? AND product_id = ?',
        [imgId, productId]
      );
      const row = imgRows[0];
      if (!row) return error(res, 'Không tìm thấy ảnh', 404);

      const wasMain = Number(row.is_main) === 1;
      await db.query('DELETE FROM product_images WHERE id = ? AND product_id = ?', [imgId, productId]);
      unlinkUploadUrl(row.image_url);

      if (wasMain) {
        const [nextRows] = await db.query(
          'SELECT id FROM product_images WHERE product_id = ? ORDER BY id ASC LIMIT 1',
          [productId]
        );
        const next = nextRows[0];
        if (next) {
          await db.query('UPDATE product_images SET is_main = 0 WHERE product_id = ?', [productId]);
          await db.query('UPDATE product_images SET is_main = 1 WHERE id = ?', [next.id]);
        }
      }

      return success(res, null, 'Đã xóa ảnh');
    } catch (err) {
      console.error('Admin deleteImage error:', err);
      return error(res, err.message || 'Lỗi xóa ảnh', 500);
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
      const { name, description, slug: slugIn } = req.body;
      if (!name) return error(res, 'Thiếu tên thương hiệu', 400);
      const slug = slugIn && String(slugIn).trim()
        ? slugify(String(slugIn).trim(), { lower: true, strict: true, locale: 'vi' })
        : slugify(name, { lower: true, strict: true, locale: 'vi' });
      const logo = req.file ? `/uploads/brands/${req.file.filename}` : null;
      const id = await Brand.create({ name, slug, logo, description });
      return success(res, { id }, 'Tạo thương hiệu thành công', 201);
    } catch (err) { return error(res, 'Lỗi tạo thương hiệu'); }
  },
  async updateBrand(req, res) {
    try {
      const { name, description, slug: slugIn } = req.body;
      let slug;
      if (slugIn !== undefined && String(slugIn).trim()) {
        slug = slugify(String(slugIn).trim(), { lower: true, strict: true, locale: 'vi' });
      } else if (name) {
        slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
      }
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
                ) as shipping_qty,
                COALESCE(
                  (SELECT il.quantity
                   FROM inventory_logs il
                   WHERE il.variant_id = pv.id AND il.change_type = 'import'
                   ORDER BY il.created_at DESC, il.id DESC
                   LIMIT 1), 0
                ) as latest_import_qty,
                (SELECT DATE_FORMAT(il.created_at, '%d/%m/%Y %H:%i:%s')
                 FROM inventory_logs il
                 WHERE il.variant_id = pv.id AND il.change_type = 'import'
                 ORDER BY il.created_at DESC, il.id DESC
                 LIMIT 1) as latest_import_at
         FROM product_variants pv
         LEFT JOIN products p ON pv.product_id = p.id
         LEFT JOIN product_images img ON img.id = (
           SELECT pi.id
           FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.is_main DESC, pi.id ASC
           LIMIT 1
         )
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
      const { stock, quantity, change_type = 'adjust' } = req.body;
      const [variant] = await db.query('SELECT * FROM product_variants WHERE id = ?', [req.params.variantId]);
      if (!variant.length) return error(res, 'Không tìm thấy variant', 404);
      const currentStock = parseInt(variant[0].stock, 10) || 0;

      let nextStock = currentStock;
      let delta = 0;
      if (change_type === 'import') {
        const qty = parseInt(quantity, 10);
        if (Number.isNaN(qty) || qty <= 0) return error(res, 'Số lượng nhập kho không hợp lệ', 400);
        delta = qty;
        nextStock = currentStock + qty;
      } else if (change_type === 'export') {
        const qty = parseInt(quantity, 10);
        if (Number.isNaN(qty) || qty <= 0) return error(res, 'Số lượng xuất kho không hợp lệ', 400);
        if (qty > currentStock) return error(res, 'Số lượng xuất vượt quá tồn kho hiện tại', 400);
        delta = -qty;
        nextStock = currentStock - qty;
      } else {
        const absolute = parseInt(stock, 10);
        if (Number.isNaN(absolute) || absolute < 0) return error(res, 'Tồn kho không hợp lệ', 400);
        nextStock = absolute;
        delta = absolute - currentStock;
      }

      await db.query('UPDATE product_variants SET stock = ? WHERE id = ?', [nextStock, req.params.variantId]);
      await db.query(
        'INSERT INTO inventory_logs (product_id, variant_id, change_type, quantity) VALUES (?, ?, ?, ?)',
        [variant[0].product_id, req.params.variantId, change_type, delta]
      );
      return success(res, null, 'Cập nhật tồn kho thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật tồn kho');
    }
  },
};

module.exports = AdminProductController;
