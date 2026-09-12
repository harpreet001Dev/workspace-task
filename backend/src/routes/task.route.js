import express from "express";
import authtenticateUser from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  createTask,
  getAllTasks,
  uploadTaskAttachments,
  getTaskAttachments,
  updateTask,
  deleteTask,
  moveTask,
} from "../controllers/task.controller.js";
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
} from "../validatioins/task.validation.js";

const router = express.Router();

router.post(
  "/:boardId",
  authtenticateUser,
  authorizeRole("owner", "member"),
  upload.array("files", 10),
  validate(createTaskSchema),
  createTask
);

router.get(
  "/:taskId/attachments",
  authtenticateUser,
  authorizeRole("owner", "member"),
  getTaskAttachments
);

router.post(
  "/:taskId/attachments",
  authtenticateUser,
  authorizeRole("owner", "member"),
  upload.array("files", 10),
  uploadTaskAttachments
);

router.get(
  "/:boardId/get",
  authtenticateUser,
  authorizeRole("owner", "member"),
  getAllTasks
);

router.patch(
  "/:taskId",
  authtenticateUser,
  authorizeRole("owner", "member"),
  validate(updateTaskSchema),
  updateTask
);

router.delete(
  "/:taskId",
  authtenticateUser,
  authorizeRole("owner", "member"),
  deleteTask
);

router.patch(
  "/:taskId/move",
  authtenticateUser,
  authorizeRole("owner", "member"),
  validate(moveTaskSchema),
  moveTask
);

export default router;