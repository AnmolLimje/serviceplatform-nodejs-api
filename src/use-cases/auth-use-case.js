const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/errors');
const AuthRepository = require('../data-access/auth-repository');

const generateTokens = (user, type) => {
  const payload = { id: user.id, role: type };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });

  return { accessToken, refreshToken };
};

const AuthUseCase = {
  async registerUser(userData) {
    const existing = await AuthRepository.findUserByEmail(userData.email, 'user');
    if (existing) throw new AppError('Email already registered', 400);

    const password_hash = await bcrypt.hash(userData.password, 12);
    const userId = await AuthRepository.createUser({ ...userData, password_hash });

    const user = await AuthRepository.findUserByEmail(userData.email, 'user');
    delete user.password_hash;
    const tokens = generateTokens(user, 'User');

    // Save refresh token to DB
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);
    await AuthRepository.saveRefreshToken({
      token: tokens.refreshToken,
      user_id: userId,
      expires_at
    });

    return { user, tokens };
  },

  async login(email, password) {
    // Check all tables: admins, staff, users
    let user = await AuthRepository.findUserByEmail(email, 'admin');
    let type = 'Admin';

    if (!user) {
      user = await AuthRepository.findUserByEmail(email, 'staff');
      if (user) type = user.role_name; // Use 'Manager' or 'Technician' from DB
    }
    if (!user) {
      user = await AuthRepository.findUserByEmail(email, 'user');
      type = 'User';
    }

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = generateTokens(user, type);
    delete user.password_hash;
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    const refreshData = { token: tokens.refreshToken, expires_at };
    if (type === 'Admin') refreshData.admin_id = user.id;
    else if (type === 'User') refreshData.user_id = user.id;
    else refreshData.staff_id = user.id; // All specific staff roles (Manager, Tech) are staff

    await AuthRepository.saveRefreshToken(refreshData);

    return { user, tokens, role: type };
  },

  async refreshToken(token) {
    const refreshTokenData = await AuthRepository.findRefreshToken(token);
    if (!refreshTokenData) throw new AppError('Invalid or expired refresh token', 401);

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) throw new AppError('Invalid refresh token', 401);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ id: decoded.id }, decoded.role);

    // Replace refresh token
    await AuthRepository.revokeRefreshToken(token);
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    const refreshData = { token: newRefreshToken, expires_at };
    if (decoded.role === 'Admin') refreshData.admin_id = decoded.id;
    else if (decoded.role === 'User') refreshData.user_id = decoded.id;
    else refreshData.staff_id = decoded.id; // Manager, Technician, etc.

    await AuthRepository.saveRefreshToken(refreshData);

    return { accessToken, refreshToken: newRefreshToken };
  },

  async updateProfile(userId, userData) {
    if (userData.email) {
      const existing = await AuthRepository.findUserByEmail(userData.email, 'user');
      if (existing && existing.id !== userId) {
        throw new AppError('Email already in use by another account', 400);
      }
    }
    await AuthRepository.updateUser(userId, userData);
    const user = await AuthRepository.findUserById(userId);
    if (!user) throw new AppError('User not found', 404);
    delete user.password_hash;
    return user;
  }
};

module.exports = AuthUseCase;
