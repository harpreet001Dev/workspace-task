import Task from "../models/Task.js";
import Board from "../models/Board.js";
import Column from "../models/Column.js";
import ApiError from "../utlis/apiError.js";

const createTask = async (boardId, createdBy, data) => {
  const {
    title,
    description,
    columnId,
    priority,
    order,
  } = data;

  // Check board exists
  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  // Check column exists and belongs to this board
  const column = await Column.findOne({
    _id: columnId,
    boardId,
  });

  if (!column) {
    throw new ApiError(
      400,
      "Column does not belong to this board"
    );
  }

  // Create task
  const task = await Task.create({
    title,
    description,
    boardId,
    columnId,
    createdBy,
    priority,
    order,
  });

  return task;
};

export default {
  createTask,
};