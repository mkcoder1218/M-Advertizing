import React, { useEffect, useMemo, useState } from 'react';
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
import { OrderDetailsModal } from './OrderDetailsModal';
import { Order } from '../types';
import { cn } from '../lib/utils';
import { useCreateOrder, useOrders, useUpdateOrder } from '../lib/api/hooks/useOrders';
import { useProducts } from '../lib/api/hooks/useProducts';
import { useWorkTypes } from '../lib/api/hooks/useWorkTypes';
import { useApp } from '../context/AppContext';
import { ordersResource } from '../lib/api/resources/orders';

export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({
    orderNumber: '',
    customerName: '',
    customerContact: '',
    status: 'PENDING',
    approvalStatus: 'AWAITING_RECEPTION',
    orderDate: new Date().toISOString().slice(0, 10),
    total: '',
    itemsCount: '',
    needsDesign: false,
    fileAvailable: false,
    items: [{ productId: '', quantity: 1, unitPrice: 0, workTypeId: '' }],
  });
  const [orderFile, setOrderFile] = useState<File | null>(null);
  const { user } = useApp();
  const itemsCount = form.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);
  const totalAmount = form.items.reduce((sum, it) => sum + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0);

  const { data } = useOrders(page, limit, search || undefined);
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const productsQuery = useProducts(1, 50, undefined, undefined);
  const workTypesQuery = useWorkTypes();

  const orders = useMemo<Order[]>(() => {
    const items = data?.items || [];
    return items.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerName,
      customerContact: o.customerContact || undefined,
      date: o.orderDate,
      total: Number(o.total || 0),
      status: o.status,
      approvalStatus: o.approvalStatus,
      needsDesign: Boolean(o.needsDesign),
      fileAvailable: Boolean(o.fileAvailable),
      orderFileUrl: o.orderFileUrl || undefined,
      designFileUrl: o.designFileUrl || undefined,
      assignedWorker: o.assignedWorker || undefined,
      assignedWorkerId: o.assignedWorkerId || undefined,
      assignedDesignerId: o.assignedDesignerId || undefined,
      acceptedById: o.acceptedById || undefined,
      items: Number(o.itemsCount || 0),
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

  useEffect(() => {
    if (!selectedOrder) return;
    const latest = orders.find((o) => o.id === selectedOrder.id);
    if (latest) setSelectedOrder(latest);
  }, [orders, selectedOrder?.id]);

  const handleUpdateOrder = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
  };
  const openCreateDrawer = () => {
    setEditingOrder(null);
    setOrderFile(null);
    setForm({
      orderNumber: '',
      customerName: '',
      customerContact: '',
      status: 'PENDING',
      approvalStatus: 'AWAITING_RECEPTION',
      orderDate: new Date().toISOString().slice(0, 10),
      total: '',
      itemsCount: '',
      needsDesign: false,
      fileAvailable: false,
      items: [{ productId: '', quantity: 1, unitPrice: 0, workTypeId: '' }],
    });
    setDrawerOpen(true);
  };
  const openEditDrawer = (order: Order) => {
    setEditingOrder(order);
    setOrderFile(null);
    setForm({
      orderNumber: order.orderNumber || '',
      customerName: order.customer,
      customerContact: order.customerContact || '',
      status: order.status,
      approvalStatus: order.approvalStatus,
      orderDate: order.date,
      total: String(order.total || 0),
      itemsCount: String(order.items || 0),
      needsDesign: Boolean(order.needsDesign),
      fileAvailable: Boolean(order.fileAvailable),
      items: order.orderItems?.length
        ? order.orderItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            workTypeId: i.workTypeId || '',
          }))
        : [{ productId: '', quantity: 1, unitPrice: 0, workTypeId: '' }],
    });
    setDrawerOpen(true);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-slate-500">Track and manage customer orders through the fulfillment lifecycle.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button size="sm" onClick={openCreateDrawer}>Create Manual Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4 flex items-center justify-between">
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
        <Card className="p-4 flex items-center justify-between">
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
        <Card className="p-4 flex items-center justify-between">
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
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search orders..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="icon"><Filter size={18} /></Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
                  <td className="px-6 py-4 font-bold text-blue-600">{order.orderNumber || order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      order.approvalStatus === 'WORK_COMPLETED' ? 'success' :
                      order.approvalStatus === 'WORK_IN_PROGRESS' ? 'info' :
                      order.approvalStatus === 'WORKER_ACCEPTED' ? 'success' : 
                      order.approvalStatus === 'WORKER_REJECTED' ? 'danger' : 
                      order.approvalStatus === 'SENT_TO_WORKER' ? 'warning' :
                      order.approvalStatus === 'SENT_TO_DESIGNER' ? 'warning' : 'default'
                    }>
                      {order.approvalStatus.replace(/_/g, ' ')}
                    </Badge>
                    <div className="mt-2">
                      <select
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-800 dark:bg-slate-950"
                        value={order.approvalStatus}
                        onChange={(e) => updateMutation.mutate({ id: order.id, payload: { approvalStatus: e.target.value } as any })}
                      >
                        <option value="AWAITING_RECEPTION">AWAITING RECEPTION</option>
                        <option value="SENT_TO_DESIGNER">SEND TO DESIGNER</option>
                        <option value="SENT_TO_WORKER">SEND TO PRODUCTION</option>
                        <option value="WORKER_ACCEPTED">WORKER ACCEPTED</option>
                        <option value="WORK_IN_PROGRESS">WORK IN PROGRESS</option>
                        <option value="WORK_COMPLETED">WORK COMPLETED</option>
                        <option value="WORKER_REJECTED">WORKER REJECTED</option>
                      </select>
                    </div>
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
                      <button
                        onClick={() => openEditDrawer(order)}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                        title="Edit order"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Page {page} of {data ? Math.ceil(data.total / data.limit) : 1}
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data ? Math.ceil(data.total / data.limit) : 1, p + 1))}>
            Next
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <div className={cn('fixed inset-0 z-50', drawerOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity', drawerOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-slate-900 transition-transform',
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-lg font-bold">{editingOrder ? 'Edit Order' : 'Create Manual Order'}</h3>
              <p className="text-sm text-slate-500">
                {editingOrder ? 'Update order details and workflow.' : 'Capture order details and assign status.'}
              </p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Number</label>
                <Input value="Auto-generated by system" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Contact</label>
                <Input value={form.customerContact} onChange={(e) => setForm({ ...form, customerContact: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Design & Files</label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={form.needsDesign}
                      onChange={(e) => {
                        const needs = e.target.checked;
                        setForm({
                          ...form,
                          needsDesign: needs,
                          approvalStatus: needs ? 'SENT_TO_DESIGNER' : 'AWAITING_RECEPTION',
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                    />
                    Needs Design
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={form.fileAvailable}
                      onChange={(e) => setForm({ ...form, fileAvailable: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                    />
                    File Available
                  </label>
                  {form.fileAvailable && (
                    <input
                      type="file"
                      onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Date</label>
                  <Input type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Items</label>
                <div className="space-y-3">
                  {form.items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Product</label>
                        <select
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                          value={it.productId}
                          onChange={(e) => {
                            const items = [...form.items];
                            items[idx].productId = e.target.value;
                            setForm({ ...form, items });
                          }}
                        >
                          <option value="">Select product</option>
                          {productsQuery.data?.items.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Quantity</label>
                        <Input
                          type="number"
                          value={it.quantity}
                          onChange={(e) => {
                            const items = [...form.items];
                            items[idx].quantity = Number(e.target.value);
                            setForm({ ...form, items });
                          }}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Unit Price</label>
                        <Input
                          type="number"
                          value={it.unitPrice}
                          onChange={(e) => {
                            const items = [...form.items];
                            items[idx].unitPrice = Number(e.target.value);
                            setForm({ ...form, items });
                          }}
                          placeholder="Unit price"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Work Type</label>
                        <select
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                          value={it.workTypeId}
                          onChange={(e) => {
                            const items = [...form.items];
                            items[idx].workTypeId = e.target.value;
                            setForm({ ...form, items });
                          }}
                        >
                          <option value="">Work type</option>
                          {workTypesQuery.data?.map((w) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1, unitPrice: 0, workTypeId: '' }] })}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <Input value={totalAmount.toFixed(2)} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Items Count</label>
                  <Input value={itemsCount} disabled />
                </div>
              </div>
              {!form.needsDesign && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow</label>
                  <select
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                    value={form.approvalStatus}
                    onChange={(e) => setForm({ ...form, approvalStatus: e.target.value })}
                  >
                    <option value="AWAITING_RECEPTION">AWAITING RECEPTION</option>
                    <option value="SENT_TO_WORKER">SEND TO PRODUCTION</option>
                    <option value="WORKER_ACCEPTED">WORKER ACCEPTED</option>
                    <option value="WORK_IN_PROGRESS">WORK IN PROGRESS</option>
                    <option value="WORK_COMPLETED">WORK COMPLETED</option>
                    <option value="WORKER_REJECTED">WORKER REJECTED</option>
                  </select>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (editingOrder) {
                      const missingWorkType = form.items
                        .filter((i) => i.productId)
                        .some((i) => !i.workTypeId);
                      if (missingWorkType) {
                        window.alert('Please select a Work Type for each order item.');
                        return;
                      }
                      await updateMutation.mutateAsync({
                        id: editingOrder.id,
                        payload: {
                          status: form.status as any,
                          approvalStatus: form.approvalStatus as any,
                          needsDesign: form.needsDesign,
                          fileAvailable: form.fileAvailable,
                        } as any,
                      });
                      await ordersResource.updateItems(
                        editingOrder.id,
                        form.items
                          .filter((i) => i.productId)
                          .map((i) => ({
                            productId: i.productId,
                            quantity: Number(i.quantity || 0),
                            unitPrice: Number(i.unitPrice || 0),
                            workTypeId: i.workTypeId || undefined,
                          }))
                      );
                      if (orderFile) {
                        await ordersResource.uploadOrderFile(editingOrder.id, orderFile);
                      }
                      setDrawerOpen(false);
                      return;
                    }
                    const missingWorkType = form.items
                      .filter((i) => i.productId)
                      .some((i) => !i.workTypeId);
                    if (missingWorkType) {
                      window.alert('Please select a Work Type for each order item.');
                      return;
                    }
                    const created = await createMutation.mutateAsync({
                      customerName: form.customerName,
                      customerContact: form.customerContact || undefined,
                      status: form.status as any,
                      orderDate: form.orderDate,
                      approvalStatus: form.approvalStatus,
                      acceptedById: user?.id,
                      needsDesign: form.needsDesign,
                      fileAvailable: form.fileAvailable,
                      total: totalAmount,
                      itemsCount: itemsCount,
                      items: form.items
                        .filter((i) => i.productId)
                        .map((i) => ({
                          ...i,
                          workTypeId: i.workTypeId ? i.workTypeId : undefined,
                        })),
                    } as any);
                    if (orderFile) {
                      await ordersResource.uploadOrderFile(created.id, orderFile);
                    }
                    setDrawerOpen(false);
                  }}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingOrder ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
