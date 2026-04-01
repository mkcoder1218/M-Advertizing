import api from '../client';

export const usersResource = {
  update: async (id: string, payload: { fullName?: string; email?: string; phone?: string }) => {
    const { data } = await api.put(`/api/v1/users/${id}`, payload);
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
};
