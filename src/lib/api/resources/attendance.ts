import api from '../client';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  notes?: string | null;
  Employee?: { id: string; firstName: string; lastName: string };
}

export const attendanceResource = {
  list: async (params?: { date?: string; page?: number; limit?: number }) => {
    const { data } = await api.get<{ items: AttendanceRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/attendance',
      { params }
    );
    return data;
  },
  create: async (payload: Omit<AttendanceRecord, 'id'>) => {
    const { data } = await api.post<AttendanceRecord>('/api/v1/attendance', payload);
    return data;
  },
  update: async (id: string, payload: { status: AttendanceRecord['status']; notes?: string | null }) => {
    const { data } = await api.put<AttendanceRecord>(`/api/v1/attendance/${id}`, payload);
    return data;
  },
};
