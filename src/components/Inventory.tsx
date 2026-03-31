import React, { useState } from 'react';
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
import { MOCK_INVENTORY } from '../mockData';
import { cn } from '../lib/utils';

export const Inventory = () => {
  const [view, setView] = useState<'table' | 'grid'>('table');

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
          <Button size="sm">
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
              <Input placeholder="Search inventory..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
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
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{item.stock}</span>
                        <span className="text-xs text-slate-400">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        item.status === 'NORMAL' ? 'success' : 
                        item.status === 'LOW' ? 'warning' : 'danger'
                      }>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700">
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
          {MOCK_INVENTORY.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <Badge variant={
                    item.status === 'NORMAL' ? 'success' : 
                    item.status === 'LOW' ? 'warning' : 'danger'
                  }>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                <p className="mt-1 text-xs text-slate-500 font-mono">{item.sku}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stock</p>
                    <p className="text-xl font-bold">{item.stock} <span className="text-sm font-normal text-slate-500">{item.unit}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Price</p>
                    <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
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
    </div>
  );
};
