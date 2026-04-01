import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { procurementResource, PurchaseOrderRecord, SupplierRecord } from '../resources/procurement';

export const useSuppliers = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => procurementResource.listSuppliers(params),
    keepPreviousData: true,
  });

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<SupplierRecord, 'id'>) => procurementResource.createSupplier(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const usePurchaseOrders = (params?: { page?: number; limit?: number; search?: string; status?: string; supplierId?: string }) =>
  useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => procurementResource.listPurchaseOrders(params),
    keepPreviousData: true,
  });

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PurchaseOrderRecord>) => procurementResource.createPurchaseOrder(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
};
