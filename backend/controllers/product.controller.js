// Controller sản phẩm store — getAll, getBySlug, categories, brands
const Product = require('../models/Product');
const { Category, Brand } = require('../models/index');
const db = require('../config/db');
const { success, error, paginate } = require('../utils/response');

const ProductController = {
  // GET /api/products
  async getAll(req, res) {
    try {
      const { search, category, brand, gender, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
      const { rows, total } = await Product.getAll({ search, category, brand, gender, minPrice, maxPrice, sort, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      console.error('Product getAll error:', err);
      return error(res, 'Lỗi lấy danh sách sản phẩm');
    }
  },

  // GET /api/products/:slug
  async getBySlug(req, res) {
    try {
      const product = await Product.getBySlug(req.params.slug);
      if (!product) return error(res, 'Không tìm thấy sản phẩm', 404);

      // Ghi lượt xem nếu đã login
      if (req.user) {
        db.query(
          'INSERT INTO product_views (product_id, user_id) VALUES (?, ?)',
          [product.id, req.user.id]
        ).catch(() => {});
      }

      const related = await Product.getRelated(product.id, product.category_id, product.brand_id);
      return success(res, { product, related });
    } catch (err) {
      console.error('Product getBySlug error:', err);
      return error(res, 'Lỗi lấy chi tiết sản phẩm');
    }
  },

  // GET /api/categories
  async getCategories(req, res) {
    try {
      const categories = await Category.getAll();
      return success(res, { categories });
    } catch (err) {
      return error(res, 'Lỗi lấy danh mục');
    }
  },

  // GET /api/brands
  async getBrands(req, res) {
    try {
      const brands = await Brand.getAll();
      return success(res, { brands });
    } catch (err) {
      return error(res, 'Lỗi lấy thương hiệu');
    }
  },
};

module.exports = ProductController;
