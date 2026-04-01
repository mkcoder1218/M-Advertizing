import { useMutation } from '@tanstack/react-query';
import { authResource } from '../resources/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authResource.login(email, password),
  });
};
