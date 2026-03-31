import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign,
  Briefcase,
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  XCircle,
  UserPlus
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { MOCK_TENDERS } from '../mockData';
import { Tender } from '../types';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Tenders = () => {
  const { role, user: currentUser } = useApp();
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);

  const updateTenderStatus = (id: string, status: Tender['approvalStatus']) => {
    setTenders(tenders.map(t => t.id === id ? { ...t, approvalStatus: status } : t));
  };

  const assignTender = (id: string, workerName: string) => {
    setTenders(tenders.map(t => t.id === id ? { 
      ...t, 
      assignedWorker: workerName, 
      assignedBy: currentUser.name,
      approvalStatus: 'ASSIGNED_TO_WORKER' 
    } : t));
  };

  const isManagement = role === 'OWNER' || role === 'MANAGER' || role === 'HR';
  const isTenderTeam = role === 'TENDER';
  const isWorker = role === 'PRODUCTION_TEAM';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenders & Contracts</h1>
          <p className="text-slate-500">Manage bidding processes and large-scale contracts.</p>
        </div>
        {isTenderTeam && (
          <Button size="sm">
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Project Pipeline</h3>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search tenders..." className="w-64" />
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
                      <p className="text-sm text-slate-500 mt-1">{tender.client}</p>
                      
                      <div className="mt-4 flex items-center space-x-6">
                        <div className="flex items-center text-xs text-slate-500">
                          <DollarSign size={14} className="mr-1" />
                          ${tender.value.toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar size={14} className="mr-1" />
                          Due {tender.deadline}
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
