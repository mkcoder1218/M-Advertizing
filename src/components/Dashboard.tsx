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
import { cn } from '../lib/utils';
import { useAnalytics, useRoleAnalytics } from '../lib/api/hooks/useAnalytics';
import { useOrders } from '../lib/api/hooks/useOrders';
import { useProducts } from '../lib/api/hooks/useProducts';
import { useNotifications } from '../lib/api/hooks/useNotifications';
import { useApp } from '../context/AppContext';

const dayLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short' });

export const Dashboard = () => {
  const { data: analytics } = useAnalytics();
  const { data: roleData } = useRoleAnalytics();
  const { role } = useApp();
  const overview = analytics?.dashboard;
  const { data: ordersData } = useOrders(1, 100);
  const { data: productsData } = useProducts(1, 50);
  const { data: notifications = [] } = useNotifications();

  const orders = ordersData?.items || [];
  const products = productsData?.items || [];

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = date.toISOString().slice(0, 10);
    const sales = orders.filter((o: any) => o.orderDate === key).length;
    const prod = orders.filter((o: any) => o.approvalStatus === 'WORK_IN_PROGRESS' && o.orderDate === key).length;
    return { name: dayLabel(date), sales, prod };
  });

  const activeJobs = orders.filter((o: any) => ['WORKER_ACCEPTED', 'WORK_IN_PROGRESS'].includes(o.approvalStatus || ''));
  const alerts = products.slice(0, 3);
  const isManagerView = role === 'OWNER' || role === 'MANAGER' || role === 'HR';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-slate-500">Welcome back, Alexander. Here's what's happening today.</p>
      </div>

      {roleData?.summary && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">My Work Summary</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <KPICard label="Tasks Worked" value={roleData.summary.tasksWorked} change={0} trend="neutral" icon={<Factory className="text-blue-600" />} />
            <KPICard label="Avg Task Hours" value={`${roleData.summary.avgHours}h`} change={0} trend="neutral" icon={<Clock className="text-emerald-600" />} />
            <KPICard label="Growth" value={`${roleData.summary.growthPercent}%`} change={0} trend="neutral" icon={<TrendingUp className="text-rose-600" />} />
            <KPICard label="Attendance (7d)" value={roleData.summary.attendanceDays ?? 0} change={0} trend="neutral" icon={<CheckCircle2 className="text-indigo-600" />} />
          </div>
        </div>
      )}

      {isManagerView && roleData?.overall && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Workload Overview</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <KPICard label="Total Orders" value={roleData.overall.totalOrders} change={0} trend="neutral" icon={<Package className="text-blue-600" />} />
            <KPICard label="Completed Orders" value={roleData.overall.completedOrders} change={0} trend="neutral" icon={<CheckCircle2 className="text-emerald-600" />} />
            <KPICard label="Avg Prod Hours" value={`${roleData.overall.avgProductionHours}h`} change={0} trend="neutral" icon={<Clock className="text-amber-600" />} />
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

      {!isManagerView && (
        <div>
          {/* Non-manager dashboard is intentionally limited to performance analytics */}
        </div>
      )}

      {/* KPI Grid */}
      {isManagerView && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard 
            label="Total Revenue" 
            value={`$${(overview?.totalRevenue ?? 0).toLocaleString()}`} 
            change={12.5} 
            trend="up" 
            icon={<DollarSign className="text-blue-600" />} 
          />
          <KPICard 
            label="Active Jobs" 
            value={overview?.activeJobs ?? 0} 
            change={-2.4} 
            trend="down" 
            icon={<Factory className="text-amber-600" />} 
          />
          <KPICard 
            label="Inventory Value" 
            value={`$${(overview?.inventoryValue ?? 0).toLocaleString()}`} 
            change={5.1} 
            trend="up" 
            icon={<Package className="text-emerald-600" />} 
          />
          <KPICard 
            label="Pending Orders" 
            value={overview?.pendingOrders ?? 0} 
            change={0} 
            trend="neutral" 
            icon={<Clock className="text-indigo-600" />} 
          />
        </div>
      )}

      {/* Charts Section */}
      {isManagerView && (
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
            <AreaChart data={chartData}>
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
            {alerts.length === 0 ? (
              <div className="p-3 text-xs text-slate-400">No inventory alerts right now.</div>
            ) : alerts.map((item: any) => (
              <div key={item.id} className="flex items-start space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className={cn("mt-0.5 rounded-full p-1.5", "bg-amber-100 text-amber-600")}>
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">SKU: {item.sku} • Type: {item.type}</p>
                </div>
                <button className="text-xs font-medium text-blue-600">View</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      )}

      {/* Bottom Grid */}
      {isManagerView && (
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
                {activeJobs.slice(0, 4).map((job: any) => (
                  <tr key={job.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 font-medium">{job.orderNumber || job.id}</td>
                    <td className="py-4">{job.customerName}</td>
                    <td className="py-4 text-slate-500">{job.assignedWorker || 'Unassigned'}</td>
                    <td className="py-4">
                      <div className="flex w-32 items-center space-x-2">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div 
                            className="h-full rounded-full bg-blue-600" 
                            style={{ width: `${job.approvalStatus === 'WORK_IN_PROGRESS' ? 60 : 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{job.approvalStatus === 'WORK_IN_PROGRESS' ? 60 : 20}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={job.approvalStatus === 'WORK_COMPLETED' ? 'success' : 'info'}>
                        {job.approvalStatus?.replace(/_/g, ' ')}
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
            {notifications.length === 0 ? (
              <div className="text-xs text-slate-400">No recent activity.</div>
            ) : notifications.slice(0, 3).map((n: any) => (
              <ActivityItem 
                key={n.id}
                icon={<CheckCircle2 size={16} className="text-emerald-600" />}
                title={n.title}
                time={n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                user={n.message}
              />
            ))}
          </div>
        </Card>
      </div>
      )}
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
