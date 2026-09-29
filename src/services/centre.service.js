import Centre from '../models/Centre.js';

export const createCentre = async (centreData) => {
  return await Centre.create(centreData);
};

export const getCentres = async () => {
  return await Centre.aggregate([
    {
      $lookup: {
        from: 'tests',
        localField: '_id',
        foreignField: 'centreId',
        as: 'tests'
      }
    }
  ]);
};