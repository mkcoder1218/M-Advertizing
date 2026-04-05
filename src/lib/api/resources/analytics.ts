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

export interface RoleAnalytics {
  role: string;
  summary?: {
    tasksWorked: number;
    avgHours: number;
    growthPercent: number;
    attendanceDays?: number;
  };
  overall?: {
    totalOrders: number;
    completedOrders: number;
    avgProductionHours: number;
  };
  workers?: {
    id: string;
    name: string;
    role: string;
    tasksCompleted: number;
    avgHours: number;
  }[];
}

export const analyticsResource = {
  overview: async () => {
    const { data } = await api.get<AnalyticsOverview>('/api/v1/analytics/overview');
    return data;
  },
  role: async () => {
    const { data } = await api.get<RoleAnalytics>('/api/v1/analytics/role');
    return data;
  },
};
