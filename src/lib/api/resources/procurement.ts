import api from '../client';

export interface SupplierRecord {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  supplierId: string;
  status: string;
  orderDate: string;
  expectedDate?: string | null;
  Supplier?: SupplierRecord;
}

export const procurementResource = {
  listSuppliers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get<{ items: SupplierRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/procurement/suppliers',
      { params }
    );
    return data;
  },
  createSupplier: async (payload: Omit<SupplierRecord, 'id'>) => {
    const { data } = await api.post<SupplierRecord>('/api/v1/procurement/suppliers', payload);
    return data;
  },
  listPurchaseOrders: async (params?: { page?: number; limit?: number; search?: string; status?: string; supplierId?: string }) => {
    const { data } = await api.get<{ items: PurchaseOrderRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/procurement/purchase-orders',
      { params }
    );
    return data;
  },
  createPurchaseOrder: async (payload: Partial<PurchaseOrderRecord>) => {
    const { data } = await api.post<PurchaseOrderRecord>('/api/v1/procurement/purchase-orders', payload);
    return data;
  },
};
