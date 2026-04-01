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

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

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
    updateMutation.mutate({ id: order.id, payload: { approvalStatus: status } as any });
  };

  const assignWorker = (workerName: string) => {
    onUpdate({ ...order, assignedWorker: workerName, approvalStatus: 'SENT_TO_WORKER' });
    updateMutation.mutate({ id: order.id, payload: { assignedWorker: workerName, approvalStatus: 'SENT_TO_WORKER' } as any });
  };

  const isWorker = role === 'PRODUCTION_TEAM';
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
                  <StatusStep 
                    active={!!order.assignedWorker} 
                    label={order.assignedWorker ? `Assigned to ${order.assignedWorker}` : "Awaiting Assignment"} 
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
                  <Button className="w-full" onClick={() => updateApproval('SENT_TO_WORKER')}>
                    Accept Order & Move to Assignment
                  </Button>
                )}

                {isReceptionist && order.approvalStatus === 'SENT_TO_WORKER' && !order.assignedWorker && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Assign to Production Team:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => assignWorker('John Doe')}>John Doe (Welding)</Button>
                      <Button variant="outline" size="sm" onClick={() => assignWorker('Mike Johnson')}>Mike Johnson (CNC)</Button>
                    </div>
                  </div>
                )}

                {isWorker && order.approvalStatus === 'SENT_TO_WORKER' && order.assignedWorker === currentUser.name && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateApproval('WORKER_ACCEPTED')}>
                      <CheckCircle2 size={18} className="mr-2" /> Accept Job
                    </Button>
                    <Button variant="danger" onClick={() => updateApproval('WORKER_REJECTED')}>
                      <XCircle size={18} className="mr-2" /> Reject Job
                    </Button>
                  </div>
                )}

                {isWorker && order.approvalStatus === 'WORKER_ACCEPTED' && order.assignedWorker === currentUser.name && (
                  <Button className="w-full" onClick={() => updateApproval('WORK_IN_PROGRESS')}>
                    Mark In Progress
                  </Button>
                )}

                {isWorker && order.approvalStatus === 'WORK_IN_PROGRESS' && order.assignedWorker === currentUser.name && (
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
