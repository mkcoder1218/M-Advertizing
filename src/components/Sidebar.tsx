import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Factory, 
  ShoppingCart, 
  ClipboardList, 
  Truck, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../constants';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  Factory,
  ShoppingCart,
  ClipboardList,
  Truck,
  FileText,
  Users,
  BarChart3,
  Settings
};

export const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const { role, isSidebarCollapsed, setSidebarCollapsed, user } = useApp();

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 260 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900",
        "flex flex-col"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-6">
        {!isSidebarCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold tracking-tight text-blue-600"
          >
            ForgeFlow
          </motion.span>
        )}
        <button 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNav.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <a
              key={item.title}
              href={item.path}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-slate-50 dark:hover:bg-slate-800",
                currentPath === item.path ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-slate-600 dark:text-slate-400"
              )}
            >
              <Icon size={20} className={cn("shrink-0", currentPath === item.path ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3 truncate"
                >
                  {item.title}
                </motion.span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center" : "space-x-3")}>
          <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{role.replace('_', ' ')}</p>
            </div>
          )}
          {!isSidebarCollapsed && (
            <button className="text-slate-400 hover:text-red-500">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
