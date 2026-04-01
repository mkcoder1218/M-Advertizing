import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { useCreateProduct, useUploadProductImage, useProducts } from '../lib/api/hooks/useProducts';
import { inventoryResource } from '../lib/api/resources/inventory';

export const BuyerInventory = () => {
  const [form, setForm] = useState({ name: '', type: 'raw', unit: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [stockProductId, setStockProductId] = useState('');
  const [stockQty, setStockQty] = useState(0);
  const productsQuery = useProducts(1, 50, undefined, undefined);
  const createMutation = useCreateProduct();
  const uploadMutation = useUploadProductImage();

  const handleSubmit = async () => {
    if (!form.name || !form.unit) return;
    const created = await createMutation.mutateAsync({
      name: form.name,
      type: form.type as 'raw' | 'finished',
      unit: form.unit,
      description: form.description || undefined,
    });
    if (image) await uploadMutation.mutateAsync({ id: created.id, file: image });
    setForm({ name: '', type: 'raw', unit: '', description: '' });
    setImage(null);
  };

  const handleStock = async () => {
    if (!stockProductId || !stockQty) return;
    await inventoryResource.updateStock(stockProductId, { quantity: stockQty });
    setStockProductId('');
    setStockQty(0);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Intake</h1>
          <p className="text-slate-500">Add purchased goods into inventory/products.</p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Unit</label>
            <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="raw">Raw</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleSubmit} isLoading={createMutation.isPending || uploadMutation.isPending}>
            Add to Inventory
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold mb-4">Add Stock to Existing Product</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={stockProductId}
            onChange={(e) => setStockProductId(e.target.value)}
          >
            <option value="">Select product</option>
            {productsQuery.data?.items.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Input
            type="number"
            value={stockQty}
            onChange={(e) => setStockQty(Number(e.target.value))}
            placeholder="Quantity"
          />
          <Button onClick={handleStock}>Add Stock</Button>
        </div>
      </Card>
    </div>
  );
};
