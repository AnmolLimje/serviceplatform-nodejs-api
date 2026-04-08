const pool = require('../config/database');

const ServiceRepository = {
  async findAllCategories() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  },

  async findAllServices(filters = {}, pagination = { limit: 10, offset: 0 }) {
    let query = 'SELECT s.*, c.name as category_name FROM services s JOIN categories c ON s.category_id = c.id WHERE 1=1';
    const params = [];

    if (filters.category_id) {
      query += ' AND s.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.min_price) {
      query += ' AND s.price >= ?';
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      query += ' AND s.price <= ?';
      params.push(filters.max_price);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(pagination.limit), parseInt(pagination.offset));

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async countAllServices(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM services WHERE 1=1';
    const params = [];

    if (filters.category_id) {
      query += ' AND category_id = ?';
      params.push(filters.category_id);
    }

    const [[{ total }]] = await pool.query(query, params);
    return total;
  },

  async findServiceById(id) {
    const [rows] = await pool.query(
      'SELECT s.*, c.name as category_name FROM services s JOIN categories c ON s.category_id = c.id WHERE s.id = ?',
      [id]
    );
    return rows[0];
  },

  async createService(serviceData) {
    const { category_id, name, description, price, duration_minutes, created_by_staff_id } = serviceData;
    const [result] = await pool.query(
      'INSERT INTO services (category_id, name, description, price, duration_minutes, created_by_staff_id) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, duration_minutes, created_by_staff_id]
    );
    return result.insertId;
  },

  async updateService(id, serviceData) {
    const { category_id, name, description, price, duration_minutes } = serviceData;
    await pool.query(
      'UPDATE services SET category_id = ?, name = ?, description = ?, price = ?, duration_minutes = ? WHERE id = ?',
      [category_id, name, description, price, duration_minutes, id]
    );
  },

  async deleteService(id) {
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
  }
};

module.exports = ServiceRepository;
