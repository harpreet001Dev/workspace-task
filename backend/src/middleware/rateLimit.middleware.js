import rateLimit from "express-rate-limit";

//rate limit for auth routes 10 requests / minute / IP
export const authRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication requests. Please try again later.",
        errors: []
    }
});