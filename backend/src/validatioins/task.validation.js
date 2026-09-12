import joi from "joi";
import mongoose from "mongoose";

const validateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }

  return value;
};

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

  assignedTo: joi.string()
    .custom(validateObjectId)
    .required(),
});

export const updateTaskSchema = joi.object({
  title: joi.string()
    .trim()
    .min(2)
    .max(200)
    .optional(),

  description: joi.string()
    .trim()
    .max(2000)
    .allow("")
    .optional(),

  priority: joi.string()
    .valid("low", "medium", "high")
    .optional(),

  assignedTo: joi.alternatives()
    .try(
      joi.string().custom(validateObjectId),
      joi.valid(null)
    )
    .optional(),
})
  .min(1)
  .unknown(false);

export const moveTaskSchema = joi.object({
  columnId: joi.string()
    .required(),

  order: joi.number()
    .integer()
    .min(1)
    .required(),
});