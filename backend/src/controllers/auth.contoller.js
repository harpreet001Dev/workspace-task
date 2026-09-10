import asyncHandler from "../utlis/asyncHandler.js";
import authService from "../service/auth.service.js";
import ApiError from "../utlis/apiError.js";


export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result
    });
})


export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    const { user, accessToken, refreshToken } = result;


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        // maxAge: 7 * 24 * 60 * 60 * 1000, 
        maxAge: 5 * 60 * 1000   

    })


    res.status(200).json({
        status: "success",
        data: {
            user,
            accessToken
        }
    })
})


export const refresh = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh Token  Not found!")
    }
    const result = await authService.refresh(refreshToken)
    const { accessToken, newRefreshToken } = result;
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        // maxAge: 7 * 24 * 60 * 60 * 1000 
        maxAge: 5 * 60 * 1000  

    })

    res.status(200).json({
        status: "success",
        data: {
            accessToken
        }
    })
})

export const getMe = asyncHandler(async (req, res) => {
    console.log("inside get container")
    res.status(200).json({
        status: "success",

    })
})


export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
})