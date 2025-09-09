import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://luciferaliss.site',
  withCredentials: true, 
});

apiClient.defaults.headers.post['Content-Type'] = 'application/json';

export default apiClient;