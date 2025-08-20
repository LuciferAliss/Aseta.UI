import axios from 'axios';

const baseURL =  'https://asetaapi-production.up.railway.app/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', config); //Delete

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
); 
