const BookingUseCase = require('../use-cases/booking-use-case');

const BookingController = {
  async createBooking(req, res, next) {
    try {
      const { service_id, booking_time, notes } = req.body;
      const bookingId = await BookingUseCase.createBooking(req.user.id, {
        service_id,
        booking_time,
        notes
      });
      res.status(201).json({
        status: 'success',
        message: 'Booking created successfully',
        data: { id: bookingId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyBookings(req, res, next) {
    try {
      const bookings = await BookingUseCase.getUserBookings(req.user.id);
      res.status(200).json({
        status: 'success',
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  },

  async getAllBookings(req, res, next) {
    try {
      const bookings = await BookingUseCase.getAllBookings();
      res.status(200).json({
        status: 'success',
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  },

  async getBooking(req, res, next) {
    try {
      const booking = await BookingUseCase.getBookingDetails(req.params.id);
      res.status(200).json({
        status: 'success',
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      await BookingUseCase.updateStatus(req.params.id, status);
      res.status(200).json({
        status: 'success',
        message: `Booking status updated to ${status}`
      });
    } catch (err) {
      next(err);
    }
  },

  async assignStaff(req, res, next) {
    try {
      const { staff_id, notes } = req.body;
      await BookingUseCase.assignStaff(req.params.id, staff_id, notes);
      res.status(200).json({
        status: 'success',
        message: 'Staff assigned successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async reschedule(req, res, next) {
    try {
      const { booking_time } = req.body;
      const booking = await BookingUseCase.rescheduleBooking(req.user.id, req.params.id, booking_time);
      res.status(200).json({
        status: 'success',
        message: 'Booking rescheduled successfully',
        data: { booking }
      });
    } catch (err) {
      next(err);
    }
  },

  async cancelBooking(req, res, next) {
    try {
      await BookingUseCase.cancelBooking(req.user.id, req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Booking cancelled successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = BookingController;
