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

export const Analytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500">Deep dive into your workshop's performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Efficiency" value="84%" icon={<TrendingUp className="text-emerald-600" />} />
        <StatCard label="Labor Cost" value="$12,400" icon={<Users className="text-blue-600" />} />
        <StatCard label="Material Waste" value="4.2%" icon={<PieChart className="text-rose-600" />} />
        <StatCard label="Net Profit" value="$45,200" icon={<DollarSign className="text-emerald-600" />} />
      </div>

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
