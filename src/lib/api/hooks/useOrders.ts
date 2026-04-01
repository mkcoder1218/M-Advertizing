import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersResource, OrderRecord } from '../resources/orders';

export const useOrders = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ['orders', page, limit, search],
    queryFn: () => ordersResource.list({ page, limit, search }),
    keepPreviousData: true,
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<OrderRecord>) => ordersResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OrderRecord> }) =>
      ordersResource.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useAddOrderMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { sender: string; role: string; text: string } }) =>
      ordersResource.addMessage(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};
