const pool = require('../config/database');

const StaffRepository = {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT s.*, r.name as role_name 
      FROM staff s 
      JOIN roles r ON s.role_id = r.id
    `);
    return rows;
  },

  async findAllRoles() {
    const [rows] = await pool.query('SELECT * FROM roles');
    return rows;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM staff WHERE email = ?', [email]);
    return rows[0];
  },

  async create(staffData) {
    const { admin_id, role_id, name, email, password_hash, phone } = staffData;
    const [result] = await pool.query(
      'INSERT INTO staff (admin_id, role_id, name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [admin_id, role_id, name, email, password_hash, phone]
    );
    return result.insertId;
  },

  async delete(id) {
    await pool.query('DELETE FROM staff WHERE id = ?', [id]);
  }
};

module.exports = StaffRepository;
