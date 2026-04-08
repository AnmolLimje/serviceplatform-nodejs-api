const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().allow('', null),
    address: Joi.string().allow('', null)
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required()
  })
};

const serviceSchemas = {
  create: Joi.object({
    category_id: Joi.number().integer().required(),
    name: Joi.string().required().max(150),
    description: Joi.string().allow('', null),
    price: Joi.number().precision(2).required(),
    duration_minutes: Joi.number().integer().required()
  }),
  update: Joi.object({
    category_id: Joi.number().integer(),
    name: Joi.string().max(150),
    description: Joi.string().allow('', null),
    price: Joi.number().precision(2),
    duration_minutes: Joi.number().integer()
  })
};

const bookingSchemas = {
  create: Joi.object({
    service_id: Joi.number().integer().required(),
    booking_time: Joi.date().iso().required(),
    notes: Joi.string().allow('', null)
  }),
  updateStatus: Joi.object({
    status: Joi.string().valid('Pending', 'Confirmed', 'Completed', 'Cancelled').required()
  }),
  reschedule: Joi.object({
    booking_time: Joi.date().iso().greater('now').required()
  }),
  assignStaff: Joi.object({
    staff_id: Joi.number().integer().required(),
    notes: Joi.string().allow('', null)
  })
};

const reviewSchemas = {
  addService: Joi.object({
    booking_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null)
  }),
  addUser: Joi.object({
    booking_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null)
  })
};

const staffSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().allow('', null),
    role_id: Joi.number().integer().optional()
  })
};

const timeslotSchemas = {
  create: Joi.object({
    service_id: Joi.number().integer().required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().greater(Joi.ref('start_time')).required()
  }),
  update: Joi.object({
    is_available: Joi.boolean().required()
  })
};

module.exports = { authSchemas, serviceSchemas, bookingSchemas, reviewSchemas, staffSchemas, timeslotSchemas };
