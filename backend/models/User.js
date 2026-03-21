// Model User — CRUD user, bcrypt password, phân quyền
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Tìm theo email
  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  // Tìm theo id
  async findById(id) {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status, u.created_at,
              r.name as role_name, r.id as role_id
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  // Tạo user mới
  async create({ name, email, password, phone = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lấy role customer (mặc định)
    const [roles] = await db.query("SELECT id FROM roles WHERE name = 'customer' LIMIT 1");
    const roleId = roles[0]?.id || 3;

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, role_id, status) VALUES (?, ?, ?, ?, ?, "active")',
      [name, email, hashedPassword, phone, roleId]
    );
    return result.insertId;
  },

  // Cập nhật thông tin cá nhân
  async updateProfile(id, { name, phone, avatar }) {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (avatar !== undefined) { fields.push('avatar = ?'); values.push(avatar); }
    if (!fields.length) return false;
    values.push(id);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  // Đổi mật khẩu
  async updatePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
    return true;
  },

  // Verify mật khẩu
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Lấy danh sách (admin)
  async getAll({ search = '', role = '', status = '', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];

    if (search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role) { conditions.push('r.name = ?'); params.push(role); }
    if (status) { conditions.push('u.status = ?'); params.push(status); }

    const where = conditions.join(' AND ');
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status, u.created_at, r.name as role_name
       FROM users u LEFT JOIN roles r ON u.role_id = r.id
       WHERE ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE ${where}`,
      params
    );
    return { rows, total };
  },

  // Cập nhật trạng thái (admin)
  async updateStatus(id, status) {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return true;
  },

  // Cập nhật role (admin)
  async updateRole(id, roleId) {
    await db.query('UPDATE users SET role_id = ? WHERE id = ?', [roleId, id]);
    return true;
  },
};

module.exports = User;
