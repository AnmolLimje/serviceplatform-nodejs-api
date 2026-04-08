const TimeslotUseCase = require('../use-cases/timeslot-use-case');

const TimeslotController = {
  async getSlots(req, res, next) {
    try {
      const { service_id } = req.query;
      const slots = service_id
        ? await TimeslotUseCase.getSlotsForService(service_id)
        : await TimeslotUseCase.getAllSlots();
      res.status(200).json({
        status: 'success',
        results: slots.length,
        data: slots
      });
    } catch (err) {
      next(err);
    }
  },

  async createSlot(req, res, next) {
    try {
      const slot = await TimeslotUseCase.createSlot(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Time slot created successfully',
        data: slot
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSlot(req, res, next) {
    try {
      const { is_available } = req.body;
      const slot = await TimeslotUseCase.updateAvailability(req.params.id, is_available);
      res.status(200).json({
        status: 'success',
        message: `Time slot marked as ${is_available ? 'available' : 'unavailable'}`,
        data: slot
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteSlot(req, res, next) {
    try {
      await TimeslotUseCase.deleteSlot(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Time slot deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = TimeslotController;
