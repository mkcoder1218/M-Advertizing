import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, User } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  user: User;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('OWNER');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const user: User = {
    id: '1',
    name: 'Alexander Forge',
    email: 'alex@forgeflow.com',
    role: role,
    avatar: 'https://picsum.photos/seed/alex/100/100',
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider value={{ 
      role, 
      setRole, 
      isSidebarCollapsed, 
      setSidebarCollapsed, 
      user,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
