import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  JwtPayload,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/user";
import {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
} from "../services/userService";
import { jwtDecode } from "jwt-decode";
import { getDeviceId, getDeviceName } from "../utils/deviceUtils";

type LoginCredentials = Omit<LoginRequest, "deviceId" | "deviceName">;

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuth(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        let currentToken = token;
        const decoded = jwtDecode<JwtPayload>(currentToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          const refreshResponse = await refreshToken();
          const newAccessToken = refreshResponse.accessToken;
          localStorage.setItem("access_token", newAccessToken);
          currentToken = newAccessToken;
        }

        const finalDecoded = jwtDecode<JwtPayload>(currentToken);
        const currentUser: User = {
          id: finalDecoded.sub,
          name: finalDecoded.name,
          email: finalDecoded.email,
          role: finalDecoded.role,
        };
        setUser(currentUser);
        setIsAuth(true);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // throw error;
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout, setUser, setIsAuth]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const deviceId = getDeviceId();
      const deviceName = getDeviceName();

      const fullRequest: LoginRequest = {
        ...credentials,
        deviceId,
        deviceName,
      };

      const response = await loginUser(fullRequest);

      const tokenAccess = response.accessToken;

      localStorage.setItem("access_token", tokenAccess);

      const decoded = jwtDecode<JwtPayload>(tokenAccess);

      const currentUser: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      console.log(currentUser);

      setUser(currentUser);
      setIsAuth(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (request: RegisterRequest) => {
    setIsLoading(true);
    try {
      await registerUser(request);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
