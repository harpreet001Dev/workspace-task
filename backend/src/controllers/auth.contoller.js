import asyncHandler from "../utlis/asyncHandler.js";
import authService from "../service/auth.service.js";


export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result
    });
})

