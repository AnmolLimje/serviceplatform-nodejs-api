const ReviewRepository = require('../data-access/review-repository');
const BookingRepository = require('../data-access/booking-repository');
const AppError = require('../utils/errors');

const ReviewUseCase = {
  async addServiceReview(userId, reviewData) {
    const booking = await BookingRepository.findBookingById(reviewData.booking_id);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.user_id !== userId) throw new AppError('You can only review your own bookings', 403);
    if (booking.status !== 'Completed') throw new AppError('You can only review completed bookings', 400);

    await ReviewRepository.createServiceReview({
      ...reviewData,
      user_id: userId,
      service_id: booking.service_id
    });
  },

  async addUserReview(staffId, reviewData) {
    const booking = await BookingRepository.findBookingById(reviewData.booking_id);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.staff_id !== staffId) throw new AppError('You can only review your assigned bookings', 403);
    if (booking.status !== 'Completed') throw new AppError('You can only review completed bookings', 400);

    await ReviewRepository.createUserReview({
      ...reviewData,
      staff_id: staffId,
      user_id: booking.user_id
    });
  },

  async getServiceReviews(serviceId) {
    return await ReviewRepository.findServiceReviews(serviceId);
  }
};

module.exports = ReviewUseCase;
