import React, { useState } from 'react';
import {
  Truck,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { useCreatePurchaseOrder, usePurchaseOrders, useSuppliers } from '../lib/api/hooks/useProcurement';
import { cn } from '../lib/utils';

export const Procurement = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const { data: suppliersData } = useSuppliers({ page: 1, limit: 50, search });
  const { data: poData } = usePurchaseOrders({ page, limit, search });
  const purchaseOrders = poData?.items || [];
  const suppliers = suppliersData?.items || [];
  const createPO = useCreatePurchaseOrder();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ supplierId: '', status: 'PENDING', orderDate: '', expectedDate: '' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement</h1>
          <p className="text-slate-500">Manage suppliers and purchase orders.</p>
        </div>
        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="font-semibold">Recent Purchase Orders</h3>
              <Input
                placeholder="Search PO..."
                className="w-full md:w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">PO Number</th>
                    <th className="px-6 py-4 font-semibold">Supplier</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {purchaseOrders.map((po: any) => (
                    <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-medium">{po.poNumber}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{po.Supplier?.name || po.supplierId}</td>
                      <td className="px-6 py-4 text-slate-500">{po.orderDate}</td>
                      <td className="px-6 py-4 font-bold">—</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          po.status === 'RECEIVED' ? 'success' :
                          po.status === 'PENDING' ? 'warning' : 'info'
                        }>
                          {po.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="bg-blue-600 text-white">
              <p className="text-sm opacity-80">Total Spend (Month)</p>
              <h4 className="text-3xl font-bold mt-1">$0</h4>
              <div className="mt-4 flex items-center text-xs opacity-80">
                <CheckCircle2 size={14} className="mr-1" /> {purchaseOrders.length} Orders
              </div>
            </Card>
            <Card className="bg-slate-900 text-white dark:bg-slate-800">
              <p className="text-sm opacity-80">Pending Approvals</p>
              <h4 className="text-3xl font-bold mt-1">{purchaseOrders.filter((po: any) => po.status === 'PENDING').length}</h4>
              <div className="mt-4 flex items-center text-xs text-amber-400">
                <AlertCircle size={14} className="mr-1" /> Action required
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold">Suppliers</h3>
              <Button variant="ghost" size="sm"><Plus size={16} /></Button>
            </div>
            <div className="space-y-4">
              {suppliers.map((supplier: any) => (
                <div key={supplier.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{supplier.name}</p>
                      <p className="text-xs text-slate-500">{supplier.email || supplier.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-600">Active</p>
                    <button className="text-slate-400 hover:text-blue-600"><ExternalLink size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-50 dark:bg-slate-800/50 border-dashed">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-3 rounded-full bg-white p-3 shadow-sm dark:bg-slate-900">
                <Clock size={24} className="text-blue-600" />
              </div>
              <h4 className="font-bold">Procurement Queue</h4>
              <p className="text-xs text-slate-500 mt-1">Items waiting for buyer assignment</p>
              <Button variant="outline" size="sm" className="mt-4">Process Queue</Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page} of {poData ? Math.ceil(poData.total / poData.limit) : 1}</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(poData ? Math.ceil(poData.total / poData.limit) : 1, p + 1))}>Next</Button>
        </div>
      </div>

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
              <h3 className="text-lg font-bold">New Purchase Order</h3>
              <p className="text-sm text-slate-500">Create a purchase order for a supplier.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.supplierId}
                  onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="RECEIVED">RECEIVED</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Date</label>
                <Input type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Date</label>
                <Input type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!form.supplierId) return;
                    await createPO.mutateAsync({
                      supplierId: form.supplierId,
                      status: form.status,
                      orderDate: form.orderDate || undefined,
                      expectedDate: form.expectedDate || undefined,
                    });
                    setDrawerOpen(false);
                    setForm({ supplierId: '', status: 'PENDING', orderDate: '', expectedDate: '' });
                  }}
                  isLoading={createPO.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
