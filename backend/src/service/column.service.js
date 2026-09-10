import Column from "../models/Column.js";
import Board from "../models/Board.js";
import ApiError from "../utlis/apiError.js";

const createColumn = async (boardId, data) => {
  const { name, order } = data;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const column = await Column.create({
    name,
    boardId,
    order,
  });

  return column;
};

export default {
  createColumn,
};