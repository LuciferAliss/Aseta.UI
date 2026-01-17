export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserSearchResponse {
  id: string;
  userName: string;
  email: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
  deviceName: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
