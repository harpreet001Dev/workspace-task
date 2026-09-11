
import asyncHandler from "../utlis/asyncHandler.js";
import dashboardService from '../service/dashboard.service.js'

export const getDashboard = asyncHandler(async (req, res) => {
  
  const task = await dashboardService.getDashboard(
    req.user._id,
    req.user.workspaceId
  );

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});