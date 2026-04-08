const StaffUseCase = require('../use-cases/staff-use-case');

const StaffController = {
  async getAllStaff(req, res, next) {
    try {
      const staff = await StaffUseCase.getAllStaff();
      res.status(200).json({
        status: 'success',
        results: staff.length,
        data: staff
      });
    } catch (err) {
      next(err);
    }
  },

  async getRoles(req, res, next) {
    try {
      const roles = await StaffUseCase.getRoles();
      res.status(200).json({
        status: 'success',
        data: roles
      });
    } catch (err) {
      next(err);
    }
  },

  async createStaff(req, res, next) {
    try {
      const staff = await StaffUseCase.createStaff(req.user.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Staff member created successfully',
        data: staff
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteStaff(req, res, next) {
    try {
      await StaffUseCase.deleteStaff(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = StaffController;
