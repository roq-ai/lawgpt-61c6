import axios from 'axios';
import queryString from 'query-string';
import { SimilarCaseInterface, SimilarCaseGetQueryInterface } from 'interfaces/similar-case';
import { GetQueryInterface } from '../../interfaces';

export const getSimilarCases = async (query?: SimilarCaseGetQueryInterface) => {
  const response = await axios.get(`/api/similar-cases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSimilarCase = async (similarCase: SimilarCaseInterface) => {
  const response = await axios.post('/api/similar-cases', similarCase);
  return response.data;
};

export const updateSimilarCaseById = async (id: string, similarCase: SimilarCaseInterface) => {
  const response = await axios.put(`/api/similar-cases/${id}`, similarCase);
  return response.data;
};

export const getSimilarCaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/similar-cases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSimilarCaseById = async (id: string) => {
  const response = await axios.delete(`/api/similar-cases/${id}`);
  return response.data;
};
