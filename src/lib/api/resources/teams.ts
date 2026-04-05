import api from '../client';

export interface Team {
  id: string;
  name: string;
}

export const teamsResource = {
  list: async () => {
    const { data } = await api.get<Team[]>('/api/v1/teams');
    return data;
  },
  create: async (payload: { name: string }) => {
    const { data } = await api.post<Team>('/api/v1/teams', payload);
    return data;
  },
  update: async (id: string, payload: { name?: string }) => {
    const { data } = await api.put<Team>(`/api/v1/teams/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/api/v1/teams/${id}`);
    return data;
  },
};
