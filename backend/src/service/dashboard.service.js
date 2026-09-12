import WorkspaceMember from "../models/WorkspaceMember.js";
import ApiError from "../utlis/apiError.js";
import Board from '../models/Board.js'
import BoardMember from '../models/BoardMember.js'
import Task from '../models/Task.js'
import redisConnection from "../config/redis.js";
import { AuditLog } from "../models/Audit.js";

const buildAuditMessage = (activity) => {
  const userName = activity.userId?.name || "Someone";
  const title = activity.details?.title || activity.details?.name || "item";

  switch (activity.action) {
    case "BOARD_CREATED":
      return `${userName} created board "${activity.details?.name || "Untitled board"}"`;
    case "BOARD_UPDATED":
      return `${userName} updated board "${activity.details?.name || "Untitled board"}"`;
    case "BOARD_DELETED":
      return `${userName} deleted board "${activity.details?.name || "Untitled board"}"`;
    case "TASK_CREATED":
      return `${userName} created task "${title}"`;
    case "TASK_UPDATED":
      return `${userName} updated task "${title}"`;
    case "TASK_DELETED":
      return `${userName} deleted task "${title}"`;
    case "TASK_MOVED":
      return `${userName} moved task "${title}" from "${activity.details?.fromColumnName || "previous column"}" to "${activity.details?.toColumnName || "new column"}"`;
    default:
      return `${userName} performed an activity`;
  }
};

const getRelativeTime = (dateValue) => {
  const diffInMinutes = Math.max(0, Math.round((Date.now() - new Date(dateValue).getTime()) / 60000));

  if (diffInMinutes < 1) {
    return "just now";
  }

  if (diffInMinutes < 60) {
    const minutes = diffInMinutes;
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.round(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRelativeActivityColors = (action) => {
  const colorMap = {
    BOARD_CREATED: "bg-indigo-500",
    BOARD_UPDATED: "bg-sky-500",
    BOARD_DELETED: "bg-rose-500",
    TASK_CREATED: "bg-emerald-500",
    TASK_UPDATED: "bg-amber-500",
    TASK_DELETED: "bg-rose-500",
    TASK_MOVED: "bg-violet-500",
  };

  return colorMap[action] || "bg-slate-500";
};

const getInitials = (name = "User") => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
};

const getRecentActivities = async (userId, workspaceId) => {
  const workspaceMember = await WorkspaceMember.findOne({
    userId,
    workspaceId,
  });

  if (!workspaceMember) {
    throw new ApiError(403, "You are not a member of this workspace");
  }

  const recentActivities = await AuditLog.find({ workspaceId })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return recentActivities.map((activity) => ({
    _id: activity._id,
    action: activity.action,
    message: buildAuditMessage(activity),
    timeLabel: getRelativeTime(activity.createdAt),
    initials: getInitials(activity.userId?.name),
    colorClass: getRelativeActivityColors(activity.action),
    createdAt: activity.createdAt,
    details: activity.details,
  }));
};

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
  getRecentActivities,
}