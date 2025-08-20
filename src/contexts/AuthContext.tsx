// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi, type LoginRequest, type RegisterRequest, type User } from '../api/auth';

interface AuthContextType {
  user: User | null;
	loginGoogle: () => Promise<void>;
  login: (request: LoginRequest) => Promise<void>;
  register: (request : RegisterRequest) => Promise<void>;
	me: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	const login = async (request: LoginRequest) => {
		await authApi.login(request);
	};

	const loginGoogle = async () => {
		await authApi.loginGoogle();
	};

  const register = async (request: RegisterRequest) => {
    await authApi.register(request);
	};

	const me = async () => {
		const user = await authApi.me();
		setUser(user);
	};

  return (
    <AuthContext.Provider value={{ user, login, register, me, loginGoogle}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}