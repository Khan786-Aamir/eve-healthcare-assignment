import { createCentre, getCentres } from '../services/centre.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const addCentre = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const centre = await createCentre(req.body);
  res.status(201).json(new ApiResponse(201, centre, "Centre created successfully"));
});

export const getAllCentres = catchAsync(async (req, res) => {
  const centres = await getCentres();
  res.status(200).json(new ApiResponse(200, centres, "Centres fetched successfully"));
});