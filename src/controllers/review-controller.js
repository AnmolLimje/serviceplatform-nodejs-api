const ReviewUseCase = require('../use-cases/review-use-case');

const ReviewController = {
  async addServiceReview(req, res, next) {
    try {
      await ReviewUseCase.addServiceReview(req.user.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Service review added successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async addUserReview(req, res, next) {
    try {
      await ReviewUseCase.addUserReview(req.user.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'User review added successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async getServiceReviews(req, res, next) {
    try {
      const reviews = await ReviewUseCase.getServiceReviews(req.params.serviceId);
      res.status(200).json({
        status: 'success',
        data: reviews
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReviewController;
