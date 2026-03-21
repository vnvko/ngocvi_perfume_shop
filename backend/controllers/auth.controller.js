// Controller xác thực — register, login, me, updateProfile, changePassword
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { success, error } = require('../utils/response');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const AuthController = {
  // POST /api/auth/register
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Dữ liệu không hợp lệ', 422, errors.array());
    }

    try {
      const { name, email, password, phone } = req.body;

      // Kiểm tra email đã tồn tại
      const existing = await User.findByEmail(email);
      if (existing) {
        return error(res, 'Email đã được sử dụng', 409);
      }

      const userId = await User.create({ name, email, password, phone });
      const token = generateToken(userId);
      const user = await User.findById(userId);

      return success(res, { user, token }, 'Đăng ký thành công', 201);
    } catch (err) {
      console.error('Register error:', err);
      return error(res, 'Lỗi đăng ký tài khoản');
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Dữ liệu không hợp lệ', 422, errors.array());
    }

    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return error(res, 'Email hoặc mật khẩu không đúng', 401);
      }
      if (user.status !== 'active') {
        return error(res, 'Tài khoản đã bị khóa', 403);
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return error(res, 'Email hoặc mật khẩu không đúng', 401);
      }

      const token = generateToken(user.id);
      const { password: _, ...safeUser } = user;

      return success(res, { user: safeUser, token }, 'Đăng nhập thành công');
    } catch (err) {
      console.error('Login error:', err);
      return error(res, 'Lỗi đăng nhập');
    }
  },

  // GET /api/auth/me
  async me(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return error(res, 'Không tìm thấy user', 404);
      return success(res, { user });
    } catch (err) {
      return error(res, 'Lỗi lấy thông tin');
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res) {
    try {
      const { name, phone } = req.body;
      const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
      await User.updateProfile(req.user.id, { name, phone, avatar });
      const user = await User.findById(req.user.id);
      return success(res, { user }, 'Cập nhật thông tin thành công');
    } catch (err) {
      return error(res, 'Lỗi cập nhật thông tin');
    }
  },

  // PUT /api/auth/change-password
  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      const user = await User.findByEmail(req.user.email);

      const isMatch = await User.comparePassword(current_password, user.password);
      if (!isMatch) {
        return error(res, 'Mật khẩu hiện tại không đúng', 400);
      }
      if (new_password.length < 6) {
        return error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
      }

      await User.updatePassword(req.user.id, new_password);
      return success(res, null, 'Đổi mật khẩu thành công');
    } catch (err) {
      return error(res, 'Lỗi đổi mật khẩu');
    }
  },
};

module.exports = AuthController;
