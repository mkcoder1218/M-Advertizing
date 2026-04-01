import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Moon, Sun, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES_CONFIG } from '../constants';
import { Menu } from 'lucide-react';
import { useNotifications, useMarkNotificationRead } from '../lib/api/hooks/useNotifications';
import { socket } from '../lib/realtime/socket';

export const Topbar = () => {
  const { isDarkMode, toggleDarkMode, role, user, logout, isSidebarCollapsed, setSidebarCollapsed } = useApp();
  const { data: notifications = [], refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const unread = notifications.filter((n: any) => !n.readAt).length;
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.emit('identify', user.id);
    const handler = () => {
      refetch();
    };
    socket.on('notification', handler);
    return () => {
      socket.off('notification', handler);
    };
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        className="mr-3 inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
      >
        <Menu size={20} />
      </button>
      {/* Search Bar */}
      <div className="relative hidden w-96 md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search for jobs, orders, or items..."
          className="h-10 w-full rounded-xl border-none bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 dark:bg-slate-800"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={toggleDarkMode}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>
          <div
            className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${notifOpen ? 'block' : 'hidden'}`}
          >
            <div className="px-3 py-2 border-b border-slate-50 dark:border-slate-800 mb-1 flex items-center justify-between">
              <p className="text-sm font-bold">Notifications</p>
              <span className="text-xs text-slate-400">{unread} unread</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-xs text-slate-400">No notifications</div>
              ) : (
                notifications.map((n: any) => (
                  <button
                    key={n.id}
                    onClick={() => markRead.mutate(n.id)}
                    className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.message}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center space-x-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-500">{ROLES_CONFIG[role].label}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          
          <div
            className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${profileOpen ? 'block' : 'hidden'}`}
          >
            <div className="px-3 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <a
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <UserIcon size={16} />
              <span>My Profile</span>
            </a>
            <a
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </a>
            <div className="my-1 h-px bg-slate-50 dark:bg-slate-800"></div>
            <button 
              onClick={logout}
              className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
