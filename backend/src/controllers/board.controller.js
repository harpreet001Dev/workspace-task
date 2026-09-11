import asyncHandler from "../utlis/asyncHandler.js";
import boardService from "../service/board.service.js";
import columnService from "../service/column.service.js";

export const createBoard = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const board = await boardService.createBoard(
    workspaceId,
    req.user._id,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Board created successfully",
    data: board,
  });
});

export const createColumn = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const column = await columnService.createColumn(
    boardId,
    req.body
  );

  return res.status(201).json({
    success: true,
    message: "Column created successfully",
    data: column,
  });
});

export const addBoardMember = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.body;

  const boardMember = await boardService.addBoardMember(
    boardId,
    req.user._id,
    userId
  );
  res.status(201).json({
    success: true,
    message: "Board member added successfully",
    data: boardMember,
  });


})

export const getBoards = asyncHandler(async (req, res) => {
  const board = await boardService.getUserBoards(
    req.user._id,
  );
  res.status(201).json({
    success: true,
    message: "Boards fetched successfully",
    data: board,
  });
})