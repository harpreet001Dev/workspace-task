import asyncHandler from "../utlis/asyncHandler.js";
import taskService from "../service/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const task = await taskService.createTask(
    boardId,
    req.user._id,
    req.body,
    req.files || []
  );

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

export const uploadTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const attachments = await taskService.uploadTaskAttachments(
    taskId,
    req.user._id,
    req.files || []
  );

  return res.status(200).json({
    success: true,
    message: "Attachments uploaded successfully",
    data: attachments,
  });
});

export const getTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const attachments = await taskService.getTaskAttachments(taskId);

  return res.status(200).json({
    success: true,
    message: "Attachments fetched successfully",
    data: attachments,
  });
});

export const getAllTasks = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const tasks = await taskService.getAllTasks(boardId);

  return res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    data: tasks,
  });
});

