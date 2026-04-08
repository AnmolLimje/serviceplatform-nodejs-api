const express = require('express');
const AuthController = require('../controllers/auth-controller');
const validate = require('../middlewares/validation');
const { authSchemas } = require('../utils/schemas');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authSchemas.register), AuthController.register);
router.post('/login', validate(authSchemas.login), AuthController.login);
router.post('/refresh', validate(authSchemas.refresh), AuthController.refresh);
router.get('/me', protect, AuthController.me);
router.patch('/me', protect, AuthController.updateProfile);

module.exports = router;
