import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  DollarSign,
  Briefcase,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { useCreateTender, useTenders, useUpdateTender } from '../lib/api/hooks/useTenders';

export const Tenders = () => {
  const { role, user: currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data } = useTenders({ page, limit, search });
  const tenders = data?.items || [];
  const createTender = useCreateTender();
  const updateTender = useUpdateTender();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    value: '',
    dueDate: '',
    description: '',
  });

  const updateTenderStatus = (id: string, approvalStatus: string) => {
    updateTender.mutate({ id, payload: { approvalStatus } });
  };

  const assignTender = (id: string, workerName: string) => {
    updateTender.mutate({
      id,
      payload: { assignedWorker: workerName, assignedBy: currentUser.name, approvalStatus: 'ASSIGNED_TO_WORKER' },
    });
  };

  const isManagement = role === 'OWNER' || role === 'MANAGER' || role === 'HR';
  const isTenderTeam = role === 'TENDER' || isManagement;
  const isWorker = role === 'PRODUCTION_TEAM';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenders & Contracts</h1>
          <p className="text-slate-500">Manage bidding processes and large-scale contracts.</p>
        </div>
        {isTenderTeam && (
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            <Plus size={16} className="mr-2" /> New Tender
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="bg-white dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Approval</p>
          <h4 className="text-3xl font-black mt-2">{tenders.filter(t => t.approvalStatus === 'PENDING_MANAGEMENT').length}</h4>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/3 rounded-full bg-amber-500" />
          </div>
        </Card>
        <Card className="bg-white dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved</p>
          <h4 className="text-3xl font-black mt-2">{tenders.filter(t => t.approvalStatus === 'APPROVED').length}</h4>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/2 rounded-full bg-emerald-500" />
          </div>
        </Card>
        <Card className="bg-white dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Production</p>
          <h4 className="text-3xl font-black mt-2">{tenders.filter(t => t.approvalStatus === 'WORKER_ACCEPTED').length}</h4>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/4 rounded-full bg-blue-600" />
          </div>
        </Card>
        <Card className="bg-white dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Win Rate</p>
          <h4 className="text-3xl font-black mt-2">68%</h4>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-[68%] rounded-full bg-indigo-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-bold">Project Pipeline</h3>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search tenders..."
                className="w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {tenders.map((tender) => (
              <Card key={tender.id} className="group hover:border-blue-500 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-bold leading-tight group-hover:text-blue-600">{tender.title}</h4>
                        <Badge variant={
                          tender.approvalStatus === 'WORKER_ACCEPTED' ? 'success' :
                          tender.approvalStatus === 'APPROVED' ? 'info' :
                          tender.approvalStatus === 'PENDING_MANAGEMENT' ? 'warning' : 'default'
                        }>
                          {tender.approvalStatus.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{tender.clientName}</p>
                      
                      <div className="mt-4 flex items-center space-x-6">
                        <div className="flex items-center text-xs text-slate-500">
                          <DollarSign size={14} className="mr-1" />
                          ${Number(tender.value || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar size={14} className="mr-1" />
                          Due {tender.dueDate || 'N/A'}
                        </div>
                        {tender.assignedWorker && (
                          <div className="flex items-center text-xs font-bold text-blue-600">
                            <Briefcase size={14} className="mr-1" />
                            Worker: {tender.assignedWorker}
                          </div>
                        )}
                      </div>

                      {/* Role-Based Actions */}
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-50 pt-4 dark:border-slate-800">
                        {isManagement && tender.approvalStatus === 'PENDING_MANAGEMENT' && (
                          <>
                            <Button size="sm" onClick={() => updateTenderStatus(tender.id, 'APPROVED')}>
                              <CheckCircle2 size={14} className="mr-2" /> Approve Tender
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => updateTenderStatus(tender.id, 'REJECTED')}>
                              <XCircle size={14} className="mr-2" /> Reject
                            </Button>
                          </>
                        )}

                        {isManagement && tender.approvalStatus === 'APPROVED' && (
                          <div className="flex items-center space-x-2">
                            <p className="text-xs font-bold text-slate-400 uppercase">Assign To:</p>
                            <Button variant="outline" size="sm" onClick={() => assignTender(tender.id, 'John Doe')}>John Doe</Button>
                            <Button variant="outline" size="sm" onClick={() => assignTender(tender.id, 'Mike Johnson')}>Mike Johnson</Button>
                          </div>
                        )}

                        {isWorker && tender.approvalStatus === 'ASSIGNED_TO_WORKER' && tender.assignedWorker === currentUser.name && (
                          <>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateTenderStatus(tender.id, 'WORKER_ACCEPTED')}>
                              <CheckCircle2 size={14} className="mr-2" /> Accept Project
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => updateTenderStatus(tender.id, 'REJECTED')}>
                              <XCircle size={14} className="mr-2" /> Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold mb-6">Workflow Progress</h3>
            <div className="space-y-4">
              <WorkflowStep label="Tender Submission" completed={true} />
              <WorkflowStep label="Management Approval" completed={tenders.some(t => t.approvalStatus === 'APPROVED' || t.approvalStatus === 'ASSIGNED_TO_WORKER')} />
              <WorkflowStep label="Worker Assignment" completed={tenders.some(t => t.approvalStatus === 'ASSIGNED_TO_WORKER')} />
              <WorkflowStep label="Production Start" completed={tenders.some(t => t.approvalStatus === 'WORKER_ACCEPTED')} />
            </div>
          </Card>

          <Card className="bg-blue-600 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Briefcase size={20} />
              <h3 className="font-bold">Bidding Strategy</h3>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Our current win rate is up 12% from last quarter. Focus on municipal projects for higher margins.
            </p>
            <Button variant="secondary" className="w-full mt-6 bg-white/10 text-white hover:bg-white/20 border-none">
              Analyze Performance
            </Button>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page} of {data ? Math.ceil(data.total / data.limit) : 1}</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data ? Math.ceil(data.total / data.limit) : 1, p + 1))}>Next</Button>
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
              <h3 className="text-lg font-bold">New Tender</h3>
              <p className="text-sm text-slate-500">Add a new tender record.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!form.title || !form.clientName || !form.value) return;
                    await createTender.mutateAsync({
                      title: form.title,
                      clientName: form.clientName,
                      value: Number(form.value),
                      dueDate: form.dueDate || undefined,
                      description: form.description || undefined,
                    });
                    setDrawerOpen(false);
                    setForm({ title: '', clientName: '', value: '', dueDate: '', description: '' });
                  }}
                  isLoading={createTender.isPending}
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

const WorkflowStep = ({ label, completed }: any) => (
  <div className="flex items-center space-x-3">
    <div className={cn(
      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
      completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
    )}>
      {completed ? <CheckCircle2 size={14} /> : "•"}
    </div>
    <span className={cn("text-sm", completed ? "font-bold text-slate-900 dark:text-white" : "text-slate-400")}>{label}</span>
  </div>
);
