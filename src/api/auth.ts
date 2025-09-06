import apiClient from '../api/axios';
import type { LoginRequest, RegisterRequest } from '../types/auth/auth';
import type { User } from '../types/auth/user';

export const authApi = {
  login: async (request: LoginRequest, rememberMe: boolean) => {
    if (rememberMe) {
      await apiClient.post('/auth/login?useCookies=true', request);  
    } else {
      await apiClient.post('/auth/login?useSessionCookies=true', request);  
    }
  },

  register: async (request: RegisterRequest) => {
    await apiClient.post('/auth/register', request);
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  ping: async () : Promise<User> => {
    return await apiClient.get('/auth/pingauth');
  }
};