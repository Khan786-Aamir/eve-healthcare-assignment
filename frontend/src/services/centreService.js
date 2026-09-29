import api from './api';

export const getCentres = async () => {
  const response = await api.get('/centres');
  return response.data;
};

export const getCentreById = async (id) => {
  const response = await api.get(`/centres/${id}`);
  return response.data;
};

export const getTests = async () => {
  const response = await api.get('/tests');
  return response.data;
};