import React from 'react';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES_CONFIG } from '../constants';
import { UserRole } from '../types';

export const Topbar = () => {
  const { isDarkMode, toggleDarkMode, role, setRole, user } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search for jobs, orders, or items..."
          className="h-10 w-full rounded-xl border-none bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Role Selector (Demo Only) */}
        <div className="relative group">
          <button className="flex items-center space-x-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800">
            <span>Role: {ROLES_CONFIG[role].label}</span>
            <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block dark:border-slate-800 dark:bg-slate-900">
            {(Object.keys(ROLES_CONFIG) as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {ROLES_CONFIG[r].label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

        <button className="flex items-center space-x-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};
