// Middleware phân quyền — requireAdmin, requireStaff
const db = require('../config/db');

// Role IDs: 1=admin, 2=staff, 3=customer (theo DB)
const requireAdmin = async (req, res, next) => {
  try {
    const [roles] = await db.query('SELECT name FROM roles WHERE id = ?', [req.user.role_id]);
    if (!roles.length || roles[0].name !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi kiểm tra quyền' });
  }
};

const requireStaff = async (req, res, next) => {
  try {
    const [roles] = await db.query('SELECT name FROM roles WHERE id = ?', [req.user.role_id]);
    const roleName = roles[0]?.name;
    if (!['admin', 'staff'].includes(roleName)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi kiểm tra quyền' });
  }
};

module.exports = { requireAdmin, requireStaff };
