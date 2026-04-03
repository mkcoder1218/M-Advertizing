import { useMutation } from '@tanstack/react-query';
import { usersResource } from '../resources/users';
import { useQuery } from '@tanstack/react-query';

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { fullName?: string; email?: string; phone?: string } }) =>
      usersResource.update(id, payload),
  });
};

export const useUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersResource.list(params),
    keepPreviousData: true,
  });

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => usersResource.uploadProfileImage(id, file),
  });
};

export const useUpdateAttendanceLocation = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { attendanceLat: number; attendanceLng: number; attendanceRadiusM?: number } }) =>
      usersResource.updateAttendanceLocation(id, payload),
  });
};
