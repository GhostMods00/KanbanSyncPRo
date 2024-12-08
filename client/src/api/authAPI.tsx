import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // adjust port if needed

export const login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        // Store the token
        if (response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
            // Add token to all future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);