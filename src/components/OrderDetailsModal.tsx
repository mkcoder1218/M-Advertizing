import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  XCircle, 
  UserPlus,
  MessageSquare,
  Clock,
  User
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { Order, Message } from '../types';
import { useAddOrderMessage, useUpdateOrder } from '../lib/api/hooks/useOrders';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { socket } from '../lib/realtime/socket';
import { ordersResource } from '../lib/api/resources/orders';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (updatedOrder: Order) => void;
}

export const OrderDetailsModal = ({ order, onClose, onUpdate }: OrderDetailsModalProps) => {
  const { role, user: currentUser } = useApp();
  const [messageText, setMessageText] = useState('');
  const updateMutation = useUpdateOrder();
  const messageMutation = useAddOrderMessage();
  const orderRef = useRef(order);
  const [needsDesign, setNeedsDesign] = useState(Boolean(order.needsDesign));
  const [fileAvailable, setFileAvailable] = useState(Boolean(order.fileAvailable));
  const [orderFile, setOrderFile] = useState<File | null>(null);
  const [designFile, setDesignFile] = useState<File | null>(null);

  useEffect(() => {
    orderRef.current = order;
    setNeedsDesign(Boolean(order.needsDesign));
    setFileAvailable(Boolean(order.fileAvailable));
    setOrderFile(null);
    setDesignFile(null);
  }, [order]);

  const toFileUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    return `${base}${url}`;
  };

  useEffect(() => {
    socket.connect();
    socket.emit('joinOrder', order.id);
    const handler = (msg: any) => {
      const current = orderRef.current;
      // avoid duplicate messages or replace optimistic
      const existing = current.messages.find((m) => m.id === msg.id);
      if (existing) return;
      const withoutOptimistic = msg.clientId
        ? current.messages.filter((m) => m.id !== msg.clientId)
        : current.messages;
      onUpdate({
        ...current,
        messages: [
          ...withoutOptimistic,
          {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            role: msg.role,
          },
        ],
      });
    };
    socket.on('orderMessage', handler);
    return () => {
      socket.off('orderMessage', handler);
    };
  }, [order.id, onUpdate]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const clientId = `tmp-${Date.now()}`;
    const optimistic: Message = {
      id: clientId,
      sender: currentUser.name,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: role
    };
    onUpdate({
      ...order,
      messages: [...order.messages, optimistic]
    });
    socket.emit('sendOrderMessage', { orderId: order.id, sender: currentUser.name, role, text: messageText, clientId });
    setMessageText('');
  };

  const updateApproval = (status: Order['approvalStatus']) => {
    onUpdate({ ...order, approvalStatus: status });
    if (status === 'WORK_COMPLETED') {
      socket.emit('orderCompleted', { orderId: order.id });
    }
    const extra: any = {};
    if (status === 'WORKER_ACCEPTED') {
      extra.assignedWorker = currentUser?.name;
      extra.assignedWorkerId = currentUser?.id;
    }
    updateMutation.mutate({ id: order.id, payload: { approvalStatus: status, ...extra } as any });
  };


  const isWorker = role === 'PRODUCTION_TEAM';
  const isDesigner = role === 'DESIGNER';
  const isReceptionist = role === 'ORDER_RECEPTION' || role === 'OWNER' || role === 'MANAGER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold">{order.orderNumber || order.id}</h2>
              <Badge variant={order.status === 'SHIPPED' ? 'success' : 'info'}>{order.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">{order.customer} • {order.date}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side: Info & Actions */}
          <div className="w-1/2 overflow-y-auto border-r border-slate-100 p-6 dark:border-slate-800">
            <div className="space-y-8">
              {/* Order Info */}
              <section>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Order Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Total Value</p>
                    <p className="text-lg font-bold">${order.total.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Items</p>
                    <p className="text-lg font-bold">{order.items} Units</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Order Items</h3>
                <div className="space-y-2">
                  {order.items === 0 ? (
                    <div className="text-xs text-slate-400">No items attached</div>
                  ) : (
                    order.items && order.items > 0 && (
                      <div className="text-xs text-slate-400">Items are assigned per work type.</div>
                    )
                  )}
                </div>
              </section>

              {/* Workflow Status */}
              <section>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Workflow Status</h3>
                <div className="space-y-3">
                  <StatusStep 
                    active={order.approvalStatus !== 'AWAITING_RECEPTION'} 
                    label="Order Received & Accepted" 
                    icon={<CheckCircle2 size={16} />} 
                  />
                  {order.needsDesign && (
                    <StatusStep 
                      active={order.approvalStatus !== 'AWAITING_RECEPTION'} 
                      label={order.approvalStatus === 'SENT_TO_DESIGNER' ? 'Design In Progress' : 'Design Completed'} 
                      icon={<User size={16} />} 
                    />
                  )}
                  <StatusStep 
                    active={order.approvalStatus === 'SENT_TO_WORKER' || order.approvalStatus === 'WORKER_ACCEPTED' || order.approvalStatus === 'WORK_IN_PROGRESS' || order.approvalStatus === 'WORK_COMPLETED'} 
                    label="Sent to Production" 
                    icon={<User size={16} />} 
                  />
                  <StatusStep 
                    active={order.approvalStatus === 'WORKER_ACCEPTED' || order.approvalStatus === 'WORK_IN_PROGRESS' || order.approvalStatus === 'WORK_COMPLETED'} 
                    label="Worker Approval" 
                    icon={<Clock size={16} />} 
                    error={order.approvalStatus === 'WORKER_REJECTED'}
                  />
                  <StatusStep 
                    active={order.approvalStatus === 'WORK_IN_PROGRESS' || order.approvalStatus === 'WORK_COMPLETED'} 
                    label="Work In Progress" 
                    icon={<Clock size={16} />} 
                  />
                  <StatusStep 
                    active={order.approvalStatus === 'WORK_COMPLETED'} 
                    label="Work Completed" 
                    icon={<CheckCircle2 size={16} />} 
                  />
                </div>
              </section>

              {/* Actions */}
              <section className="space-y-4">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Actions</h3>
                
                {isReceptionist && order.approvalStatus === 'AWAITING_RECEPTION' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={needsDesign}
                        onChange={(e) => setNeedsDesign(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                      />
                      Needs Design
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={fileAvailable}
                        onChange={(e) => setFileAvailable(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                      />
                      File Available
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                      />
                      {order.orderFileUrl && (
                        <a href={order.orderFileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                          View uploaded file
                        </a>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      onClick={async () => {
                        const nextStatus = needsDesign ? 'SENT_TO_DESIGNER' : 'SENT_TO_WORKER';
                        updateMutation.mutate({
                          id: order.id,
                          payload: { approvalStatus: nextStatus, needsDesign, fileAvailable, acceptedById: currentUser?.id } as any,
                        });
                        if (orderFile) {
                          const res = await ordersResource.uploadOrderFile(order.id, orderFile);
                          if (res?.order) {
                            onUpdate({ ...order, orderFileUrl: res.order.orderFileUrl || order.orderFileUrl });
                          }
                        }
                        onUpdate({ ...order, approvalStatus: nextStatus as any, needsDesign, fileAvailable });
                      }}
                    >
                      {needsDesign ? 'Accept Order & Send to Designer' : 'Accept Order & Send to Production'}
                    </Button>
                  </div>
                )}

                {isDesigner && order.approvalStatus === 'SENT_TO_DESIGNER' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      onChange={(e) => setDesignFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                    />
                    {order.designFileUrl && (
                      <a href={order.designFileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                        View design file
                      </a>
                    )}
                    <Button
                      className="w-full"
                      onClick={async () => {
                        if (designFile) {
                          const res = await ordersResource.uploadDesignFile(order.id, designFile);
                          if (res?.order) {
                            onUpdate({ ...order, designFileUrl: res.order.designFileUrl || order.designFileUrl });
                          }
                        }
                        updateMutation.mutate({
                          id: order.id,
                          payload: { approvalStatus: 'SENT_TO_WORKER', assignedDesignerId: currentUser?.id } as any,
                        });
                        onUpdate({ ...order, approvalStatus: 'SENT_TO_WORKER' as any, assignedDesignerId: currentUser?.id });
                      }}
                    >
                      Design Completed & Send to Production
                    </Button>
                  </div>
                )}

                {isWorker && order.approvalStatus === 'SENT_TO_WORKER' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateApproval('WORKER_ACCEPTED')}>
                      <CheckCircle2 size={18} className="mr-2" /> Accept Job
                    </Button>
                    <Button variant="danger" onClick={() => updateApproval('WORKER_REJECTED')}>
                      <XCircle size={18} className="mr-2" /> Reject Job
                    </Button>
                  </div>
                )}

                {isWorker && order.approvalStatus === 'WORKER_ACCEPTED' && (
                  <Button className="w-full" onClick={() => updateApproval('WORK_IN_PROGRESS')}>
                    Mark In Progress
                  </Button>
                )}

                {isWorker && order.approvalStatus === 'WORK_IN_PROGRESS' && (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => updateApproval('WORK_COMPLETED')}>
                    Mark Work Completed
                  </Button>
                )}

                {order.approvalStatus === 'WORKER_REJECTED' && (
                  <div className="rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20">
                    <p className="text-sm font-bold">Job Rejected by Worker</p>
                    <p className="text-xs">Please re-assign or contact the worker for more details.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right Side: Chat */}
          <div className="flex w-1/2 flex-col bg-slate-50 dark:bg-slate-950/50">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} className="text-blue-600" />
                <h3 className="font-bold">Order Discussion</h3>
              </div>
            </div>

            {(role === 'PRODUCTION_TEAM' || role === 'DESIGNER') && (
              <div className="border-b border-slate-100 p-4 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Work Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Customer</div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-slate-400">{order.customerContact || 'No contact'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Flags</div>
                    <div>{order.needsDesign ? 'Needs Design' : 'No Design Needed'}</div>
                    <div>{order.fileAvailable ? 'File Available' : 'No File'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Files</div>
                    {order.orderFileUrl ? (
                      <a href={toFileUrl(order.orderFileUrl)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Client File
                      </a>
                    ) : (
                      <div>No client file</div>
                    )}
                    {order.designFileUrl ? (
                      <a href={toFileUrl(order.designFileUrl)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Design File
                      </a>
                    ) : (
                      <div>No design file</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Schedule</div>
                    <div>Due: Not set</div>
                    <div>Priority: Normal</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-500">Items</div>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {order.orderItems.map((it, idx) => (
                        <li key={`${it.productId}-${idx}`} className="flex justify-between">
                          <span>{it.productName || it.productId}</span>
                          <span className="text-slate-400">x{it.quantity} {it.workTypeName ? `• ${it.workTypeName}` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-400">No items listed</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {order.messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                  <MessageSquare size={48} className="mb-4 opacity-10" />
                  <p>No messages yet</p>
                  <p className="text-xs">Start a conversation about this order</p>
                </div>
              ) : (
                [...order.messages]
                  .sort((a, b) => {
                    const ta = a.timestamp ? Date.parse(`1970-01-01T${a.timestamp}`) : 0;
                    const tb = b.timestamp ? Date.parse(`1970-01-01T${b.timestamp}`) : 0;
                    return ta - tb;
                  })
                  .map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col",
                      msg.sender === currentUser.name ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                      msg.sender === currentUser.name 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 rounded-tl-none"
                    )}>
                      <p className="text-[10px] font-bold opacity-70 mb-1">{msg.sender} • {msg.role.replace('_', ' ')}</p>
                      <p>{msg.text}</p>
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Type a message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatusStep = ({ active, label, icon, error }: any) => (
  <div className={cn(
    "flex items-center space-x-3 rounded-xl p-3 transition-colors",
    active ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800",
    error && "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  )}>
    <div className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full",
      active ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700",
      error && "bg-red-600 text-white"
    )}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);
