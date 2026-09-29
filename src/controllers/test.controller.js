import { createTest, getTests } from '../services/test.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const addTest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const test = await createTest(req.body);
  res.status(201).json(new ApiResponse(201, test, "Test created successfully"));
});

export const getTestsByCentre = catchAsync(async (req, res) => {
  const tests = await getTests(req.query.centreId);
  res.status(200).json(new ApiResponse(200, tests, "Tests fetched successfully"));
});