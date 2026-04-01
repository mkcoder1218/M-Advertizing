import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Production } from './components/Production';
import { Sales } from './components/Sales';
import { Orders } from './components/Orders';
import { Procurement } from './components/Procurement';
import { Tenders } from './components/Tenders';
import { HR } from './components/HR';
import { ProductionTeamDashboard } from './components/ProductionTeamDashboard';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { BuyerInventory } from './components/BuyerInventory';
import { Attendance } from './components/Attendance';
import { Auth } from './components/Auth';
import { NAV_ITEMS } from './constants';

function AppContent() {
  const { role, isAuthenticated } = useApp();
  const [currentPath, setCurrentPath] = useState('/');

  // Simple routing logic for demo
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    // Initial path check
    setCurrentPath(window.location.pathname);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Mock navigation for demo (intercepting clicks)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const path = anchor.getAttribute('href') || '/';
        window.history.pushState({}, '', path);
        setCurrentPath(path);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderContent = () => {
    // Check if user has access to current path
    const navItem = NAV_ITEMS.find(item => item.path === currentPath);
    if (navItem && !navItem.roles.includes(role)) {
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-slate-500">You don't have permission to view this page with your current role.</p>
        </div>
      );
    }

    switch (currentPath) {
      case '/': return role === 'PRODUCTION_TEAM' ? <ProductionTeamDashboard /> : <Dashboard />;
      case '/inventory': return <Inventory />;
      case '/production': return <Production />;
      case '/sales': return <Sales />;
      case '/orders': return <Orders />;
      case '/procurement': return <Procurement />;
      case '/buyer': return <BuyerInventory />;
      case '/attendance': return <Attendance />;
      case '/tenders': return <Tenders />;
      case '/hr': return <HR />;
      case '/analytics': return <Analytics />;
      case '/settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPath={currentPath}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
