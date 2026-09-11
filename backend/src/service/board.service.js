
import ApiError from "../utlis/apiError.js";
import Workspace from "../models/Workspace.js";
import Board from "../models/Board.js";
import BoardMember from "../models/BoardMember.js";
import WorkspaceMember from '../models/WorkspaceMember.js'
import Column from '../models/Column.js';
import mongoose from 'mongoose';

const createBoard = async (workspaceId, createdBy, data) => {
    const { name } = data;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    const board = await Board.create({
        name,
        workspaceId,
        createdBy,
    });

    await BoardMember.create({
        boardId: board._id,
        userId: createdBy,
    });

    const defaultColumns = [
        { name: "To do", boardId: board._id, order: 1 },
        { name: "In progress", boardId: board._id, order: 2 },
        { name: "Review", boardId: board._id, order: 3 },
        { name: "Done", boardId: board._id, order: 4 },
    ];

    await Column.insertMany(defaultColumns);

    return board;
};

const addBoardMember = async (boardId, requestingUserId, userId) => {
    const board = await Board.findById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    if (board.createdBy.toString() !== requestingUserId.toString()) {
        throw new ApiError(
            403,
            "Only the board creator can add members"
        );
    }
    const workspaceMember = await WorkspaceMember.findOne({
        userId,
        workspaceId: board.workspaceId,
    });

    if (!workspaceMember) {
        throw new ApiError(
            400,
            "User is not a member of this workspace"
        );
    }
    const existingMember = await BoardMember.findOne({
        boardId,
        userId,
    });

    if (existingMember) {
        throw new ApiError(
            409,
            "User is already a board member"
        );
    }

    // Add board member
    const boardMember = await BoardMember.create({
        boardId,
        userId,
    });

    return boardMember;
}

const getUserBoards = async (userId, workspaceId) => {
  // 1. Verify user belongs to workspace
  const workspaceMember = await WorkspaceMember.findOne({
    userId,
    workspaceId,
  });

  if (!workspaceMember) {
    throw new ApiError(
      403,
      "You are not a member of this workspace"
    );
  }

  // 2. Get projects the user belongs to
  const projects = await BoardMember.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    // 3. Get project/board details
    {
      $lookup: {
        from: "boards",
        localField: "boardId",
        foreignField: "_id",
        as: "project",
      },
    },

    {
      $unwind: "$project",
    },

    // 4. Make sure project belongs to requested workspace
    {
      $match: {
        "project.workspaceId":
          new mongoose.Types.ObjectId(workspaceId),
      },
    },

    // 5. Get all members of each project
    {
      $lookup: {
        from: "boardmembers",
        localField: "project._id",
        foreignField: "boardId",
        as: "members",
      },
    },

    // 6. Get board columns
    {
      $lookup: {
        from: "columns",
        localField: "project._id",
        foreignField: "boardId",
        as: "columns",
      },
    },

    // 7. Shape response
    {
      $project: {
        _id: "$project._id",
        name: "$project.name",
        description: "$project.description",
        workspaceId: "$project.workspaceId",
        createdBy: "$project.createdBy",
        createdAt: "$project.createdAt",
        totalMembers: {
          $size: "$members",
        },
        columns: {
          $map: {
            input: { $sortArray: { input: "$columns", sortBy: { order: 1 } } },
            as: "column",
            in: {
              _id: "$$column._id",
              name: "$$column.name",
              order: "$$column.order",
            },
          },
        },
      },
    },

    // 8. Newest projects first
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const boardIds = projects.map((project) => project._id);

  const boardMembers = await BoardMember.find({ boardId: { $in: boardIds } })
    .populate("userId", "_id name email")
    .lean();

  const membersByBoardId = {};

  boardMembers.forEach((member) => {
    const boardId = member.boardId.toString();

    if (!membersByBoardId[boardId]) {
      membersByBoardId[boardId] = [];
    }

    membersByBoardId[boardId].push({
      _id: member.userId?._id || member.userId,
      name: member.userId?.name || "Unknown",
      email: member.userId?.email || "",
      role: member.role || "member",
    });
  });

  return projects.map((project) => ({
    ...project,
    totalMembers: membersByBoardId[project._id.toString()]?.length || 0,
    members: membersByBoardId[project._id.toString()] || [],
  }));
};

export default { createBoard, addBoardMember ,getUserBoards }