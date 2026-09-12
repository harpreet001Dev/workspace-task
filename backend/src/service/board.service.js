
import ApiError from "../utlis/apiError.js";
import Workspace from "../models/Workspace.js";
import Board from "../models/Board.js";
import BoardMember from "../models/BoardMember.js";
import WorkspaceMember from '../models/WorkspaceMember.js'
import Column from '../models/Column.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';
import auditLogQueue from "../queues/auditLog.queue.js";
import redisConnection from "../config/redis.js";

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

  await redisConnection.del(`dashboard:${createdBy}:${workspaceId}`);
  console.log("Deleted redis cache")

  const defaultColumns = [
    { name: "To do", boardId: board._id, order: 1 },
    { name: "In progress", boardId: board._id, order: 2 },
    { name: "Review", boardId: board._id, order: 3 },
    { name: "Done", boardId: board._id, order: 4 },
  ];

  await Column.insertMany(defaultColumns);

  await auditLogQueue.add("create-audit-log", {
    action: "BOARD_CREATED",
    userId: createdBy,
    workspaceId,
    entityType: "BOARD",
    entityId: board._id,
    details: {
      name: board.name,
    },
  });

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

// const getUserBoards = async (userId, workspaceId, query) => {
//   const { limit, cursor } = query;
//   let cursorData = null;

//   if (cursor) {
//     cursorData = JSON.parse(
//       Buffer.from(cursor, "base64").toString("utf-8")
//     );
//   }
//   // 1. Verify user belongs to workspace
//   const workspaceMember = await WorkspaceMember.findOne({
//     userId,
//     workspaceId,
//   });

//   if (!workspaceMember) {
//     throw new ApiError(
//       403,
//       "You are not a member of this workspace"
//     );
//   }

//   // 2. Get projects the user belongs to
//   const projects = await BoardMember.aggregate([
//     {
//       $match: {
//         userId: new mongoose.Types.ObjectId(userId),
//       },
//     },

//     // 3. Get project/board details
//     {
//       $lookup: {
//         from: "boards",
//         localField: "boardId",
//         foreignField: "_id",
//         as: "project",
//       },
//     },

//     {
//       $unwind: "$project",
//     },

//     // 4. Make sure project belongs to requested workspace
//     {
//       $match: {
//         "project.workspaceId":
//           new mongoose.Types.ObjectId(workspaceId),
//       },
//     },

//     // 5. Get all members of each project
//     {
//       $lookup: {
//         from: "boardmembers",
//         localField: "project._id",
//         foreignField: "boardId",
//         as: "members",
//       },
//     },

//     // 6. Get board columns
//     {
//       $lookup: {
//         from: "columns",
//         localField: "project._id",
//         foreignField: "boardId",
//         as: "columns",
//       },
//     },

//     // 7. Shape response
//     {
//       $project: {
//         _id: "$project._id",
//         name: "$project.name",
//         description: "$project.description",
//         workspaceId: "$project.workspaceId",
//         createdBy: "$project.createdBy",
//         createdAt: "$project.createdAt",
//         totalMembers: {
//           $size: "$members",
//         },
//         columns: {
//           $map: {
//             input: { $sortArray: { input: "$columns", sortBy: { order: 1 } } },
//             as: "column",
//             in: {
//               _id: "$$column._id",
//               name: "$$column.name",
//               order: "$$column.order",
//             },
//           },
//         },
//       },
//     },

//     // 8. Newest projects first
//     {
//       $sort: {
//         createdAt: -1,
//       },
//     },
//   ]);

//   const boardIds = projects.map((project) => project._id);

//   const boardMembers = await BoardMember.find({ boardId: { $in: boardIds } })
//     .populate("userId", "_id name email")
//     .lean();

//   const membersByBoardId = {};

//   boardMembers.forEach((member) => {
//     const boardId = member.boardId.toString();

//     if (!membersByBoardId[boardId]) {
//       membersByBoardId[boardId] = [];
//     }

//     membersByBoardId[boardId].push({
//       _id: member.userId?._id || member.userId,
//       name: member.userId?.name || "Unknown",
//       email: member.userId?.email || "",
//       role: member.role || "member",
//     });
//   });

//   return projects.map((project) => ({
//     ...project,
//     totalMembers: membersByBoardId[project._id.toString()]?.length || 0,
//     members: membersByBoardId[project._id.toString()] || [],
//   }));
// };
const getUserBoards = async (userId, workspaceId, query) => {
  const { limit, cursor } = query;

  const pageSize = Number(limit) || 10;

  let cursorData = null;

  if (cursor) {
    cursorData = JSON.parse(
      Buffer.from(cursor, "base64").toString("utf-8")
    );
  }

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

  // 2. Build aggregation pipeline
  const pipeline = [];

  // 3. Apply cursor
  if (cursorData) {
    pipeline.push({
      $match: {
        $or: [
          {
            createdAt: {
              $lt: new Date(cursorData.createdAt),
            },
          },
          {
            createdAt: new Date(cursorData.createdAt),
            _id: {
              $lt: new mongoose.Types.ObjectId(
                cursorData.boardId
              ),
            },
          },
        ],
      },
    });
  }

  // 4. Get board members
  pipeline.push({
    $lookup: {
      from: "boardmembers",
      localField: "_id",
      foreignField: "boardId",
      as: "members",
    },
  });

  // 5. Get board columns
  pipeline.push({
    $lookup: {
      from: "columns",
      localField: "_id",
      foreignField: "boardId",
      as: "columns",
    },
  });

  // 6. Return required data
  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      createdAt: 1,
      columns: {
        $map: {
          input: {
            $sortArray: {
              input: "$columns",
              sortBy: { order: 1 },
            },
          },
          as: "column",
          in: {
            _id: "$$column._id",
            name: "$$column.name",
            order: "$$column.order",
          },
        },
      },
      totalMembers: {
        $size: "$members",
      },
      totalColumns: {
        $size: "$columns",
      },
    },
  });

  // 7. Sort newest → oldest
  pipeline.push({
    $sort: {
      createdAt: -1,
      _id: -1,
    },
  });

  // 8. Get requested number of boards
  pipeline.push({
    $limit: pageSize,
  });

  const boards = await Board.aggregate(pipeline);

  const boardIds = boards.map((board) => board._id);

  const boardMembers = await BoardMember.find({
    boardId: { $in: boardIds },
  })
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

  const enrichedBoards = boards.map((board) => ({
    ...board,
    columns: (board.columns || []).map((column) => ({
      _id: column._id,
      name: column.name,
      order: column.order,
    })),
    members: membersByBoardId[board._id.toString()] || [],
    totalMembers: membersByBoardId[board._id.toString()]?.length || 0,
    totalColumns: board.columns?.length || 0,
  }));

  // 9. Create next cursor
  let nextCursor = null;

  if (enrichedBoards.length > 0) {
    const lastBoard = enrichedBoards[enrichedBoards.length - 1];

    nextCursor = Buffer.from(
      JSON.stringify({
        createdAt: lastBoard.createdAt,
        boardId: lastBoard._id,
      })
    ).toString("base64");
  }

  // 10. Check if more boards may exist
  const hasMore = enrichedBoards.length === pageSize;

  return {
    boards: enrichedBoards,
    nextCursor,
    hasMore,
  };
};

const getBoardDetails = async (boardId, userId) => {
  const board = await Board.findById(boardId).lean();

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const isMember = await BoardMember.findOne({
    boardId,
    userId,
  }).lean();

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this board");
  }

  const [columns, boardMembers] = await Promise.all([
    Column.find({ boardId }).sort({ order: 1 }).lean(),
    BoardMember.find({ boardId })
      .populate("userId", "_id name email")
      .lean(),
  ]);

  const members = boardMembers.map((member) => ({
    _id: member.userId?._id || member.userId,
    name: member.userId?.name || "Unknown",
    email: member.userId?.email || "",
    role: member.role || "member",
  }));

  return {
    ...board,
    members,
    columns,
    totalMembers: members.length,
    totalColumns: columns.length,
  };
};

const updateBoard = async (boardId, userId, data) => {
  const board = await Board.findById(boardId);

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  const workspace = await Workspace.findById(board.workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the workspace owner can update this board");
  }

  const { name } = data;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Board name is required");
  }

  const updatedBoard = await Board.findByIdAndUpdate(
    boardId,
    { $set: { name: name.trim() } },
    { new: true }
  ).lean();

  return updatedBoard;
};

export default { createBoard, addBoardMember, getUserBoards, getBoardDetails, updateBoard }