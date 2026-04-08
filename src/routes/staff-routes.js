const express = require('express');
const StaffController = require('../controllers/staff-controller');
const validate = require('../middlewares/validation');
const { staffSchemas } = require('../utils/schemas');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/roles', restrictTo('Admin', 'Manager', 'Technician'), StaffController.getRoles);
router.get('/', restrictTo('Admin', 'Manager', 'Technician'), StaffController.getAllStaff);
router.post('/', restrictTo('Admin', 'Manager'), validate(staffSchemas.create), StaffController.createStaff);
router.delete('/:id', restrictTo('Admin', 'Manager'), StaffController.deleteStaff);

module.exports = router;
