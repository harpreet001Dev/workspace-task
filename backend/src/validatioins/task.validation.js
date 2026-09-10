import joi from "joi";

export const createTaskSchema = joi.object({
  title: joi.string()
    .trim()
    .min(2)
    .max(200)
    .required(),

  description: joi.string()
    .trim()
    .max(2000)
    .optional(),

  columnId: joi.string()
    .required(),

  priority: joi.string()
    .valid("low", "medium", "high")
    .default("medium"),

  order: joi.number()
    .integer()
    .min(1)
    .required(),
});