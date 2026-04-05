import api from '../client';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type ApprovalStatus =
  | 'AWAITING_RECEPTION'
  | 'SENT_TO_DESIGNER'
  | 'SENT_TO_WORKER'
  | 'WORKER_ACCEPTED'
  | 'WORK_IN_PROGRESS'
  | 'WORK_COMPLETED'
  | 'WORKER_REJECTED';

export interface OrderMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  createdAt?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerContact?: string;
  status: OrderStatus;
  approvalStatus: ApprovalStatus;
  assignedWorker?: string | null;
  assignedWorkerId?: string | null;
  assignedDesignerId?: string | null;
  acceptedById?: string | null;
  needsDesign?: boolean | null;
  fileAvailable?: boolean | null;
  orderFileUrl?: string | null;
  designFileUrl?: string | null;
  sentToDesignerAt?: string | null;
  sentToWorkerAt?: string | null;
  workerAcceptedAt?: string | null;
  workStartedAt?: string | null;
  workCompletedAt?: string | null;
  createdBy?: string | null;
  total?: number | null;
  itemsCount?: number | null;
  orderDate: string;
  OrderMessages?: OrderMessage[];
  OrderItems?: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    workTypeId?: string | null;
    Product?: { id: string; name: string; sku: string };
    WorkType?: { id: string; name: string };
  }[];
}

export interface PaginatedOrders {
  items: OrderRecord[];
  total: number;
  page: number;
  limit: number;
}

export const ordersResource = {
  list: async (params: { page: number; limit: number; search?: string }) => {
    const { data } = await api.get<PaginatedOrders>('/api/v1/orders', { params });
    return data;
  },
  create: async (payload: Partial<OrderRecord>) => {
    const { data } = await api.post<OrderRecord>('/api/v1/orders', payload);
    return data;
  },
  update: async (id: string, payload: Partial<OrderRecord>) => {
    const { data } = await api.put<OrderRecord>(`/api/v1/orders/${id}`, payload);
    return data;
  },
  updateItems: async (id: string, items: { productId: string; quantity: number; unitPrice: number; workTypeId?: string }[]) => {
    const { data } = await api.put(`/api/v1/orders/${id}/items`, { items });
    return data;
  },
  addMessage: async (id: string, payload: { sender: string; role: string; text: string }) => {
    const { data } = await api.post<OrderMessage>(`/api/v1/orders/${id}/messages`, payload);
    return data;
  },
  uploadOrderFile: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/api/v1/orders/${id}/file`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  uploadDesignFile: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/api/v1/orders/${id}/design-file`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
