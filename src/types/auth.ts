export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface PasswordInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface User
{
  id: string;
  email: string;
  userName: string;
}

export interface ValidError extends Error {}

export class ValidError extends Error implements ValidError {
    constructor(message: string, code?: string) {
        super(message);
        this.name = 'ValidError'; 
        Object.setPrototypeOf(this, ValidError.prototype);
    }
}