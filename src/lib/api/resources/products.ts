import api from '../client';

export interface ProductPayload {
  sku: string;
  name: string;
  type: 'raw' | 'finished';
  unit: string;
  description?: string;
  sellingPrice?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  type: 'raw' | 'finished';
  unit: string;
  description?: string | null;
  sellingPrice?: number | null;
  stock?: number;
  Upload?: { url: string };
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productsResource = {
  list: async (params: { page: number; limit: number; type?: 'raw' | 'finished'; search?: string }) => {
    const { data } = await api.get<PaginatedProducts>('/api/v1/inventory/products', { params });
    return data;
  },
  create: async (payload: ProductPayload) => {
    const { data } = await api.post<Product>('/api/v1/inventory/products', payload);
    return data;
  },
  update: async (id: string, payload: Partial<ProductPayload>) => {
    const { data } = await api.put<Product>(`/api/v1/inventory/products/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/api/v1/inventory/products/${id}`);
    return data;
  },
  uploadImage: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/api/v1/inventory/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
