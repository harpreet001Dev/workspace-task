import ApiError from "../utlis/apiError.js";
import User from "../models/User.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import jwt from "jsonwebtoken";

const authtenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Missing auth token");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "Unauthorized User");
        }
        console.log(user._id,"user._id");
        console.log(decoded.workspaceId,"decoded.workspaceId");
        
        
        const membership = await WorkspaceMember.findOne({
            userId: user._id,
            workspaceId: decoded.workspaceId,
        });

        if (!membership) {
            throw new ApiError(
                403,
                "User is not a member of this workspace"
            );
        }

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            workspaceId: membership.workspaceId,
            role: membership.role,
        };

        next();
    } catch (error) {
        console.error("JWT ERROR:", error.name, error.message);

        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Token is Expired!"));
        }

        return next(new ApiError(401, "Invalid auth token"));
    }
};

export default authtenticateUser;