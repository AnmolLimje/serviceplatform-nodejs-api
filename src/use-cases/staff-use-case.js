const bcrypt = require('bcrypt');
const StaffRepository = require('../data-access/staff-repository');
const AppError = require('../utils/errors');

const StaffUseCase = {
  async getAllStaff() {
    const staff = await StaffRepository.findAll();
    return staff.map(s => {
      delete s.password_hash;
      return s;
    });
  },

  async getRoles() {
    return await StaffRepository.findAllRoles();
  },

  async createStaff(adminId, staffData) {
    const existing = await StaffRepository.findByEmail(staffData.email);
    if (existing) throw new AppError('Email already registered as staff', 400);

    const password_hash = await bcrypt.hash(staffData.password, 12);
    const staffId = await StaffRepository.create({
      ...staffData,
      admin_id: adminId,
      password_hash,
      role_id: staffData.role_id || 3 // Default to Technician
    });

    return { id: staffId, ...staffData };
  },

  async deleteStaff(id) {
    await StaffRepository.delete(id);
  }
};

module.exports = StaffUseCase;
