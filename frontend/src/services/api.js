import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', 
  withCredentials: true,
});

export const login = (data) => API.post('/v1/auth/login', data);
export const register = (data) => API.post('/v1/auth/register', data);
export const getProfile = () => API.get('/v1/auth/profile');
export const logout = () => API.post('/v1/auth/logout');

// Add more API calls as needed

export default API;
