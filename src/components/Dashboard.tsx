import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Factory, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Card, Badge } from './UI';
import { MOCK_JOBS, MOCK_INVENTORY } from '../mockData';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', sales: 4000, prod: 2400 },
  { name: 'Tue', sales: 3000, prod: 1398 },
  { name: 'Wed', sales: 2000, prod: 9800 },
  { name: 'Thu', sales: 2780, prod: 3908 },
  { name: 'Fri', sales: 1890, prod: 4800 },
  { name: 'Sat', sales: 2390, prod: 3800 },
  { name: 'Sun', sales: 3490, prod: 4300 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-slate-500">Welcome back, Alexander. Here's what's happening today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          label="Total Revenue" 
          value="$128,430" 
          change={12.5} 
          trend="up" 
          icon={<DollarSign className="text-blue-600" />} 
        />
        <KPICard 
          label="Active Jobs" 
          value="42" 
          change={-2.4} 
          trend="down" 
          icon={<Factory className="text-amber-600" />} 
        />
        <KPICard 
          label="Inventory Value" 
          value="$84,200" 
          change={5.1} 
          trend="up" 
          icon={<Package className="text-emerald-600" />} 
        />
        <KPICard 
          label="Pending Orders" 
          value="18" 
          change={0} 
          trend="neutral" 
          icon={<Clock className="text-indigo-600" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-[400px]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold">Production vs Sales</h3>
            <select className="rounded-lg border-none bg-slate-100 text-xs dark:bg-slate-800">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              <Area type="monotone" dataKey="prod" stroke="#10B981" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-[400px]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold">Recent Alerts</h3>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {MOCK_INVENTORY.filter(i => i.status !== 'NORMAL').map(item => (
              <div key={item.id} className="flex items-start space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className={cn(
                  "mt-0.5 rounded-full p-1.5",
                  item.status === 'OUT_OF_STOCK' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                )}>
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name} is {item.status.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-500">Current stock: {item.stock} {item.unit}. Min required: {item.minStock}</p>
                </div>
                <button className="text-xs font-medium text-blue-600">Restock</button>
              </div>
            ))}
            <div className="flex items-start space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                <Clock size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Production Delay: J-101</p>
                <p className="text-xs text-slate-500">Welding A team reporting material shortage.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold">Active Production Jobs</h3>
            <button className="text-xs text-blue-600 hover:underline">Go to Kanban</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 font-medium text-slate-500">Job ID</th>
                  <th className="pb-3 font-medium text-slate-500">Product</th>
                  <th className="pb-3 font-medium text-slate-500">Team</th>
                  <th className="pb-3 font-medium text-slate-500">Progress</th>
                  <th className="pb-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_JOBS.slice(0, 4).map(job => (
                  <tr key={job.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 font-medium">{job.id}</td>
                    <td className="py-4">{job.productName}</td>
                    <td className="py-4 text-slate-500">{job.assignedTeam}</td>
                    <td className="py-4">
                      <div className="flex w-32 items-center space-x-2">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div 
                            className="h-full rounded-full bg-blue-600" 
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{job.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={job.status === 'COMPLETED' ? 'success' : 'info'}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="mb-6 font-semibold">Activity Feed</h3>
          <div className="space-y-6">
            <ActivityItem 
              icon={<CheckCircle2 size={16} className="text-emerald-600" />}
              title="Order #5501 Shipped"
              time="2 hours ago"
              user="Sarah Smith"
            />
            <ActivityItem 
              icon={<Package size={16} className="text-blue-600" />}
              title="Inventory Restocked"
              time="5 hours ago"
              user="Mike Johnson"
            />
            <ActivityItem 
              icon={<Factory size={16} className="text-amber-600" />}
              title="New Job Started: J-104"
              time="Yesterday"
              user="Welding Team A"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, change, trend, icon }: any) => (
  <Card className="flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
        {icon}
      </div>
      {change !== 0 && (
        <div className={cn(
          "flex items-center text-xs font-medium",
          trend === 'up' ? "text-emerald-600" : "text-rose-600"
        )}>
          {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  </Card>
);

const ActivityItem = ({ icon, title, time, user }: any) => (
  <div className="flex space-x-3">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-slate-500">{time} • {user}</p>
    </div>
  </div>
);
