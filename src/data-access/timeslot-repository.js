const pool = require('../config/database');

const TimeslotRepository = {
  async findAllByService(serviceId) {
    const [rows] = await pool.query(
      `SELECT ts.*, s.name as service_name
       FROM time_slots ts
       JOIN services s ON ts.service_id = s.id
       WHERE ts.service_id = ?
       ORDER BY ts.start_time ASC`,
      [serviceId]
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT ts.*, s.name as service_name
       FROM time_slots ts
       JOIN services s ON ts.service_id = s.id
       ORDER BY ts.start_time ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ts.*, s.name as service_name
       FROM time_slots ts
       JOIN services s ON ts.service_id = s.id
       WHERE ts.id = ?`,
      [id]
    );
    return rows[0];
  },

  async createSlot(data) {
    const { service_id, start_time, end_time } = data;
    const [result] = await pool.query(
      'INSERT INTO time_slots (service_id, start_time, end_time) VALUES (?, ?, ?)',
      [service_id, new Date(start_time), new Date(end_time)]
    );
    return result.insertId;
  },

  async updateAvailability(id, isAvailable) {
    await pool.query(
      'UPDATE time_slots SET is_available = ? WHERE id = ?',
      [isAvailable, id]
    );
  },

  async deleteSlot(id) {
    await pool.query('DELETE FROM time_slots WHERE id = ?', [id]);
  },

  async isSlotBooked(id) {
    const [rows] = await pool.query(
      "SELECT id FROM bookings WHERE timeslot_id = ? AND status NOT IN ('Cancelled')",
      [id]
    );
    return rows.length > 0;
  }
};

module.exports = TimeslotRepository;
