
import ApiError from "../utlis/apiError.js";
import Workspace from "../models/Workspace.js";
import Board from "../models/Board.js";

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

    return board;
};

export default {createBoard}