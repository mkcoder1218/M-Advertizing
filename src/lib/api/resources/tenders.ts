import api from '../client';

export interface TenderRecord {
  id: string;
  tenderNumber: string;
  title: string;
  clientName: string;
  value: number;
  status: string;
  approvalStatus: string;
  assignedWorker?: string | null;
  assignedBy?: string | null;
  issueDate: string;
  dueDate?: string | null;
  description?: string | null;
}

export interface TenderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  approvalStatus?: string;
}

export const tendersResource = {
  list: async (params?: TenderListParams) => {
    const { data } = await api.get<{ items: TenderRecord[]; total: number; page: number; limit: number }>(
      '/api/v1/tenders',
      { params }
    );
    return data;
  },
  create: async (payload: Partial<TenderRecord>) => {
    const { data } = await api.post<TenderRecord>('/api/v1/tenders', payload);
    return data;
  },
  update: async (id: string, payload: Partial<TenderRecord>) => {
    const { data } = await api.put<TenderRecord>(`/api/v1/tenders/${id}`, payload);
    return data;
  },
};
