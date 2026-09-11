import asyncHandler from '../utlis/asyncHandler.js';
import workspaceService from '../service/workspace.service.js'
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import ApiError from '../utlis/apiError.js';

export const createWorkspace = async (req, res) => {

    const workspace = await workspaceService.createWorkspace(
         req.user._id,
        req.body
    );

    const user = await User.findById(req.user._id);
    const accessToken = user.generateAccessToken(workspace._id, 'owner');

    return res.status(201).json({
        success: true,
        message: "Workspace added successfully",
        data: {
            workspace: {
                _id: workspace._id,
                name: workspace.name,
                description: workspace.description,
                role: 'owner',
            },
            accessToken,
        },
    });
};


export const createInvite = asyncHandler(async (req, res) => {
    const workspaceId = req.user.workspaceId;
    console.log(workspaceId,"workspaceId")

    if (!workspaceId) {
        throw new ApiError(400, "Workspace not found for current user");
    }

    const invite = await workspaceService.createInvite(
        workspaceId,
        req.user._id 
    );

    return res.status(201).json({
        success: true,
        message: "Invitation created successfully",
        data: invite,
    });
});

export const acceptInvite = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const result = await workspaceService.acceptInvite(
        token,
        req.user._id
    );

    const user = await User.findById(req.user._id);
    const workspace = await Workspace.findById(result.workspaceId).select("_id name");
    const accessToken = user.generateAccessToken(workspace._id, "member");

    return res.status(200).json({
        success: true,
        message: "Invitation accepted successfully",
        data: {
            workspaceId: workspace._id,
            workspace: {
                _id: workspace._id,
                name: workspace.name,
                role: "member",
            },
            accessToken,
            member: result.member,
        },
    });
});