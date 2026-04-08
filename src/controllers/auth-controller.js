const AuthUseCase = require('../use-cases/auth-use-case');

const AuthController = {
  async register(req, res, next) {
    try {
      const { user, tokens } = await AuthUseCase.registerUser(req.validatedBody);
      res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: { user, tokens }
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, tokens, role } = await AuthUseCase.login(email, password);
      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: { user, tokens, role }
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
      if (!refreshToken) {
        throw new AppError('No refresh token provided. Please include it in the body (refreshToken) or as a header (x-refresh-token).', 400);
      }
      const tokens = await AuthUseCase.refreshToken(refreshToken);
      res.status(200).json({
        status: 'success',
        message: 'Tokens refreshed successfully',
        data: tokens
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res) {
    res.status(200).json({
      status: 'success',
      data: { user: req.user }
    });
  },

  async updateProfile(req, res, next) {
    try {
      const user = await AuthUseCase.updateProfile(req.user.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
