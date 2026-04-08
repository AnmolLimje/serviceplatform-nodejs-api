const pool = require('../config/database');

const BookingRepository = {
  async createBooking(bookingData) {
    const { user_id, service_id, booking_time, total_price, notes } = bookingData;
    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, service_id, booking_time, total_price, notes) VALUES (?, ?, ?, ?, ?)',
      [user_id, service_id, new Date(booking_time), total_price, notes]
    );
    return result.insertId;
  },

  async findBookingById(id) {
    const [rows] = await pool.query(
      `SELECT b.*, s.name as service_name, u.name as customer_name, st.name as staff_name 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       JOIN users u ON b.user_id = u.id 
       LEFT JOIN staff st ON b.staff_id = st.id 
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  },

  async findUserBookings(userId) {
    const [rows] = await pool.query(
      `SELECT b.*, s.name as service_name, st.name as staff_name, st.phone as staff_phone 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       LEFT JOIN staff st ON b.staff_id = st.id 
       WHERE b.user_id = ? 
       ORDER BY b.booking_time DESC`,
      [userId]
    );
    return rows;
  },

  async findAllBookings() {
    const [rows] = await pool.query(
      `SELECT b.*, s.name as service_name, u.name as customer_name, st.name as staff_name, st.phone as staff_phone 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       JOIN users u ON b.user_id = u.id 
       LEFT JOIN staff st ON b.staff_id = st.id 
       ORDER BY b.booking_time DESC`
    );
    return rows;
  },

  async updateStatus(id, newStatus, currentStatus) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [newStatus, id]);
      await connection.query(
        'INSERT INTO booking_status_history (booking_id, old_status, new_status) VALUES (?, ?, ?)',
        [id, currentStatus, newStatus]
      );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async updateBookingTime(id, bookingTime) {
    await pool.query('UPDATE bookings SET booking_time = ? WHERE id = ?', [new Date(bookingTime), id]);
  },

  async assignStaff(id, staffId, notes) {
    if (notes) {
      await pool.query('UPDATE bookings SET staff_id = ?, status = "Confirmed", notes = ? WHERE id = ?', [staffId, notes, id]);
    } else {
      await pool.query('UPDATE bookings SET staff_id = ?, status = "Confirmed" WHERE id = ?', [staffId, id]);
    }
  }
};

module.exports = BookingRepository;
