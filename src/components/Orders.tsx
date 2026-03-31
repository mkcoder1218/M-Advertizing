import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { MOCK_ORDERS } from '../mockData';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Order } from '../types';
import { cn } from '../lib/utils';

export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
  };

  return (
    <div className="space-y-8">
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onUpdate={handleUpdateOrder}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-slate-500">Track and manage customer orders through the fulfillment lifecycle.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button size="sm">Create Manual Order</Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Card className="flex-1 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">New Orders</p>
              <p className="text-xl font-bold">{orders.filter(o => o.approvalStatus === 'AWAITING_RECEPTION').length}</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-300" />
        </Card>
        <Card className="flex-1 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Awaiting Worker</p>
              <p className="text-xl font-bold">{orders.filter(o => o.approvalStatus === 'SENT_TO_WORKER').length}</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-300" />
        </Card>
        <Card className="flex-1 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">In Production</p>
              <p className="text-xl font-bold">{orders.filter(o => o.approvalStatus === 'WORKER_ACCEPTED').length}</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-300" />
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search orders..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon"><Filter size={18} /></Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="info">All Orders</Badge>
            <Badge variant="default">Pending</Badge>
            <Badge variant="default">Shipped</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Workflow Status</th>
                <th className="px-6 py-4 font-semibold">Assigned To</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      order.approvalStatus === 'WORKER_ACCEPTED' ? 'success' : 
                      order.approvalStatus === 'WORKER_REJECTED' ? 'danger' : 
                      order.approvalStatus === 'SENT_TO_WORKER' ? 'warning' : 'default'
                    }>
                      {order.approvalStatus.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {order.assignedWorker || <span className="italic text-slate-300">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4 font-bold">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      order.status === 'SHIPPED' ? 'success' : 
                      order.status === 'PENDING' ? 'warning' : 'info'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20"
                      >
                        <Eye size={14} />
                        <span>View & Chat</span>
                        {order.messages.length > 0 && (
                          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                            {order.messages.length}
                          </span>
                        )}
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
