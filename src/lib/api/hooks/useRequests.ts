import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsResource, StockRequestRecord } from '../resources/requests';

export const useStockRequests = (params?: { page?: number; limit?: number; status?: string; targetRole?: string }) =>
  useQuery({
    queryKey: ['stock-requests', params],
    queryFn: () => requestsResource.list(params),
    keepPreviousData: true,
  });

export const useCreateStockRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; quantity: number; notes?: string }) => requestsResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock-requests'] }),
  });
};

export const useUpdateStockRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StockRequestRecord['status'] }) => requestsResource.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock-requests'] }),
  });
};
