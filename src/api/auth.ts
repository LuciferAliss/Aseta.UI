import { apiClient } from './api-client';

export interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  isBlocked: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<void> => {
		await apiClient.post('/auth/login?useCookies=true&useSessionCookies=false', credentials);
  },

	loginGoogle: async (): Promise<void> => {
		await apiClient.post('/auth/login-google');
	},

  register: async (credentials: RegisterRequest): Promise<void> => {
		await apiClient.post('/auth/register', credentials);
  },

	me: async (): Promise<User> => {
		return await apiClient.get('/auth/me');
	},
};