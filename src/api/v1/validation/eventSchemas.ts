import Joi from "joi";

const allowedStatus = ["active", "cancelled"] as const;
const allowedCategory = ["general", "workshop", "networking"] as const;

// Helper: ISO date string (like 2025-12-25T09:00:00.000Z)
const isoDateString = Joi.string().isoDate().messages({
  "string.isoDate": "Date must be a valid ISO date",
});

export const eventSchemas = {
  create: {
    body: Joi.object({
      name: Joi.string().min(3).max(50).required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 50 characters",
      }),

      date: isoDateString.required().messages({
        "any.required": "Date is required",
        "string.empty": "Date cannot be empty",
      }),

      capacity: Joi.number().integer().min(1).max(5000).required().messages({
        "any.required": "Capacity is required",
        "number.base": "Capacity must be a number",
        "number.integer": "Capacity must be an integer",
        "number.min": "Capacity must be at least 1",
        "number.max": "Capacity must be at most 5000",
      }),

      // Defaults (based on your screenshot)
      status: Joi.string()
        .valid(...allowedStatus)
        .default("active")
        .messages({
          "any.only": `Status must be one of: ${allowedStatus.join(", ")}`,
        }),

      category: Joi.string()
        .valid(...allowedCategory)
        .default("general")
        .messages({
          "any.only": `Category must be one of: ${allowedCategory.join(", ")}`,
        }),
    }),
  },

  idParam: {
    params: Joi.object({
      id: Joi.string().pattern(/^evt_\d{6}$/).required().messages({
        "any.required": "Event ID is required",
        "string.empty": "Event ID cannot be empty",
        "string.pattern.base": "Event ID must match format evt_000001",
      }),
    }),
  },

  update: {
    params: Joi.object({
      id: Joi.string().pattern(/^evt_\d{6}$/).required().messages({
        "any.required": "Event ID is required",
        "string.pattern.base": "Event ID must match format evt_000001",
      }),
    }),
    body: Joi.object({
      name: Joi.string().min(3).max(50).optional().messages({
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 50 characters",
      }),
      date: isoDateString.optional(),
      capacity: Joi.number().integer().min(1).max(5000).optional().messages({
        "number.base": "Capacity must be a number",
        "number.integer": "Capacity must be an integer",
        "number.min": "Capacity must be at least 1",
        "number.max": "Capacity must be at most 5000",
      }),
      status: Joi.string().valid(...allowedStatus).optional(),
      category: Joi.string().valid(...allowedCategory).optional(),
    }).min(1).messages({
      "object.min": "At least one field is required to update",
    }),
  },
};