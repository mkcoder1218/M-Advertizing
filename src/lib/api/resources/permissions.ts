import api from '../client';

export interface Permission {
  id: string;
  code: string;
  description?: string;
}

export const permissionsResource = {
  list: async () => {
    const { data } = await api.get<Permission[]>('/api/v1/permissions');
    return data;
  },
  create: async (payload: { code: string; description?: string }) => {
    const { data } = await api.post<Permission>('/api/v1/permissions', payload);
    return data;
  },
  update: async (id: string, payload: { code?: string; description?: string }) => {
    const { data } = await api.put<Permission>(`/api/v1/permissions/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/api/v1/permissions/${id}`);
    return data;
  },
};
