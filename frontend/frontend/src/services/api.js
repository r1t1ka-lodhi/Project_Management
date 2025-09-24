import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if your backend runs elsewhere
  withCredentials: true,
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const logout = () => API.post('/auth/logout');

// Add more API calls as needed

export default API;
