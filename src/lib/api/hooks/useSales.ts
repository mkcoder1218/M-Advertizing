import { useMutation } from '@tanstack/react-query';
import { salesResource, SalePayload, SaleItemPayload } from '../resources/sales';

export const useCreateSale = () => {
  return useMutation({
    mutationFn: (payload: SalePayload) => salesResource.createSale(payload),
  });
};

export const useCreateSaleItem = () => {
  return useMutation({
    mutationFn: (payload: SaleItemPayload) => salesResource.addSaleItem(payload),
  });
};
