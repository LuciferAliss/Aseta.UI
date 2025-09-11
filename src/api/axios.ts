import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, 
});

apiClient.defaults.headers.post['Content-Type'] = 'application/json';

export default apiClient;