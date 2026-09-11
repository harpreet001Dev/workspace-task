import ApiError from "../utlis/apiError.js";

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role,"role")
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required")
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden")
      );
    }

    next();
  };
};

export default authorizeRole;