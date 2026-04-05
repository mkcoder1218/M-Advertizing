import React from 'react';
import { Card } from './UI';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAnalytics, useRoleAnalytics } from '../lib/api/hooks/useAnalytics';
import { useApp } from '../context/AppContext';

export const Analytics = () => {
  const { data } = useAnalytics();
  const { data: roleData } = useRoleAnalytics();
  const { role } = useApp();
  const stats = data?.analytics;
  const isManagerView = role === 'OWNER' || role === 'MANAGER' || role === 'HR';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500">Deep dive into your workshop's performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Efficiency" value={`${stats?.efficiency ?? 0}%`} icon={<TrendingUp className="text-emerald-600" />} />
        <StatCard label="Labor Cost" value={`$${(stats?.laborCost ?? 0).toLocaleString()}`} icon={<Users className="text-blue-600" />} />
        <StatCard label="Material Waste" value={`${stats?.materialWaste ?? 0}%`} icon={<PieChart className="text-rose-600" />} />
        <StatCard label="Net Profit" value={`$${(stats?.netProfit ?? 0).toLocaleString()}`} icon={<DollarSign className="text-emerald-600" />} />
      </div>

      {!isManagerView && roleData?.summary && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard label="Tasks Worked" value={roleData.summary.tasksWorked} icon={<BarChart3 className="text-blue-600" />} />
          <StatCard label="Avg Task Hours" value={`${roleData.summary.avgHours}h`} icon={<LineChart className="text-emerald-600" />} />
          <StatCard label="Growth" value={`${roleData.summary.growthPercent}%`} icon={<TrendingUp className="text-rose-600" />} />
          <StatCard label="Attendance (7d)" value={roleData.summary.attendanceDays ?? 0} icon={<Users className="text-indigo-600" />} />
        </div>
      )}

      {isManagerView && roleData?.overall && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard label="Total Orders" value={roleData.overall.totalOrders} icon={<BarChart3 className="text-blue-600" />} />
            <StatCard label="Completed Orders" value={roleData.overall.completedOrders} icon={<LineChart className="text-emerald-600" />} />
            <StatCard label="Avg Prod Hours" value={`${roleData.overall.avgProductionHours}h`} icon={<TrendingUp className="text-rose-600" />} />
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold">Workload Breakdown</h3>
              <p className="text-xs text-slate-500">Who is working on how much</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Tasks Completed</th>
                    <th className="px-6 py-4 font-semibold">Avg Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(roleData.workers || []).map((w) => (
                    <tr key={w.id}>
                      <td className="px-6 py-4 font-medium">{w.name}</td>
                      <td className="px-6 py-4">{w.role.replace(/_/g, ' ')}</td>
                      <td className="px-6 py-4">{w.tasksCompleted}</td>
                      <td className="px-6 py-4">{w.avgHours}h</td>
                    </tr>
                  ))}
                  {(roleData.workers || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">
                        No workload data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-96 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <LineChart size={48} className="mx-auto mb-4 opacity-20" />
            <p>Revenue Over Time Chart</p>
          </div>
        </Card>
        <Card className="h-96 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
            <p>Department Performance Chart</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <Card className="flex items-center space-x-4">
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  </Card>
);
