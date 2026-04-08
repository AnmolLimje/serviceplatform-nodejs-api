const jwt = require('jsonwebtoken');
const AppError = require('../utils/errors');
const pool = require('../config/database');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (!token) {
      return next(new AppError('No access token found. Please provide one in the Authorization header (Bearer) or x-access-token header.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const { id, role } = decoded;

    // Use consolidated view to check if user exists
    const AuthRepository = require('../data-access/auth-repository');
    const user = await AuthRepository.findByIdAndRole(id, role);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists or role mismatch.', 401));
    }

    req.user = user;
    delete req.user.password_hash;
    req.user.role = role;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
