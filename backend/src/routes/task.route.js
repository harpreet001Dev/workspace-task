import express from "express";
import authtenticateUser from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { createTask } from "../controllers/task.controller.js";
import { createTaskSchema } from "../validatioins/task.validation.js";

const router = express.Router();

router.post(
  "/:boardId",
  authtenticateUser,
  authorizeRole("owner", "member"),
  validate(createTaskSchema),
  createTask
);

export default router;