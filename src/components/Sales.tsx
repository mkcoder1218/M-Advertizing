import React, { useMemo, useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  CreditCard, 
  Trash2, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';
import { Card, Button, Input, Badge } from './UI';
import { useProducts } from '../lib/api/hooks/useProducts';
import { cn } from '../lib/utils';
import { useCreateSale, useCreateSaleItem } from '../lib/api/hooks/useSales';

export const Sales = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useProducts(1, 50, undefined, searchQuery || undefined);
  const createSale = useCreateSale();
  const createSaleItem = useCreateSaleItem();

  const filteredItems = useMemo(() => data?.items || [], [data]);

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const toNumber = (v: any) => (v === null || v === undefined || v === '' ? 0 : Number(v));
  const subtotal = cart.reduce((acc, item) => acc + (toNumber(item.sellingPrice ?? item.price) * item.qty), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;


  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:h-[calc(100vh-120px)]">
      {/* Product Selection */}
      <div className="flex flex-1 flex-col space-y-6 overflow-hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Terminal</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto pr-0 sm:pr-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              disabled={(item.stock ?? 0) === 0}
              className={cn(
                "group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-blue-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900",
                (item.stock ?? 0) === 0 && "opacity-50 grayscale"
              )}
            >
              <div className="mb-3 flex w-full items-center justify-between">
                <Badge variant={(item.stock ?? 0) > 10 ? 'success' : 'warning'}>
                  {item.stock ?? 0} in stock
                </Badge>
                <span className="text-xs font-mono text-slate-400">{item.sku}</span>
              </div>
              <h3 className="mb-1 font-bold text-slate-900 group-hover:text-blue-600 dark:text-white">{item.name}</h3>
              <p className="text-xs text-slate-500">{item.type}</p>
              <div className="mt-4 flex w-full items-center justify-between">
                <span className="text-lg font-black text-slate-900 dark:text-white">${toNumber(item.sellingPrice ?? item.price).toFixed(2)}</span>
                <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-blue-900/20">
                  <Plus size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout Sidebar */}
      <Card className="flex w-full flex-col p-0 overflow-hidden lg:w-96">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={20} className="text-blue-600" />
            <h2 className="font-bold">Current Order</h2>
          </div>
          <Badge variant="info">{cart.length} items</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh] lg:max-h-none">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <p className="text-xs">Select products to start an order</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-slate-500">${toNumber(item.sellingPrice ?? item.price).toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  <button onClick={() => updateQty(item.id, -1)} className="p-0.5 hover:text-blue-600"><Minus size={14} /></button>
                  <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-0.5 hover:text-blue-600"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax (15%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User size={18} className="mr-2" /> Select Customer
            </Button>
            <Button
              className="w-full py-6 text-lg"
              isLoading={createSale.isPending || createSaleItem.isPending}
              onClick={async () => {
                if (cart.length === 0) return;
                const sale = await createSale.mutateAsync({
                  saleDate: new Date().toISOString().slice(0, 10),
                  status: 'COMPLETED',
                });
                for (const item of cart) {
                  await createSaleItem.mutateAsync({
                    saleId: sale.id,
                    productId: item.id,
                    quantity: item.qty,
                    unitPrice: item.sellingPrice ?? item.price ?? 0,
                  });
                }
                setCart([]);
              }}
            >
              <CreditCard size={20} className="mr-2" /> Checkout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
