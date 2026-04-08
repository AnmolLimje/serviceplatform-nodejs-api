const express = require('express');
const ServiceController = require('../controllers/service-controller');
const validate = require('../middlewares/validation');
const { serviceSchemas } = require('../utils/schemas');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/categories', ServiceController.getAllCategories);
router.get('/', ServiceController.getServices);
router.get('/:id', ServiceController.getService);

// Restricted routes
router.post('/', protect, restrictTo('Admin', 'Manager'), validate(serviceSchemas.create), ServiceController.createService);
router.put('/:id', protect, restrictTo('Admin', 'Manager'), validate(serviceSchemas.update), ServiceController.updateService);
router.delete('/:id', protect, restrictTo('Admin', 'Manager'), ServiceController.deleteService);

module.exports = router;
