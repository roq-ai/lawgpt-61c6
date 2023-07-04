import axios from 'axios';
import queryString from 'query-string';
import { RenamedcaseInterface, RenamedcaseGetQueryInterface } from 'interfaces/renamedcase';
import { GetQueryInterface } from '../../interfaces';

export const getRenamedcases = async (query?: RenamedcaseGetQueryInterface) => {
  const response = await axios.get(`/api/renamedcases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRenamedcase = async (renamedcase: RenamedcaseInterface) => {
  const response = await axios.post('/api/renamedcases', renamedcase);
  return response.data;
};

export const updateRenamedcaseById = async (id: string, renamedcase: RenamedcaseInterface) => {
  const response = await axios.put(`/api/renamedcases/${id}`, renamedcase);
  return response.data;
};

export const getRenamedcaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/renamedcases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRenamedcaseById = async (id: string) => {
  const response = await axios.delete(`/api/renamedcases/${id}`);
  return response.data;
};
