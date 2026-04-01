import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hrResource, EmployeePayload } from '../resources/hr';

export const useEmployees = (page = 1, limit = 20, search?: string) => {
  return useQuery({
    queryKey: ['employees', page, limit, search],
    queryFn: () => hrResource.list({ page, limit, search }),
    keepPreviousData: true,
  });
};

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeePayload) => hrResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
};
