import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceResource, AttendanceRecord } from '../resources/attendance';

export const useAttendance = (date?: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['attendance', date, page, limit],
    queryFn: () => attendanceResource.list({ date, page, limit }),
    keepPreviousData: true,
  });
};

export const useCreateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<AttendanceRecord, 'id'>) => attendanceResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }),
  });
};

export const useUpdateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: AttendanceRecord['status']; notes?: string | null }) =>
      attendanceResource.update(id, { status, notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }),
  });
};
