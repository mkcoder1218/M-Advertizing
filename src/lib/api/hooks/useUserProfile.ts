import { useMutation } from '@tanstack/react-query';
import { usersResource } from '../resources/users';

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { fullName?: string; email?: string; phone?: string } }) =>
      usersResource.update(id, payload),
  });
};

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => usersResource.uploadProfileImage(id, file),
  });
};
