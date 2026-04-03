import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  MoreHorizontal,
  GripVertical
} from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { cn } from '../lib/utils';
import { useOrders, useUpdateOrder } from '../lib/api/hooks/useOrders';
import { useApp } from '../context/AppContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Order } from '../types';

export const Production = () => {
  const { user, role } = useApp();
  const { data } = useOrders(1, 50);
  const updateOrder = useUpdateOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = useMemo<Order[]>(() => {
    const items = data?.items || [];
    return items.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerName,
      date: o.orderDate,
      total: Number(o.total || 0),
      status: o.status,
      approvalStatus: o.approvalStatus,
      assignedWorker: o.assignedWorker || undefined,
      items: Number(o.itemsCount || 0),
      itemsWorkTypes: (o.OrderItems || []).map((i: any) => i.workTypeId).filter(Boolean),
      messages: (o.OrderMessages || []).map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        role: m.role,
      })),
    }));
  }, [data]);

  const visible = orders.filter((o: any) => {
    if (role !== 'PRODUCTION_TEAM') return true;
    const userWorkTypeId = user?.workTypeId;
    const orderWorkTypes = (o as any).itemsWorkTypes || [];
    const matchesWorkType = !userWorkTypeId || orderWorkTypes.includes(userWorkTypeId);
    return matchesWorkType;
  });

  const pending = visible.filter((o) => o.approvalStatus === 'SENT_TO_WORKER');
  const accepted = visible.filter((o) => o.approvalStatus === 'WORKER_ACCEPTED' || o.approvalStatus === 'WORK_IN_PROGRESS');
  const completed = visible.filter((o) => o.approvalStatus === 'WORK_COMPLETED');

  return (
    <div className="space-y-8 h-full flex flex-col">
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onUpdate={(updated) => setSelectedOrder(updated)}
        />
      )}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Pipeline</h1>
          <p className="text-slate-500">Manage and track shop floor operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/team${i}/40/40`} 
                className="h-8 w-8 rounded-full border-2 border-white ring-offset-2 dark:border-slate-900" 
                alt="team"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium dark:border-slate-900 dark:bg-slate-800">
              +5
            </div>
          </div>
          <Button size="sm">
            <Plus size={16} className="mr-2" /> New Job
          </Button>
        </div>
      </div>

      {/* Orders by status */}
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <StatusColumn
          title="Pending Acceptance"
          count={pending.length}
          color="bg-amber-500"
          orders={pending}
          onSelect={setSelectedOrder}
          onAccept={(o: Order) => updateOrder.mutate({ id: o.id, payload: { approvalStatus: 'WORKER_ACCEPTED', assignedWorker: user?.name } as any })}
          showAccept={role === 'PRODUCTION_TEAM'}
        />
        <StatusColumn
          title="Accepted / In Progress"
          count={accepted.length}
          color="bg-emerald-500"
          orders={accepted}
          onSelect={setSelectedOrder}
        />
        <StatusColumn
          title="Completed"
          count={completed.length}
          color="bg-slate-500"
          orders={completed}
          onSelect={setSelectedOrder}
        />
      </div>
    </div>
  );
};

const StatusColumn = ({ title, count, color, orders, onSelect, onAccept, showAccept }: any) => (
  <div className="flex flex-col space-y-4">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)}></div>
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
          {count}
        </span>
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreHorizontal size={18} />
      </button>
    </div>
    <div className="flex-1 space-y-4 rounded-2xl bg-slate-100/50 p-3 dark:bg-slate-800/30">
      {orders.map((o: Order) => (
        <OrderCard
          key={o.id}
          order={o}
          onClick={() => onSelect(o)}
          onAccept={onAccept}
          showAccept={showAccept}
        />
      ))}
    </div>
  </div>
);

const OrderCard = ({ order, onAccept, showAccept, ...props }: { order: Order; onAccept?: (o: Order) => void; showAccept?: boolean; [key: string]: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    {...props}
  >
    <div className="absolute left-2 top-4 opacity-0 transition-opacity group-hover:opacity-100">
      <GripVertical size={16} className="text-slate-300" />
    </div>
    
    <div className="pl-4">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="font-bold text-sm leading-tight">{order.customer}</h4>
        <span className="text-[10px] font-mono text-slate-400">{order.orderNumber || order.id}</span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center text-xs text-slate-500">
          <Users size={14} className="mr-2" />
          {order.assignedWorker || 'Unassigned'}
        </div>
        <div className="flex items-center text-xs text-slate-500">
          <Calendar size={14} className="mr-2" />
          Date {order.date}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400">
          <span>Status</span>
          <span>{order.status}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
        <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Clock size={14} />
          <span>Items: {order.items}</span>
        </div>
        <Badge variant="info">{order.approvalStatus.replace(/_/g, ' ')}</Badge>
      </div>
      {showAccept && order.approvalStatus === 'SENT_TO_WORKER' && (
        <div className="mt-3">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(order);
            }}
          >
            Accept Work
          </Button>
        </div>
      )}
    </div>
  </motion.div>
);
