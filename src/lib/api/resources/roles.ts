import api from '../client';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export const rolesResource = {
  list: async () => {
    const { data } = await api.get<Role[]>('/api/v1/roles');
    return data;
  },
  create: async (payload: { name: string; description?: string }) => {
    const { data } = await api.post<Role>('/api/v1/roles', payload);
    return data;
  },
  update: async (id: string, payload: { name?: string; description?: string }) => {
    const { data } = await api.put<Role>(`/api/v1/roles/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/api/v1/roles/${id}`);
    return data;
  },
};
