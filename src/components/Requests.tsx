import React, { useMemo, useState } from 'react';
import { Card, Badge, Button, Input } from './UI';
import { useProducts } from '../lib/api/hooks/useProducts';
import { useCreateStockRequest, useStockRequests, useUpdateStockRequest } from '../lib/api/hooks/useRequests';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Requests = () => {
  const { role } = useApp();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data } = useStockRequests({ page, limit, targetRole: role === 'BUYER' ? 'BUYER' : role === 'STORE_MANAGER' ? 'STORE_MANAGER' : undefined });
  const { data: productsData } = useProducts(1, 50);
  const createMutation = useCreateStockRequest();
  const updateMutation = useUpdateStockRequest();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ productId: '', quantity: 1, notes: '' });

  const requests = data?.items || [];

  const canCreate = role === 'PRODUCTION_TEAM' || role === 'OWNER' || role === 'MANAGER';
  const canAct = role === 'STORE_MANAGER' || role === 'BUYER';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Requests</h1>
          <p className="text-slate-500">Production team requests stock, routed to store manager or buyer.</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setDrawerOpen(true)}>New Request</Button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold">Requests</h3>
          <Badge variant="info">{data?.total || 0}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Target</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((r: any) => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.Product?.name || r.productId}</td>
                  <td className="px-6 py-4">{r.quantity}</td>
                  <td className="px-6 py-4">{r.targetRole}</td>
                  <td className="px-6 py-4">
                    <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {canAct && r.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: r.id, status: 'APPROVED' })}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => updateMutation.mutate({ id: r.id, status: 'REJECTED' })}>Reject</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page} of {data ? Math.ceil(data.total / data.limit) : 1}</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data ? Math.ceil(data.total / data.limit) : 1, p + 1))}>Next</Button>
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
              <h3 className="text-lg font-bold">New Stock Request</h3>
              <p className="text-sm text-slate-500">Request materials or products for production.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                >
                  <option value="">Select product</option>
                  {productsData?.items.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!form.productId || form.quantity <= 0) return;
                    await createMutation.mutateAsync({ productId: form.productId, quantity: form.quantity, notes: form.notes || undefined });
                    setDrawerOpen(false);
                    setForm({ productId: '', quantity: 1, notes: '' });
                  }}
                  isLoading={createMutation.isPending}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
