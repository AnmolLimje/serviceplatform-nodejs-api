const TimeslotRepository = require('../data-access/timeslot-repository');
const ServiceRepository = require('../data-access/service-repository');
const AppError = require('../utils/errors');

const TimeslotUseCase = {
  async getSlotsForService(serviceId) {
    const service = await ServiceRepository.findServiceById(serviceId);
    if (!service) throw new AppError('Service not found', 404);
    return await TimeslotRepository.findAllByService(serviceId);
  },

  async getAllSlots() {
    return await TimeslotRepository.findAll();
  },

  async createSlot(data) {
    const service = await ServiceRepository.findServiceById(data.service_id);
    if (!service) throw new AppError('Service not found', 404);

    const startTime = new Date(data.start_time);
    const endTime = new Date(data.end_time);

    if (endTime <= startTime) {
      throw new AppError('end_time must be after start_time', 400);
    }

    try {
      const slotId = await TimeslotRepository.createSlot(data);
      return await TimeslotRepository.findById(slotId);
    } catch (err) {
      // MySQL duplicate entry error (UNIQUE KEY violation)
      if (err.code === 'ER_DUP_ENTRY') {
        throw new AppError('A time slot already exists for this service at the given start time', 409);
      }
      throw err;
    }
  },

  async updateAvailability(id, isAvailable) {
    const slot = await TimeslotRepository.findById(id);
    if (!slot) throw new AppError('Time slot not found', 404);

    // Prevent deactivating a slot that has an active booking
    if (!isAvailable) {
      const isBooked = await TimeslotRepository.isSlotBooked(id);
      if (isBooked) {
        throw new AppError('Cannot mark slot unavailable — it has an active booking', 409);
      }
    }

    await TimeslotRepository.updateAvailability(id, isAvailable);
    return await TimeslotRepository.findById(id);
  },

  async deleteSlot(id) {
    const slot = await TimeslotRepository.findById(id);
    if (!slot) throw new AppError('Time slot not found', 404);

    const isBooked = await TimeslotRepository.isSlotBooked(id);
    if (isBooked) {
      throw new AppError('Cannot delete slot with an active booking. Cancel the booking first.', 409);
    }

    await TimeslotRepository.deleteSlot(id);
  }
};

module.exports = TimeslotUseCase;
