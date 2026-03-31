import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Layout = ({ children, currentPath }: { children: React.ReactNode; currentPath: string }) => {
  const { isSidebarCollapsed } = useApp();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar currentPath={currentPath} />
      
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: isSidebarCollapsed ? 80 : 260,
          width: `calc(100% - ${isSidebarCollapsed ? 80 : 260}px)` 
        }}
        className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
      >
        <Topbar />
        
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      </motion.main>
    </div>
  );
};
