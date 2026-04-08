const ServiceUseCase = require('../use-cases/service-use-case');

const ServiceController = {
  async getAllCategories(req, res, next) {
    try {
      const categories = await ServiceUseCase.getAllCategories();
      res.status(200).json({
        status: 'success',
        data: categories
      });
    } catch (err) {
      next(err);
    }
  },

  async getServices(req, res, next) {
    try {
      const { category_id, min_price, max_price, page = 1, limit = 10 } = req.query;
      const result = await ServiceUseCase.getServices(
        { category_id, min_price, max_price },
        { page, limit }
      );
      res.status(200).json({
        status: 'success',
        results: result.data.length,
        data: result.data,
        meta: result.meta
      });
    } catch (err) {
      next(err);
    }
  },

  async getService(req, res, next) {
    try {
      const service = await ServiceUseCase.getService(req.params.id);
      res.status(200).json({
        status: 'success',
        data: service
      });
    } catch (err) {
      next(err);
    }
  },

  async createService(req, res, next) {
    try {
      const serviceData = {
        ...req.validatedBody,
        created_by_staff_id: req.user.role === 'Staff' ? req.user.id : null
      };
      const insertId = await ServiceUseCase.createService(serviceData);
      res.status(201).json({
        status: 'success',
        message: 'Service created successfully',
        data: { id: insertId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateService(req, res, next) {
    try {
      await ServiceUseCase.updateService(req.params.id, req.validatedBody);
      res.status(200).json({
        status: 'success',
        message: 'Service updated successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteService(req, res, next) {
    try {
      await ServiceUseCase.deleteService(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ServiceController;
