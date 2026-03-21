// Controllers store — Order, Cart, Review, Blog, Wishlist, Voucher, Banner
const Order = require('../models/Order');
const { Cart, Review, Blog, Wishlist, Voucher, Banner } = require('../models/index');
const { success, error, paginate } = require('../utils/response');

// ── Order Controller ──
const OrderController = {
  async create(req, res) {
    try {
      const { items, shipping_address, payment_method, voucher_id } = req.body;
      if (!items || !items.length) return error(res, 'Giỏ hàng trống', 400);

      // Tính phí ship cơ bản
      const shipping_fee = payment_method === 'COD' ? 35000 : 0;

      // Tính discount từ voucher nếu có
      let discount = 0;
      let voucherId = null;
      if (voucher_id) {
        try {
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          const { voucher, discountAmount } = await Voucher.check(voucher_id, req.user.id, subtotal);
          discount = discountAmount;
          voucherId = voucher.id;
        } catch (vErr) {
          return error(res, vErr.message, 400);
        }
      }

      const result = await Order.create({
        user_id: req.user.id,
        items,
        shipping_address,
        payment_method,
        shipping_fee,
        discount,
        voucher_id: voucherId,
      });

      return success(res, result, 'Đặt hàng thành công', 201);
    } catch (err) {
      console.error('Order create error:', err);
      return error(res, err.message || 'Lỗi đặt hàng');
    }
  },

  async getMyOrders(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const { rows, total } = await Order.getByUser(req.user.id, { page, limit, status });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách đơn hàng');
    }
  },

  async getDetail(req, res) {
    try {
      const order = await Order.getDetail(req.params.id, req.user.id);
      if (!order) return error(res, 'Không tìm thấy đơn hàng', 404);
      return success(res, { order });
    } catch (err) {
      return error(res, 'Lỗi lấy chi tiết đơn hàng');
    }
  },

  async cancel(req, res) {
    try {
      const order = await Order.getDetail(req.params.id, req.user.id);
      if (!order) return error(res, 'Không tìm thấy đơn hàng', 404);
      if (!['pending', 'confirmed'].includes(order.status)) {
        return error(res, 'Không thể hủy đơn hàng ở trạng thái này', 400);
      }
      await Order.updateStatus(req.params.id, 'cancelled');
      return success(res, null, 'Hủy đơn hàng thành công');
    } catch (err) {
      return error(res, 'Lỗi hủy đơn hàng');
    }
  },
};

// ── Cart Controller ──
const CartController = {
  async getCart(req, res) {
    try {
      const items = await Cart.getItems(req.user.id);
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      return success(res, { items, total });
    } catch (err) {
      return error(res, 'Lỗi lấy giỏ hàng');
    }
  },

  async addItem(req, res) {
    try {
      const { product_id, variant_id, quantity } = req.body;
      if (!product_id || !variant_id) return error(res, 'Thiếu thông tin sản phẩm', 400);
      await Cart.addItem(req.user.id, { product_id, variant_id, quantity });
      return success(res, null, 'Đã thêm vào giỏ hàng');
    } catch (err) {
      return error(res, 'Lỗi thêm vào giỏ hàng');
    }
  },

  async updateItem(req, res) {
    try {
      const { quantity } = req.body;
      await Cart.updateItem(req.user.id, req.params.itemId, quantity);
      return success(res, null, 'Đã cập nhật giỏ hàng');
    } catch (err) {
      return error(res, 'Lỗi cập nhật giỏ hàng');
    }
  },

  async removeItem(req, res) {
    try {
      await Cart.removeItem(req.user.id, req.params.itemId);
      return success(res, null, 'Đã xóa khỏi giỏ hàng');
    } catch (err) {
      return error(res, 'Lỗi xóa khỏi giỏ hàng');
    }
  },

  async clearCart(req, res) {
    try {
      await Cart.clear(req.user.id);
      return success(res, null, 'Đã xóa giỏ hàng');
    } catch (err) {
      return error(res, 'Lỗi xóa giỏ hàng');
    }
  },
};

// ── Review Controller ──
const ReviewController = {
  async getByProduct(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await Review.getByProduct(req.params.productId, { page, limit });
      return success(res, result);
    } catch (err) {
      return error(res, 'Lỗi lấy đánh giá');
    }
  },

  async create(req, res) {
    try {
      const { product_id, rating, comment } = req.body;
      if (!product_id || !rating) return error(res, 'Thiếu thông tin đánh giá', 400);
      if (rating < 1 || rating > 5) return error(res, 'Đánh giá phải từ 1-5 sao', 400);

      const id = await Review.create({
        user_id: req.user.id,
        product_id,
        rating: parseInt(rating),
        comment,
      });
      return success(res, { id }, 'Đánh giá thành công', 201);
    } catch (err) {
      return error(res, err.message || 'Lỗi gửi đánh giá');
    }
  },
};

// ── Blog Controller ──
const BlogController = {
  async getAll(req, res) {
    try {
      const { search, category, page = 1, limit = 9 } = req.query;
      const { rows, total } = await Blog.getAll({ search, category, page, limit });
      const categories = await Blog.getCategories();
      return success(res, { blogs: rows, categories, pagination: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } });
    } catch (err) {
      return error(res, 'Lỗi lấy bài viết');
    }
  },

  async getBySlug(req, res) {
    try {
      const blog = await Blog.getBySlug(req.params.slug);
      if (!blog) return error(res, 'Không tìm thấy bài viết', 404);
      return success(res, { blog });
    } catch (err) {
      return error(res, 'Lỗi lấy bài viết');
    }
  },
};

// ── Wishlist Controller ──
const WishlistController = {
  async getWishlist(req, res) {
    try {
      const items = await Wishlist.getByUser(req.user.id);
      return success(res, { items });
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách yêu thích');
    }
  },

  async toggle(req, res) {
    try {
      const { product_id } = req.body;
      if (!product_id) return error(res, 'Thiếu product_id', 400);
      const result = await Wishlist.toggle(req.user.id, product_id);
      return success(res, result, result.added ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
    } catch (err) {
      return error(res, 'Lỗi cập nhật yêu thích');
    }
  },
};

// ── Voucher Controller ──
const VoucherController = {
  async check(req, res) {
    try {
      const { code, order_value } = req.body;
      if (!code) return error(res, 'Thiếu mã giảm giá', 400);
      const result = await Voucher.check(code, req.user.id, order_value || 0);
      return success(res, result, 'Mã giảm giá hợp lệ');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },
};

// ── Banner Controller ──
const BannerController = {
  async getActive(req, res) {
    try {
      const banners = await Banner.getActive();
      return success(res, { banners });
    } catch (err) {
      return error(res, 'Lỗi lấy banner');
    }
  },
};

module.exports = { OrderController, CartController, ReviewController, BlogController, WishlistController, VoucherController, BannerController };
