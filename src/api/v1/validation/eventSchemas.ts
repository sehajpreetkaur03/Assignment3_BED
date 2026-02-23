import Joi from "joi";

const EVENT_ID_REGEX = /^evt_\d{6}$/;

export const eventSchemas = {
  create: {
    body: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      date: Joi.string().isoDate().required(),
      capacity: Joi.number().integer().min(5).required(),

      // defaults match demo
      registrationCount: Joi.number().integer().min(0).default(0),
      status: Joi.string()
        .valid("active", "cancelled","scheduled")
        .default("active"),
      category: Joi.string()
        .valid("general", "conference", "workshop", "networking")
        .default("general"),
    }),
  },

  idParam: {
    params: Joi.object({
      id: Joi.string().pattern(EVENT_ID_REGEX).required(),
    }),
  },

  update: {
    params: Joi.object({
      id: Joi.string().pattern(EVENT_ID_REGEX).required(),
    }),
    body: Joi.object({
      name: Joi.string().min(3).max(50),
      date: Joi.string().isoDate(),
      capacity: Joi.number().integer().min(5),
      registrationCount: Joi.number().integer().min(0),
      status: Joi.string().valid("active", "cancelled","scheduled"),
      category: Joi.string().valid("general", "conference", "workshop", "networking"),
    }).min(1),
  },
};