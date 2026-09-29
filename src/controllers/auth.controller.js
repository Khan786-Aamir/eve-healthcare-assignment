import { signupUser, loginUser } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const signup = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const user = await signupUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());

  const { email, password } = req.body;
  const { user, accessToken } = await loginUser(email, password);

  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };
  res.status(200).cookie("accessToken", accessToken, options).json(
    new ApiResponse(200, { user, accessToken }, "User logged in successfully")
  );
});