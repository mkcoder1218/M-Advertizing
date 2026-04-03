import api from '../client';

export interface StockRequestRecord {
  id: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED';
  targetRole: 'STORE_MANAGER' | 'BUYER';
  requestedBy: string;
  notes?: string | null;
  Product?: { id: string; name: string; sku: string };
}

export const requestsResource = {
  list: async (params?: { page?: number; limit?: number; status?: string; targetRole?: string }) => {
    const { data } = await api.get<{ items: StockRequestRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/requests',
      { params }
    );
    return data;
  },
  create: async (payload: { productId: string; quantity: number; notes?: string }) => {
    const { data } = await api.post<StockRequestRecord>('/api/v1/requests', payload);
    return data;
  },
  update: async (id: string, payload: { status: StockRequestRecord['status'] }) => {
    const { data } = await api.put<StockRequestRecord>(`/api/v1/requests/${id}`, payload);
    return data;
  },
};
