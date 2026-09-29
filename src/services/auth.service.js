import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const signupUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }
  const user = await User.create(userData);
  const createdUser = await User.findById(user._id).select("-password");
  return createdUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");
  return { user: loggedInUser, accessToken };
};