import api from '../client';

export interface WorkType {
  id: string;
  name: string;
  description?: string;
}

export const workTypesResource = {
  list: async () => {
    const { data } = await api.get<WorkType[]>('/api/v1/teams/work-types');
    return data;
  },
};
