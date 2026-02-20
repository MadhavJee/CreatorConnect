import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const initiateSignup = (email) =>
    API.post('/auth/signup/initiate', { email });

export const verifySignupOtp = (data) =>
    API.post('/auth/signup/verify', data);

export const loginUser = (credentials) =>
    API.post('/auth/login', credentials);

export default API;