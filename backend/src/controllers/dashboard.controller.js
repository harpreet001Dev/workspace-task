
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

export const getRecentActivities = asyncHandler(async (req, res) => {
  const activities = await dashboardService.getRecentActivities(
    req.user._id,
    req.user.workspaceId
  );

  return res.status(200).json({
    success: true,
    message: "Recent activities fetched successfully",
    data: activities,
  });
});

export const getProfile =asyncHandler(async(req,res)=>{
   const profile = await dashboardService.getProfile(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
})