import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Calendar, 
  MoreVertical,
  Mail,
  Phone
} from 'lucide-react';
import { Card, Badge, Button, Input } from './UI';
import { useCreateEmployee, useEmployees } from '../lib/api/hooks/useHr';
import { cn } from '../lib/utils';

export const HR = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const { data } = useEmployees(page, limit, search || undefined);
  const employees = data?.items || [];
  const createMutation = useCreateEmployee();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    hireDate: '',
  });

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName) return;
    await createMutation.mutateAsync({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email || undefined,
      phone: form.phone || undefined,
      position: form.position || undefined,
      hireDate: form.hireDate || undefined,
    });
    setDrawerOpen(false);
    setForm({ firstName: '', lastName: '', email: '', phone: '', position: '', hireDate: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-slate-500">Manage employee records, attendance, and performance.</p>
        </div>
        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <UserPlus size={16} className="mr-2" /> Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="flex items-center space-x-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Employees</p>
            <h4 className="text-2xl font-bold">124</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Attendance</p>
            <h4 className="text-2xl font-bold">92%</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">On Leave</p>
            <h4 className="text-2xl font-bold">8</h4>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-semibold">Employee Directory</h3>
          <div className="flex items-center space-x-2">
            <Input placeholder="Search employees..." className="w-full md:w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Employee</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Department</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Attendance</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.map((emp: any) => (
                <tr key={emp.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={`https://picsum.photos/seed/${emp.firstName}${emp.lastName}/40/40`} className="h-10 w-10 rounded-full" alt="" />
                      <div>
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-slate-500">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{emp.position || '—'}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.isActive ? 'success' : 'warning'}>
                      {emp.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `80%` }} />
                      </div>
                      <span className="text-xs font-medium">80%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600"><Mail size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600"><Phone size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Page {page} of {data ? Math.ceil(data.total / data.limit) : 1}
        </div>
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
              <h3 className="text-lg font-bold">Add Employee</h3>
              <p className="text-sm text-slate-500">Create a new employee record.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hire Date</label>
                <Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} isLoading={createMutation.isPending}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
