const express = require('express');
const ReviewController = require('../controllers/review-controller');
const validate = require('../middlewares/validation');
const { reviewSchemas } = require('../utils/schemas');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.post('/service', protect, restrictTo('User'), validate(reviewSchemas.addService), ReviewController.addServiceReview);
router.post('/user', protect, restrictTo('Manager', 'Technician'), validate(reviewSchemas.addUser), ReviewController.addUserReview);
router.get('/service/:serviceId', ReviewController.getServiceReviews);

module.exports = router;
