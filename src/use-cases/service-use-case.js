const ServiceRepository = require('../data-access/service-repository');
const AppError = require('../utils/errors');

const ServiceUseCase = {
  async getAllCategories() {
    return await ServiceRepository.findAllCategories();
  },

  async getServices(filters, pagination) {
    const { limit, page } = pagination;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ServiceRepository.findAllServices(filters, { limit, offset }),
      ServiceRepository.countAllServices(filters)
    ]);

    return {
      data,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getService(id) {
    const service = await ServiceRepository.findServiceById(id);
    if (!service) throw new AppError('Service not found', 404);
    return service;
  },

  async createService(serviceData) {
    return await ServiceRepository.createService(serviceData);
  },

  async updateService(id, serviceData) {
    const existing = await ServiceRepository.findServiceById(id);
    if (!existing) throw new AppError('Service not found', 404);
    return await ServiceRepository.updateService(id, serviceData);
  },

  async deleteService(id) {
    const existing = await ServiceRepository.findServiceById(id);
    if (!existing) throw new AppError('Service not found', 404);
    return await ServiceRepository.deleteService(id);
  }
};

module.exports = ServiceUseCase;
