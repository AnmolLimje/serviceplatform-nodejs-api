const pool = require('../config/database');

const AuthRepository = {
  async findUserByEmail(email, type) {
    let table;
    switch (type) {
      case 'admin': table = 'admins'; break;
      case 'staff': 
        const [staffRows] = await pool.query(
          `SELECT s.*, r.name as role_name 
           FROM staff s 
           JOIN roles r ON s.role_id = r.id 
           WHERE s.email = ?`, 
          [email]
        );
        return staffRows[0];
      case 'user': table = 'users'; break;
      default: return null;
    }
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    return rows[0];
  },

  async createUser(userData) {
    const { name, email, password_hash, phone, address } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, phone, address]
    );
    return result.insertId;
  },

  async saveRefreshToken(data) {
    const { token, user_id, admin_id, staff_id, expires_at } = data;
    await pool.query(
      'INSERT INTO refresh_tokens (token, user_id, admin_id, staff_id, expires_at) VALUES (?, ?, ?, ?, ?)',
      [token, user_id, admin_id, staff_id, expires_at]
    );
  },

  async findRefreshToken(token) {
    const [rows] = await pool.query('SELECT * FROM refresh_tokens WHERE token = ? AND is_revoked = FALSE', [token]);
    return rows[0];
  },

  async revokeRefreshToken(token) {
    await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?', [token]);
  },

  async updateUser(userId, userData) {
    const fields = [];
    const values = [];
    const allowedFields = ['name', 'email', 'phone', 'address'];

    for (const field of allowedFields) {
      if (userData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(userData[field]);
      }
    }

    if (fields.length === 0) return;

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(query, values);
  },

  async findUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = AuthRepository;
