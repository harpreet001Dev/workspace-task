import ApiError from "../utlis/apiError.js";
import WorkspaceMember from "../models/WorkspaceMember.js";

const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(
                    new ApiError(401, "Authentication required")
                );
            }

            const { workspaceId } = req.params;

            const workspaceMember = await WorkspaceMember.findOne({
                userId: req.user._id,
                workspaceId,
            });

            if (!workspaceMember) {
                return next(
                    new ApiError(403, "You are not a member of this workspace")
                );
            }

            if (!allowedRoles.includes(workspaceMember.role)) {
                return next(
                    new ApiError(403, "Forbidden")
                );
            }

            req.workspaceMember = workspaceMember;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authorizeRole;