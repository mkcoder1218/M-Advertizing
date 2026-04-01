import api from '../client';

export interface EmployeePayload {
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  hireDate?: string;
}

export interface EmployeeRecord extends EmployeePayload {
  id: string;
  isActive?: boolean;
}

export const hrResource = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get<{ items: EmployeeRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/hr',
      { params }
    );
    return data;
  },
  create: async (payload: EmployeePayload) => {
    const { data } = await api.post<EmployeeRecord>('/api/v1/hr', payload);
    return data;
  },
};
