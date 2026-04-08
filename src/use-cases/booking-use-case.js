const BookingRepository = require('../data-access/booking-repository');
const ServiceRepository = require('../data-access/service-repository');
const AppError = require('../utils/errors');

const BookingUseCase = {
  async createBooking(userId, bookingData) {
    const service = await ServiceRepository.findServiceById(bookingData.service_id);
    if (!service) throw new AppError('Service not found', 404);

    const booking = await BookingRepository.createBooking({
      ...bookingData,
      user_id: userId,
      total_price: service.price
    });

    return booking;
  },

  async getUserBookings(userId) {
    return await BookingRepository.findUserBookings(userId);
  },

  async getAllBookings() {
    return await BookingRepository.findAllBookings();
  },

  async getBookingDetails(id) {
    const booking = await BookingRepository.findBookingById(id);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  },

  async updateStatus(id, newStatus) {
    const booking = await BookingRepository.findBookingById(id);
    if (!booking) throw new AppError('Booking not found', 404);

    await BookingRepository.updateStatus(id, newStatus, booking.status);
  },

  async assignStaff(id, staffId, notes) {
    const booking = await BookingRepository.findBookingById(id);
    if (!booking) throw new AppError('Booking not found', 404);
    await BookingRepository.assignStaff(id, staffId, notes);
  },

  async rescheduleBooking(userId, bookingId, newBookingTime) {
    const booking = await BookingRepository.findBookingById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    // Business Logic: Only the owner can reschedule
    if (booking.user_id !== userId) {
      throw new AppError('You do not have permission to reschedule this booking', 403);
    }

    // Business Logic: Only 'Pending' or 'Confirmed' bookings can be rescheduled
    const allowedStatuses = ['Pending', 'Confirmed'];
    if (!allowedStatuses.includes(booking.status)) {
      throw new AppError(`Cannot reschedule booking in '${booking.status}' status`, 400);
    }

    await BookingRepository.updateBookingTime(bookingId, newBookingTime);
    return await BookingRepository.findBookingById(bookingId);
  },

  async cancelBooking(userId, bookingId) {
    const booking = await BookingRepository.findBookingById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    // Business Logic: Only the owner can cancel their own booking
    if (booking.user_id !== userId) {
      throw new AppError('You do not have permission to cancel this booking', 403);
    }

    // Business Logic: Can only cancel Pending or Confirmed bookings
    if (!['Pending', 'Confirmed'].includes(booking.status)) {
      throw new AppError(`Cannot cancel a booking that is already '${booking.status}'`, 400);
    }

    await BookingRepository.updateStatus(bookingId, 'Cancelled', booking.status);
  }
};

module.exports = BookingUseCase;
