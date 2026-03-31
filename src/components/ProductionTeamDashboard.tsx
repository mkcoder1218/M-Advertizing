import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  User
} from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { MOCK_JOBS } from '../mockData';
import { cn } from '../lib/utils';

export const ProductionTeamDashboard = () => {
  const myJobs = MOCK_JOBS.filter(j => j.assignedTeam === 'Welding A' || j.assignedTeam === 'CNC Team');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Workload</h1>
          <p className="text-slate-500">Focus on your assigned tasks for today.</p>
        </div>
        <div className="flex items-center space-x-2 rounded-xl bg-blue-50 px-4 py-2 text-blue-600 dark:bg-blue-900/20">
          <User size={18} />
          <span className="text-sm font-bold">Team: Welding A</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Task */}
        <Card className="lg:col-span-2 border-2 border-blue-500 ring-4 ring-blue-500/10">
          <div className="mb-6 flex items-center justify-between">
            <Badge variant="info">Active Now</Badge>
            <span className="text-xs font-mono text-slate-400">J-101</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Custom Gate Frame</h2>
          <p className="mt-2 text-lg text-slate-500">Quantity: 5 units • Deadline: 2026-04-05</p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between font-bold">
              <span>Overall Progress</span>
              <span>65%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[65%] rounded-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <Button className="py-8 text-xl font-bold bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 size={24} className="mr-2" /> Complete Task
            </Button>
            <Button variant="secondary" className="py-8 text-xl font-bold">
              <Clock size={24} className="mr-2" /> Pause Work
            </Button>
          </div>
        </Card>

        {/* Stats & Next */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white dark:bg-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Daily Goal</h3>
            <div className="mt-4 flex items-end justify-between">
              <h4 className="text-5xl font-black">8/12</h4>
              <p className="text-xs opacity-60 mb-2">Units Finished</p>
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-blue-400" />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-4">Up Next</h3>
            <div className="space-y-4">
              {myJobs.filter(j => j.status === 'PENDING').map(job => (
                <div key={job.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold">{job.productName}</p>
                    <p className="text-xs text-slate-500">Qty: {job.quantity}</p>
                  </div>
                  <button className="rounded-lg bg-slate-100 p-2 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Play size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-amber-600 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Material Alert</h4>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                  Steel Sheet 2mm stock is low. Notify store manager if you need more for J-102.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Task List */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold">Assigned Tasks</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myJobs.map(job => (
            <div key={job.id} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl",
                  job.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-600" : 
                  job.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" : 
                  "bg-slate-100 text-slate-400"
                )}>
                  {job.status === 'IN_PROGRESS' ? <Clock size={24} /> : 
                   job.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : 
                   <Play size={24} />}
                </div>
                <div>
                  <h4 className="font-bold">{job.productName}</h4>
                  <p className="text-xs text-slate-500">Job ID: {job.id} • Deadline: {job.deadline}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</p>
                  <p className="text-lg font-black">{job.quantity}</p>
                </div>
                <Badge variant={job.status === 'COMPLETED' ? 'success' : job.status === 'IN_PROGRESS' ? 'info' : 'default'}>
                  {job.status.replace('_', ' ')}
                </Badge>
                <button className="text-slate-300 hover:text-slate-600">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
