import Task from "../models/Task.js";
import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Attachment from "../models/Attachment.js";
import ApiError from "../utlis/apiError.js";

const createTaskAttachments = async (taskId, uploadedBy, files = []) => {
  if (!files || files.length === 0) {
    return [];
  }

  const attachments = files.map((file) => ({
    taskId,
    uploadedBy,
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    path: `/uploads/${file.filename}`,
  }));

  return Attachment.insertMany(attachments);
};

const createTask = async (boardId, createdBy, data, files = []) => {
  const {
    title,
    description,
    columnId,
    priority,
    order,
    assignedTo,
  } = data;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const column = await Column.findOne({
    _id: columnId,
    boardId,
  });

  if (!column) {
    throw new ApiError(400, "Column does not belong to this board");
  }

  const task = await Task.create({
    title,
    description,
    boardId,
    columnId,
    createdBy,
    priority,
    order,
    assignedTo,
  });

  const attachments = await createTaskAttachments(task._id, createdBy, files);

  return {
    ...task.toObject(),
    attachments,
  };
};

const uploadTaskAttachments = async (taskId, uploadedBy, files = []) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return createTaskAttachments(task._id, uploadedBy, files);
};

const getTaskAttachments = async (taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return Attachment.find({ taskId }).sort({ createdAt: 1 }).lean();
};

const getAllTasks = async (boardId) => {
  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const tasks = await Task.find({ boardId })
    .populate("assignedTo", "name")
    .populate("columnId", "name")
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const taskIds = tasks.map((task) => task._id);
  const attachments = await Attachment.find({ taskId: { $in: taskIds } })
    .sort({ createdAt: 1 })
    .lean();

  const attachmentsByTaskId = attachments.reduce((acc, attachment) => {
    const taskIdString = attachment.taskId.toString();

    if (!acc[taskIdString]) {
      acc[taskIdString] = [];
    }

    acc[taskIdString].push(attachment);
    return acc;
  }, {});

  return tasks.map((task) => ({
    ...task,
    attachments: attachmentsByTaskId[task._id.toString()] || [],
  }));
};

const moveTask = async (taskId, columnId, order) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const targetColumn = await Column.findOne({
    _id: columnId,
    boardId: task.boardId,
  });

  if (!targetColumn) {
    throw new ApiError(400, "Column does not belong to this board");
  }

  const sourceColumnId = task.columnId;

  // Remove task from its current position
  await Task.updateMany(
    {
      boardId: task.boardId,
      columnId: sourceColumnId,
      order: { $gt: task.order },
    },
    {
      $inc: { order: -1 },
    }
  );

  // Make space in destination column
  await Task.updateMany(
    {
      boardId: task.boardId,
      columnId: columnId,
      order: { $gte: order },
      _id: { $ne: taskId },
    },
    {
      $inc: { order: 1 },
    }
  );

  // Move the task
  task.columnId = columnId;
  task.order = order;

  await task.save();

  return task;
};

export default {
  createTask,
  uploadTaskAttachments,
  getTaskAttachments,
  getAllTasks,
  moveTask,
};