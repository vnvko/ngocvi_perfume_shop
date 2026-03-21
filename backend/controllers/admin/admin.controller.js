// Admin Controllers gộp — Order, User, Review, Blog, Chatbox, Banner
const Order = require('../../models/Order');
const User = require('../../models/User');
const { Review, Blog } = require('../../models/index');
const db = require('../../config/db');
const slugify = require('slugify');
const { success, error, paginate } = require('../../utils/response');

// ── Admin Order Controller ──
const AdminOrderController = {
  async getAll(req, res) {
    try {
      const { search, status, payment, page = 1, limit = 10 } = req.query;
      const { rows, total } = await Order.adminGetAll({ search, status, payment, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách đơn hàng');
    }
  },

  async getDetail(req, res) {
    try {
      const order = await Order.getDetail(req.params.id);
      if (!order) return error(res, 'Không tìm thấy đơn hàng', 404);
      return success(res, { order });
    } catch (err) {
      return error(res, 'Lỗi lấy chi tiết đơn hàng');
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) return error(res, 'Thiếu trạng thái', 400);
      await Order.updateStatus(req.params.id, status);
      return success(res, null, 'Cập nhật trạng thái thành công');
    } catch (err) {
      if (err.message === 'Trạng thái không hợp lệ') {
        return error(res, err.message, 400);
      }
      return error(res, err.message || 'Lỗi cập nhật trạng thái');
    }
  },
};

// ── Admin User Controller ──
const AdminUserController = {
  async getAll(req, res) {
    try {
      const { search, role, status, page = 1, limit = 10 } = req.query;
      const { rows, total } = await User.getAll({ search, role, status, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách người dùng');
    }
  },

  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return error(res, 'Không tìm thấy người dùng', 404);

      const [orders] = await db.query(
        `SELECT id, order_code, total_price, status, created_at
         FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
        [req.params.id]
      );
      const [[stats]] = await db.query(
        `SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_spent
         FROM orders WHERE user_id = ? AND status != 'cancelled'`,
        [req.params.id]
      );

      return success(res, { user, recent_orders: orders, stats });
    } catch (err) {
      return error(res, 'Lỗi lấy thông tin người dùng');
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!['active', 'inactive', 'banned'].includes(status)) {
        return error(res, 'Trạng thái không hợp lệ', 400);
      }
      await User.updateStatus(req.params.id, status);
      return success(res, null, 'Cập nhật trạng thái thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật trạng thái');
    }
  },

  async updateRole(req, res) {
    try {
      const { role_id } = req.body;
      if (!role_id) return error(res, 'Thiếu role_id', 400);
      await User.updateRole(req.params.id, role_id);
      return success(res, null, 'Cập nhật quyền thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật quyền');
    }
  },

  async getRoles(req, res) {
    try {
      const [roles] = await db.query('SELECT * FROM roles');
      return success(res, { roles });
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách role');
    }
  },
};

// ── Admin Review Controller ──
const AdminReviewController = {
  async getAll(req, res) {
    try {
      const { search, minRating, maxRating, page = 1, limit = 10 } = req.query;
      const { rows, total } = await Review.adminGetAll({ search, minRating, maxRating, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách đánh giá');
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!['visible', 'hidden'].includes(status)) {
        return error(res, 'Trạng thái không hợp lệ', 400);
      }
      await Review.updateStatus(req.params.id, status);
      return success(res, null, 'Cập nhật trạng thái đánh giá thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật đánh giá');
    }
  },

  async delete(req, res) {
    try {
      await Review.delete(req.params.id);
      return success(res, null, 'Đã xóa đánh giá');
    } catch (err) {
      return error(res, 'Lỗi xóa đánh giá');
    }
  },
};

// ── Admin Blog Controller ──
const AdminBlogController = {
  async getAll(req, res) {
    try {
      const { search, category, page = 1, limit = 10 } = req.query;
      const { rows, total } = await Blog.getAll({ search, category, page, limit });
      return paginate(res, rows, total, page, limit);
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách bài viết');
    }
  },

  async getById(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (!rows.length) return error(res, 'Không tìm thấy bài viết', 404);
      return success(res, { blog: rows[0] });
    } catch (err) {
      return error(res, 'Lỗi lấy bài viết');
    }
  },

  async create(req, res) {
    try {
      const { title, content, category_id } = req.body;
      if (!title || !content) return error(res, 'Thiếu tiêu đề hoặc nội dung', 400);
      const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();
      const thumbnail = req.file ? `/uploads/blogs/${req.file.filename}` : null;
      const id = await Blog.create({ title, slug, content, author_id: req.user.id, category_id, thumbnail });
      return success(res, { id }, 'Tạo bài viết thành công', 201);
    } catch (err) {
      return error(res, 'Lỗi tạo bài viết');
    }
  },

  async update(req, res) {
    try {
      const { title, content, category_id } = req.body;
      const slug = title ? slugify(title, { lower: true, strict: true }) + '-' + Date.now() : undefined;
      const thumbnail = req.file ? `/uploads/blogs/${req.file.filename}` : undefined;
      await Blog.update(req.params.id, { title, slug, content, category_id, thumbnail });
      return success(res, null, 'Cập nhật bài viết thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật bài viết');
    }
  },

  async delete(req, res) {
    try {
      await Blog.delete(req.params.id);
      return success(res, null, 'Đã xóa bài viết');
    } catch (err) {
      return error(res, 'Lỗi xóa bài viết');
    }
  },
};

// ── Admin Chatbox Controller ──
const AdminChatboxController = {
  async getConversations(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const [rows] = await db.query(
        `SELECT c.id, c.created_at, u.name as user_name, u.avatar as user_avatar,
                (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_type = 'user') as unread_count
         FROM conversations c
         LEFT JOIN users u ON c.user_id = u.id
         ORDER BY last_message_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), offset]
      );
      return success(res, { conversations: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy danh sách hội thoại');
    }
  },

  async getMessages(req, res) {
    try {
      const [messages] = await db.query(
        `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
         FROM messages m
         LEFT JOIN users u ON u.id = (CASE WHEN m.sender_type = 'user' THEN
           (SELECT user_id FROM conversations WHERE id = m.conversation_id) ELSE NULL END)
         WHERE m.conversation_id = ?
         ORDER BY m.created_at ASC`,
        [req.params.conversationId]
      );
      return success(res, { messages });
    } catch (err) {
      return error(res, 'Lỗi lấy tin nhắn');
    }
  },

  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      if (!message) return error(res, 'Tin nhắn không được trống', 400);
      const [r] = await db.query(
        'INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, "admin", ?)',
        [req.params.conversationId, message]
      );
      return success(res, { id: r.insertId }, 'Gửi tin nhắn thành công', 201);
    } catch (err) {
      return error(res, 'Lỗi gửi tin nhắn');
    }
  },
};

// ── Admin Banner Controller ──
const AdminBannerController = {
  async getAll(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM banners ORDER BY id DESC');
      return success(res, { banners: rows });
    } catch (err) {
      return error(res, 'Lỗi lấy banner');
    }
  },
  async create(req, res) {
    try {
      const { title, link, status = 1 } = req.body;
      const image_url = req.file ? `/uploads/banners/${req.file.filename}` : null;
      const [r] = await db.query(
        'INSERT INTO banners (title, image_url, link, status) VALUES (?, ?, ?, ?)',
        [title, image_url, link, status]
      );
      return success(res, { id: r.insertId }, 'Tạo banner thành công', 201);
    } catch (err) {
      return error(res, 'Lỗi tạo banner');
    }
  },
  async update(req, res) {
    try {
      const { title, link, status } = req.body;
      const image_url = req.file ? `/uploads/banners/${req.file.filename}` : undefined;
      const fields = [];
      const values = [];
      if (title !== undefined) { fields.push('title = ?'); values.push(title); }
      if (link !== undefined) { fields.push('link = ?'); values.push(link); }
      if (status !== undefined) { fields.push('status = ?'); values.push(status); }
      if (image_url) { fields.push('image_url = ?'); values.push(image_url); }
      if (!fields.length) return error(res, 'Không có gì để cập nhật', 400);
      values.push(req.params.id);
      await db.query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
      return success(res, null, 'Cập nhật banner thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật banner');
    }
  },
  async delete(req, res) {
    try {
      await db.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
      return success(res, null, 'Đã xóa banner');
    } catch (err) {
      return error(res, 'Lỗi xóa banner');
    }
  },
};

module.exports = {
  AdminOrderController,
  AdminUserController,
  AdminReviewController,
  AdminBlogController,
  AdminChatboxController,
  AdminBannerController,
};
