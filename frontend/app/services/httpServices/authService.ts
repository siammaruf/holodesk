import { api } from '~/services/httpService';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  avatar_url?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthUser>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthUser>('/auth/register', credentials),

  me: () => api.get<AuthUser>('/auth/me'),

  logout: () => api.post('/auth/logout'),
};
