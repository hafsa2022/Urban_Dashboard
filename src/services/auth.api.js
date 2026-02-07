import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = (data) =>
  axios.post(`${API_URL}/auth/login`, data);

export const register = (data) =>
  axios.post(`${API_URL}/auth/register`, data);
