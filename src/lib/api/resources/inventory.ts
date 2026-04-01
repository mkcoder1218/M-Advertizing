import api from '../client';

export const inventoryResource = {
  updateStock: async (productId: string, payload: { quantity: number; location?: string; reorderLevel?: number }) => {
    const { data } = await api.put(`/api/v1/inventory/inventory/${productId}`, payload);
    return data;
  },
};
