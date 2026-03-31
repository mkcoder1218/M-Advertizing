import { UserRole, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', icon: 'LayoutDashboard', path: '/', roles: ['OWNER', 'MANAGER', 'HR', 'STORE_MANAGER', 'BUYER', 'SALES', 'TENDER', 'ORDER_RECEPTION', 'PRODUCTION_TEAM'] },
  { title: 'Inventory', icon: 'Package', path: '/inventory', roles: ['OWNER', 'MANAGER', 'STORE_MANAGER', 'BUYER'] },
  { title: 'Production', icon: 'Factory', path: '/production', roles: ['OWNER', 'MANAGER', 'PRODUCTION_TEAM'] },
  { title: 'Sales', icon: 'ShoppingCart', path: '/sales', roles: ['OWNER', 'SALES'] },
  { title: 'Orders', icon: 'ClipboardList', path: '/orders', roles: ['OWNER', 'MANAGER', 'ORDER_RECEPTION', 'SALES'] },
  { title: 'Procurement', icon: 'Truck', path: '/procurement', roles: ['OWNER', 'BUYER'] },
  { title: 'Tenders', icon: 'FileText', path: '/tenders', roles: ['OWNER', 'TENDER'] },
  { title: 'HR & Employees', icon: 'Users', path: '/hr', roles: ['OWNER', 'HR'] },
  { title: 'Analytics', icon: 'BarChart3', path: '/analytics', roles: ['OWNER', 'MANAGER'] },
  { title: 'Settings', icon: 'Settings', path: '/settings', roles: ['OWNER'] },
];

export const ROLES_CONFIG: Record<UserRole, { label: string; description: string }> = {
  OWNER: { label: 'Owner', description: 'Full system access and high-level analytics.' },
  MANAGER: { label: 'Manager', description: 'Operational oversight and production tracking.' },
  HR: { label: 'HR Manager', description: 'Employee management and attendance.' },
  STORE_MANAGER: { label: 'Store Manager', description: 'Inventory control and stock management.' },
  BUYER: { label: 'Procurement', description: 'Supplier relations and purchasing.' },
  SALES: { label: 'Sales Executive', description: 'Customer orders and POS interface.' },
  TENDER: { label: 'Tender Team', description: 'Contract management and bidding.' },
  ORDER_RECEPTION: { label: 'Order Desk', description: 'Initial order intake and processing.' },
  PRODUCTION_TEAM: { label: 'Production', description: 'Task-focused workflow for shop floor.' },
};
