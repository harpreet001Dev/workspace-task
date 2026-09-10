
import Workspace from "../models/Workspace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import WorkspaceInvite from "../models/workspaceInvite.js";
import mongoose from "mongoose";
import crypto from "crypto";
import ApiError from "../utlis/apiError.js";


const createWorkspace = async (ownerId, data) => {
    const { name, description, } = data;

    const session = await mongoose.startSession();
    try {
        let workspace;
        await session.withTransaction(async()=>{
            const createWorkspace=await Workspace.create([
                {
                    name,
                    description,
                    ownerId
                },
            ],{session})

            workspace = createWorkspace[0];
             await WorkspaceMember.create(
                [
                    {
                        userId: ownerId,
                        workspaceId: workspace._id,
                        role: "owner",
                    },
                ],
                { session }
            );
        })
        return workspace;
    } finally {
        await session.endSession();
    }
};

const createInvite = async (workspaceId, invitedBy) => {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
    );

    const invite = await WorkspaceInvite.create({
        workspaceId,
        invitedBy,
        token,
        expiresAt,
    });

    return {
        inviteId: invite._id,
        token: invite.token,
        inviteLink: `${process.env.FRONTEND_URL}/invite/${invite.token}`,
        expiresAt: invite.expiresAt,
    };
};

const acceptInvite = async (token, userId) => {
    const invite = await WorkspaceInvite.findOne({ token });

    if (!invite) {
        throw new ApiError(404, "Invalid invitation");
    }

    if (invite.expiresAt < new Date()) {
        throw new ApiError(400, "Invitation has expired");
    }

    if (invite.acceptedAt) {
        throw new ApiError(400, "Invitation has already been used");
    }

    const existingMember = await WorkspaceMember.findOne({
        workspaceId: invite.workspaceId,
        userId,
    });

    if (existingMember) {
        throw new ApiError(400, "You are already a member of this workspace");
    }

    const member = await WorkspaceMember.create({
        workspaceId: invite.workspaceId,
        userId,
        role: "member",
    });

    invite.acceptedAt = new Date();
    await invite.save();

    return {
        workspaceId: invite.workspaceId,
        member,
    };
};

export default {
    createWorkspace,
    createInvite,
    acceptInvite,
};