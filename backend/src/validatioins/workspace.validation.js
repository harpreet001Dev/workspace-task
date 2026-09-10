import joi from "joi";

export const createWorkspaceSchema = joi.object({
  name: joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: joi.string()
    .trim()
    .max(500)
    .optional()
});