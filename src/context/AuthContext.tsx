import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User} from '../types/auth/user';
import type { LoginRequest, RegisterRequest } from '../types/auth/auth';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAuth: (loginRequest: LoginRequest, rememberMe: boolean) => Promise<void>;
  registerAuth: (registerRequest: RegisterRequest) => Promise<void>;
  logoutAuth: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loginAuth = async (loginRequest: LoginRequest, rememberMe: boolean) => {
    setIsLoading(true);
    await authApi.login(loginRequest, rememberMe);
    setIsLoading(false);
  };

  const registerAuth = async (registerRequest: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authApi.register(registerRequest); 
    } finally {
      setIsLoading(false);
    }
  }

  const logoutAuth = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.ping();
      setUser(response);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
    };

    checkAuth();
  }, [])
  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, loginAuth, registerAuth, logoutAuth, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};