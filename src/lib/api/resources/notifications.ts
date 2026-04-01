import api from '../client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  data?: any;
  readAt?: string | null;
  createdAt?: string;
}

export const notificationsResource = {
  list: async () => {
    const { data } = await api.get<Notification[]>('/api/v1/notifications');
    return data;
  },
  markRead: async (id: string) => {
    const { data } = await api.put<Notification>(`/api/v1/notifications/${id}/read`);
    return data;
  },
};
