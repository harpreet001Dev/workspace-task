import asyncHandler from "../utlis/asyncHandler.js";
import taskService from "../service/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const task = await taskService.createTask(
    boardId,
    req.user._id,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});