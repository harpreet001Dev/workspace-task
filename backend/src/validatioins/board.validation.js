import joi from "joi";
import mongoose from "mongoose";

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


export const addBoardMemberSchema = joi.object({
  userId: joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .required(),
});