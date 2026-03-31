import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  MoreHorizontal,
  GripVertical
} from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { MOCK_JOBS } from '../mockData';
import { cn } from '../lib/utils';

export const Production = () => {
  const columns = [
    { id: 'PENDING', title: 'Pending', color: 'bg-slate-500' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'COMPLETED', title: 'Completed', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Pipeline</h1>
          <p className="text-slate-500">Manage and track shop floor operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/team${i}/40/40`} 
                className="h-8 w-8 rounded-full border-2 border-white ring-offset-2 dark:border-slate-900" 
                alt="team"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium dark:border-slate-900 dark:bg-slate-800">
              +5
            </div>
          </div>
          <Button size="sm">
            <Plus size={16} className="mr-2" /> New Job
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex w-80 shrink-0 flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <div className={cn("h-2 w-2 rounded-full", column.color)}></div>
                <h3 className="font-semibold">{column.title}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
                  {MOCK_JOBS.filter(j => j.status === column.id).length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 rounded-2xl bg-slate-100/50 p-3 dark:bg-slate-800/30">
              {MOCK_JOBS.filter(j => j.status === column.id).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              <button className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500 dark:border-slate-800">
                <Plus size={16} className="mr-2" /> Add Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job, ...props }: { job: any; [key: string]: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
    {...props}
  >
    <div className="absolute left-2 top-4 opacity-0 transition-opacity group-hover:opacity-100">
      <GripVertical size={16} className="text-slate-300" />
    </div>
    
    <div className="pl-4">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="font-bold text-sm leading-tight">{job.productName}</h4>
        <span className="text-[10px] font-mono text-slate-400">{job.id}</span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center text-xs text-slate-500">
          <Users size={14} className="mr-2" />
          {job.assignedTeam}
        </div>
        <div className="flex items-center text-xs text-slate-500">
          <Calendar size={14} className="mr-2" />
          Due {job.deadline}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400">
          <span>Progress</span>
          <span>{job.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              job.progress === 100 ? "bg-emerald-500" : "bg-blue-600"
            )}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 dark:border-slate-800">
        <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Clock size={14} />
          <span>Qty: {job.quantity}</span>
        </div>
        <img 
          src={`https://picsum.photos/seed/${job.assignedTeam}/32/32`} 
          className="h-6 w-6 rounded-full" 
          alt="team"
        />
      </div>
    </div>
  </motion.div>
);
