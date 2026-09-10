
import User from '../models/User.js';
import ApiError from '../utlis/apiError.js';

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


export default {register}