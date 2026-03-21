// Middleware xác thực JWT — authenticate (bắt buộc) + optionalAuth
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Xác thực JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user còn active không
    const [rows] = await db.query(
      'SELECT id, name, email, role_id, status FROM users WHERE id = ? AND status = "active"',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

// Middleware không bắt buộc đăng nhập (để get user nếu có)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id, name, email, role_id FROM users WHERE id = ? AND status = "active"',
      [decoded.id]
    );
    req.user = rows.length ? rows[0] : null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { authenticate, optionalAuth };
