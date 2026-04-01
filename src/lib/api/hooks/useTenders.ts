import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tendersResource, TenderListParams, TenderRecord } from '../resources/tenders';

export const useTenders = (params?: TenderListParams) =>
  useQuery({
    queryKey: ['tenders', params],
    queryFn: () => tendersResource.list(params),
    keepPreviousData: true,
  });

export const useCreateTender = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<TenderRecord>) => tendersResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenders'] }),
  });
};

export const useUpdateTender = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TenderRecord> }) => tendersResource.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenders'] }),
  });
};
