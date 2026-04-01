import api from '../client';
import { LoginResponse } from '../types';

export const authResource = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/api/v1/auth/login', { email, password });
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await api.post<{ token: string }>('/api/v1/auth/refresh', { refreshToken });
    return data;
  },
  logout: async (refreshToken: string) => {
    await api.post('/api/v1/auth/logout', { refreshToken });
  },
};
