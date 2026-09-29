import Test from '../models/Test.js';
import ApiError from '../utils/ApiError.js';

export const calculateAmount = async (testId) => {
  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, "Test not found");
  }
  return test.price;
};