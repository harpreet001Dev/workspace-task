import joi from "joi";

export const createBoardSchema = joi.object({
    name: joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),
});

export const createColumnSchema = joi.object({
  name: joi.string()
    .valid("To Do", "In Progress", "Done")
    .required(),

  order: joi.number()
    .integer()
    .min(1)
    .required(),
});