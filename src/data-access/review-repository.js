const pool = require('../config/database');

const ReviewRepository = {
  async createServiceReview(reviewData) {
    const { booking_id, user_id, service_id, rating, comment } = reviewData;
    await pool.query(
      'INSERT INTO service_reviews (booking_id, user_id, service_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [booking_id, user_id, service_id, rating, comment]
    );
  },

  async createUserReview(reviewData) {
    const { booking_id, staff_id, user_id, rating, comment } = reviewData;
    await pool.query(
      'INSERT INTO user_reviews (booking_id, staff_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [booking_id, staff_id, user_id, rating, comment]
    );
  },

  async findServiceReviews(serviceId) {
    const [rows] = await pool.query(
      'SELECT r.*, u.name as reviewer_name FROM service_reviews r JOIN users u ON r.user_id = u.id WHERE r.service_id = ?',
      [serviceId]
    );
    return rows;
  }
};

module.exports = ReviewRepository;
