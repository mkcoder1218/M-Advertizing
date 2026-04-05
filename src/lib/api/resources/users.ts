import api from '../client';

export const usersResource = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/api/v1/users', { params });
    return data;
  },
  create: async (payload: { fullName: string; email: string; password: string; phone?: string }) => {
    const { data } = await api.post('/api/v1/users', payload);
    return data;
  },
  update: async (id: string, payload: { fullName?: string; email?: string; phone?: string }) => {
    const { data } = await api.put(`/api/v1/users/${id}`, payload);
    return data;
  },
  updateWithRoles: async (id: string, payload: { fullName?: string; email?: string; phone?: string; roleIds?: string[]; isActive?: boolean }) => {
    const { data } = await api.put(`/api/v1/users/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/api/v1/users/${id}`);
    return data;
  },
  uploadProfileImage: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/api/v1/users/${id}/profile-image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  updateAttendanceLocation: async (id: string, payload: { attendanceLat: number; attendanceLng: number; attendanceRadiusM?: number }) => {
    const { data } = await api.put(`/api/v1/users/${id}/attendance-location`, payload);
    return data;
  },
};
