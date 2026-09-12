import WorkspaceMember from "../models/WorkspaceMember.js";
import ApiError from "../utlis/apiError.js";
import Board from '../models/Board.js'
import BoardMember from '../models/BoardMember.js'
import Task from '../models/Task.js'
import redisConnection from "../config/redis.js";

const getDashboard = async (userId, workspaceId) => {


  //   checking workspace member 
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

  const cacheKey = `dashboard:${userId}:${workspaceId}`;
  const cachedDashboard = await redisConnection.get(cacheKey);
  if (cachedDashboard) {
     console.log("DASHBOARD CACHE HIT - fetching from Redis");
    return JSON.parse(cachedDashboard);
  }

 console.log("DASHBOARD CACHE MISS - fetching from MongoDB");
  const boardMemberships = await BoardMember.find({
    userId,
  }).select("boardId");

  const boardIds = boardMemberships.map(
    (member) => member.boardId
  );

  const workspaceBoards = await Board.find({
    workspaceId,
  }).select("_id name");

  const workspaceBoardIds = workspaceBoards.map((board) => board._id);

  // 3. Get user's projects in this workspace
  const projects = await Board.find({
    _id: { $in: boardIds },
    workspaceId,
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("_id name createdAt");

  const projectsWithMembers = await Promise.all(
    projects.map(async (project) => {
      const totalMembers = await BoardMember.countDocuments({
        boardId: project._id,
      });

      return {
        ...project.toObject(),
        totalMembers,
      };
    })
  );

  const totalProjects = await Board.countDocuments({
    _id: { $in: boardIds },
    workspaceId,
  });

  // 4. Get user's tasks
  const taskFilter = {
    assignedTo: userId,
    boardId: { $in: boardIds },
  };

  const totalTasks = await Task.countDocuments(taskFilter);

  const myTasks = await Task.find(taskFilter)
    .populate("boardId", "name")
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const allTasks = await Task.find({
    boardId: { $in: workspaceBoardIds },
  })
    .populate("boardId", "name")
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // 5. Workspace member count
  const totalMembers = await WorkspaceMember.countDocuments({
    workspaceId,
  });

  const dashboardData = {
    stats: {
      totalProjects,
      myTasks: totalTasks,
      members: totalMembers,
    },
    projectsWithMembers,
    myTasks,
    allTasks,
  };
  console.log("Saving dashboard to Redis cache");
  await redisConnection.set(
    cacheKey,
    JSON.stringify(dashboardData),
    "EX",
    300  // 5min
  );
   console.log("Dashboard cached for 5 minutes");
  return dashboardData;
};

export default {
  getDashboard,
}