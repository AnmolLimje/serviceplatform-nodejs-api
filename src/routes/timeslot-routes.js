const express = require('express');
const TimeslotController = require('../controllers/timeslot-controller');
const validate = require('../middlewares/validation');
const { timeslotSchemas } = require('../utils/schemas');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// Public: Anyone can browse available time slots for a service
router.get('/', TimeslotController.getSlots);

// Protected: Only Admin/Manager can manage time slots
router.post('/', protect, restrictTo('Admin', 'Manager'), validate(timeslotSchemas.create), TimeslotController.createSlot);
router.patch('/:id', protect, restrictTo('Admin', 'Manager'), validate(timeslotSchemas.update), TimeslotController.updateSlot);
router.delete('/:id', protect, restrictTo('Admin', 'Manager'), TimeslotController.deleteSlot);

module.exports = router;
