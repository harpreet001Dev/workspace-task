import asyncHandler from '../utlis/asyncHandler.js';
import workspaceService from '../service/workspace.service.js'

export const createWorkspace = async (req, res) => {

    const workspace = await workspaceService.createWorkspace(
         req.user._id,
        req.body
    );

    return res.status(201).json({
        success: true,
        message: "Workspace added successfully",
        data: workspace,
    });
};


export const createInvite = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;

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

    return res.status(200).json({
        success: true,
        message: "Invitation accepted successfully",
        data: result,
    });
});