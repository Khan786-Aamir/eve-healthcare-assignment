import Test from '../models/Test.js';
import Centre from '../models/Centre.js';
import ApiError from '../utils/ApiError.js';

export const createTest = async (testData) => {
  const centre = await Centre.findById(testData.centreId);
  if (!centre) {
    throw new ApiError(404, "Centre not found");
  }
  return await Test.create(testData);
};

export const getTests = async (centreId) => {
  const filter = centreId ? { centreId } : {};
  return await Test.find(filter).populate('centreId', 'name location');
};