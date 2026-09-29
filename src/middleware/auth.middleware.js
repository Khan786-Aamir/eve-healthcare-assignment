import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});