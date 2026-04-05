import React, { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Order } from '../types';
import { useOrders } from '../lib/api/hooks/useOrders';

export const DesignerOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const { data } = useOrders(1, 50, search || undefined);

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
      needsDesign: Boolean(o.needsDesign),
      fileAvailable: Boolean(o.fileAvailable),
      orderFileUrl: o.orderFileUrl || undefined,
      designFileUrl: o.designFileUrl || undefined,
      assignedWorker: o.assignedWorker || undefined,
      items: Number(o.itemsCount || 0),
      customerContact: o.customerContact || undefined,
      orderItems: (o.OrderItems || []).map((i: any) => ({
        productId: i.productId,
        productName: i.Product?.name,
        quantity: Number(i.quantity || 0),
        unitPrice: Number(i.unitPrice || 0),
        workTypeId: i.workTypeId || undefined,
        workTypeName: i.WorkType?.name,
      })),
      messages: (o.OrderMessages || []).map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        role: m.role,
      })),
    }));
  }, [data]);

  const toFileUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    return `${base}${url}`;
  };

  const visible = orders.filter((o) => o.approvalStatus === 'SENT_TO_DESIGNER');

  return (
    <div className="space-y-8">
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={setSelectedOrder}
        />
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Designer Orders</h1>
          <p className="text-slate-500">Orders waiting for design and file preparation.</p>
        </div>
        <div className="w-full md:w-72">
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Files</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visible.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-blue-600">{order.orderNumber || order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4">
                    <Badge variant="warning">SENT TO DESIGNER</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="space-y-1">
                      {order.orderFileUrl ? (
                        <a
                          href={toFileUrl(order.orderFileUrl)}
                          download
                          className="text-blue-600 hover:underline"
                        >
                          Download client file
                        </a>
                      ) : (
                        <div>No client file</div>
                      )}
                      {order.designFileUrl ? (
                        <a
                          href={toFileUrl(order.designFileUrl)}
                          download
                          className="text-blue-600 hover:underline"
                        >
                          Download design file
                        </a>
                      ) : (
                        <div>No design file</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2"
                    >
                      <Eye size={14} />
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    No orders waiting for design.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
