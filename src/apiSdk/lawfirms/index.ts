import axios from 'axios';
import queryString from 'query-string';
import { LawfirmInterface, LawfirmGetQueryInterface } from 'interfaces/lawfirm';
import { GetQueryInterface } from '../../interfaces';

export const getLawfirms = async (query?: LawfirmGetQueryInterface) => {
  const response = await axios.get(`/api/lawfirms${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLawfirm = async (lawfirm: LawfirmInterface) => {
  const response = await axios.post('/api/lawfirms', lawfirm);
  return response.data;
};

export const updateLawfirmById = async (id: string, lawfirm: LawfirmInterface) => {
  const response = await axios.put(`/api/lawfirms/${id}`, lawfirm);
  return response.data;
};

export const getLawfirmById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/lawfirms/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLawfirmById = async (id: string) => {
  const response = await axios.delete(`/api/lawfirms/${id}`);
  return response.data;
};
