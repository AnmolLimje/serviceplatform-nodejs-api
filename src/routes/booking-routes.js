const express = require('express');
const BookingController = require('../controllers/booking-controller');
const validate = require('../middlewares/validation');
const { bookingSchemas } = require('../utils/schemas');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', restrictTo('User'), validate(bookingSchemas.create), BookingController.createBooking);
router.get('/my', restrictTo('User'), BookingController.getMyBookings);
router.get('/', restrictTo('Admin', 'Manager', 'Technician'), BookingController.getAllBookings);
router.get('/:id', BookingController.getBooking);

router.patch('/:id/status', restrictTo('Admin', 'Manager', 'Technician'), validate(bookingSchemas.updateStatus), BookingController.updateStatus);
router.patch('/:id/reschedule', restrictTo('User'), validate(bookingSchemas.reschedule), BookingController.reschedule);
router.patch('/:id/cancel', restrictTo('User'), BookingController.cancelBooking);
router.post('/:id/assign', restrictTo('Admin'), validate(bookingSchemas.assignStaff), BookingController.assignStaff);

module.exports = router;
