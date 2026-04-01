import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  LayoutGrid, 
  List, 
  MoreVertical,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { useCreateProduct, useProducts, useUpdateProduct, useUploadProductImage } from '../lib/api/hooks/useProducts';
import { cn } from '../lib/utils';

export const Inventory = () => {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'raw' | 'finished' | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ sku: '', name: '', type: 'raw', unit: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useProducts(page, limit, typeFilter || undefined, debouncedSearch || undefined);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useUploadProductImage();
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const imageUrl = (url?: string, fallback = 'https://via.placeholder.com/32') => {
    if (!url) return fallback;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `${apiBase}${url}`;
  };

  const items = useMemo(() => {
    const list = data?.items || [];
    if (!search) return list;
    return list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const resetForm = () => {
    setForm({ sku: '', name: '', type: 'raw', unit: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.unit) return;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: { ...form, sku: undefined } });
      if (imageFile) await uploadMutation.mutateAsync({ id: editingId, file: imageFile });
    } else {
      const created = await createMutation.mutateAsync({
        name: form.name,
        type: form.type as 'raw' | 'finished',
        unit: form.unit,
        description: form.description || undefined,
      });
      if (imageFile) await uploadMutation.mutateAsync({ id: created.id, file: imageFile });
    }
    resetForm();
    setDrawerOpen(false);
  };

  const openCreateDrawer = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: any) => {
    setEditingId(item.id);
    setForm({
      sku: '',
      name: item.name,
      type: item.type,
      unit: item.unit,
      description: item.description || '',
    });
    setImagePreview(item.Upload?.url || null);
    setDrawerOpen(true);
  };

  const onPickFile = () => {
    fileRef.current?.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-slate-500">Track raw materials, consumables, and finished goods.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button size="sm" onClick={openCreateDrawer}>
            <Plus size={16} className="mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {/* Filters & Controls */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search inventory..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="">All</option>
              <option value="raw">Raw</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button 
              onClick={() => setView('table')}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                view === 'table' ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setView('grid')}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                view === 'grid' ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {view === 'table' ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
                      <span>Item Name</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">SKU</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Stock Level</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Unit Price</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr><td className="px-6 py-6" colSpan={7}>Loading...</td></tr>
                ) : items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={imageUrl(item.Upload?.url)}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">-</span>
                        <span className="text-xs text-slate-400">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">ACTIVE</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">-</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditDrawer(item)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <Badge variant="success">ACTIVE</Badge>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <img src={imageUrl(item.Upload?.url, 'https://via.placeholder.com/320x200')} className="mb-3 h-36 w-full rounded-xl object-cover" />
                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                <p className="mt-1 text-xs text-slate-500 font-mono">{item.sku}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stock</p>
                    <p className="text-xl font-bold">- <span className="text-sm font-normal text-slate-500">{item.unit}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Price</p>
                    <p className="text-xl font-bold">-</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <Button variant="secondary" className="flex-1 text-xs">Edit</Button>
                <Button className="flex-1 text-xs">Restock</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <div className={cn('fixed inset-0 z-50', drawerOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity',
            drawerOpen ? 'opacity-100' : 'opacity-0'
          )}
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
              <h3 className="text-lg font-bold">
                {editingId ? 'Update Product' : 'Add Product'}
              </h3>
              <p className="text-sm text-slate-500">Add details and upload an image.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    {imagePreview ? (
                      <img src={imageUrl(imagePreview, imagePreview)} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        Preview
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" onClick={onPickFile}>
                      Choose Image
                    </Button>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (!file) {
                      setImagePreview(null);
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input value="Auto-generated by system" disabled />
              </div>
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
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="raw">Raw</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
                >
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
