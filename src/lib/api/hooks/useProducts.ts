import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsResource, Product, ProductPayload } from '../resources/products';
import { inventoryResource } from '../resources/inventory';

export const useProducts = (page: number, limit: number, type?: 'raw' | 'finished', search?: string) => {
  return useQuery({
    queryKey: ['products', page, limit, type, search],
    queryFn: () => productsResource.list({ page, limit, type, search }),
    keepPreviousData: true,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productsResource.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductPayload> }) => productsResource.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUploadProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => productsResource.uploadImage(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity, location, reorderLevel }: { id: string; quantity: number; location?: string; reorderLevel?: number }) =>
      inventoryResource.updateStock(id, { quantity, location, reorderLevel }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

