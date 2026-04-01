import api from '../client';

export interface SalePayload {
  orderId?: string;
  saleDate: string;
  status: string;
}

export interface SaleItemPayload {
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export const salesResource = {
  createSale: async (payload: SalePayload) => {
    const { data } = await api.post('/api/v1/sales', payload);
    return data;
  },
  addSaleItem: async (payload: SaleItemPayload) => {
    const { data } = await api.post('/api/v1/sales/items', payload);
    return data;
  },
};
