import api from '../client';

export interface AnalyticsOverview {
  dashboard: {
    totalRevenue: number;
    activeJobs: number;
    inventoryValue: number;
    pendingOrders: number;
  };
  analytics: {
    efficiency: number;
    laborCost: number;
    materialWaste: number;
    netProfit: number;
  };
}

export const analyticsResource = {
  overview: async () => {
    const { data } = await api.get<AnalyticsOverview>('/api/v1/analytics/overview');
    return data;
  },
};
