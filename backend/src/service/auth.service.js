
import User from '../models/User.js';
import ApiError from '../utlis/apiError.js';
import RefreshToken from '../models/RefreshToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const register = async (data) => {
    const { name, email, password } = data;
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new ApiError(409, 'User already exists, Please Login!');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'user',
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };

}

const login = async (data) => {

    const { email, password } = data;
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }
    const user = await User.findOne({ email }).select('+password')


    if (!user) {
        throw new ApiError(401, "User not found!")
    }

    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) {
        throw new ApiError(401, 'Invalid Credentials!')
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    const existedUser = await User.findById(user._id)
    await RefreshToken.findOneAndUpdate(
        { userId: user._id },
        {
            token: hashedRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            
        },
        {
            upsert: true
        }
    )
    return { user: existedUser, accessToken, refreshToken }
}

const refresh = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    const storedToken = await RefreshToken.findOne({
        userId: decoded.id,
        isRevoked: false
    })
    if (!storedToken) {
        throw new ApiError(401, "Invalid Refresh Token");
    }
    if (storedToken.expiresAt < new Date()) {
        throw new ApiError(401, "Refresh Token Expired!");
    }
    const isvalid = await bcrypt.compare(refreshToken, storedToken.token)
    if (!isvalid) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }
    const user = await User.findById(decoded.id)
    if (!user) {
        throw new ApiError(401, "User not found!")
    }
    storedToken.isRevoked = true
    await storedToken.save();

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await RefreshToken.create({
        userId: user._id,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })


    return {
        accessToken,
        newRefreshToken
    }

}

export default {register, login, refresh}