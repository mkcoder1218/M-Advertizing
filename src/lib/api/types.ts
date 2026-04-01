import { UserRole } from '../../types';

export interface ApiUser {
  id: string;
  email: string;
  fullName?: string;
  roles?: string[];
  Roles?: { name: string }[];
}

export interface LoginResponse {
  user: ApiUser;
  token: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
