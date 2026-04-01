import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, User } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  user: User | null;
  authToken: string | null;
  refreshToken: string | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('OWNER');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = (user: User, token: string, refresh: string) => {
    setIsAuthenticated(true);
    setRole(user.role);
    setCurrentUser(user);
    setAuthToken(token);
    setRefreshToken(refresh);
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    setRefreshToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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
      user: currentUser,
      authToken,
      refreshToken,
      isDarkMode,
      toggleDarkMode,
      isAuthenticated,
      login,
      logout
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
