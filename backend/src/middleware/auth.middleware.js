import ApiError from "../utlis/apiError.js";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const authtenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Missing auth token")
        }
        const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decode.id)
        if (!user) {
            throw new ApiError(401, "Unauthorized User")
        }
        req.user = user;
        next();
    } catch (error) {
    console.error("JWT ERROR:", error.name, error.message);

    if (error.name === "TokenExpiredError") {
        return next(new ApiError(401, "Token is Expired!"));
    }

    return next(new ApiError(401, "Invalid auth token"));
}


}



export default authtenticateUser