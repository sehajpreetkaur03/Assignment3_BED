import Joi from "joi";

export const eventSchemas = {
  // POST /api/v1/events
  create: {
    body: Joi.object({
      name: Joi.string().min(3).required(),

      date: Joi.string().isoDate().required(),

      capacity: Joi.number().integer().min(5).required(),

      registrationCount: Joi.number().integer().min(0).default(0),

      status: Joi.string()
        .valid("active", "cancelled", "completed")
        .default("active"),

        
      category: Joi.string().default("general"),
    }),
  },

 
  idParam: {
    params: Joi.object({
      id: Joi.string().pattern(/^evt_\d{6}$/).required(),
    }),
  },

  // PUT /api/v1/events/:id
  update: {
    params: Joi.object({
      id: Joi.string().pattern(/^evt_\d{6}$/).required(),
    }),
    body: Joi.object({
      name: Joi.string().min(3).optional(),
      date: Joi.string().isoDate().optional(),
      capacity: Joi.number().integer().min(5).optional(),
      registrationCount: Joi.number().integer().min(0).optional(),
      status: Joi.string().valid("active", "cancelled", "completed").optional(),
      category: Joi.string().optional(),
    }).min(1),
  },
};