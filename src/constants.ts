import { UserRole, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', icon: 'LayoutDashboard', path: '/', roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR', 'STORE_MANAGER', 'BUYER', 'SALES', 'TENDER', 'ORDER_RECEPTION', 'DESIGNER', 'PRODUCTION_TEAM'] },
  { title: 'Inventory', icon: 'Package', path: '/inventory', roles: ['OWNER', 'MANAGER', 'STORE_MANAGER', 'BUYER'] },
  { title: 'Production', icon: 'Factory', path: '/production', roles: ['OWNER', 'MANAGER', 'PRODUCTION_TEAM'] },
  { title: 'Sales', icon: 'ShoppingCart', path: '/sales', roles: ['OWNER', 'SALES'] },
  { title: 'Orders', icon: 'ClipboardList', path: '/orders', roles: ['OWNER', 'MANAGER', 'ORDER_RECEPTION', 'SALES'] },
  { title: 'Designer Orders', icon: 'ClipboardList', path: '/designer-orders', roles: ['DESIGNER'] },
  { title: 'Procurement', icon: 'Truck', path: '/procurement', roles: ['OWNER', 'BUYER'] },
  { title: 'Requests', icon: 'Package', path: '/requests', roles: ['PRODUCTION_TEAM', 'STORE_MANAGER', 'BUYER', 'OWNER', 'MANAGER'] },
  { title: 'Tenders', icon: 'FileText', path: '/tenders', roles: ['OWNER', 'TENDER'] },
  { title: 'HR & Employees', icon: 'Users', path: '/hr', roles: ['OWNER', 'HR'] },
  { title: 'Attendance', icon: 'Clock', path: '/attendance', roles: ['OWNER', 'HR', 'MANAGER', 'STORE_MANAGER', 'BUYER', 'SALES', 'TENDER', 'ORDER_RECEPTION', 'DESIGNER', 'PRODUCTION_TEAM'] },
  { title: 'Settings', icon: 'Settings', path: '/settings', roles: ['OWNER'] },
  { title: 'Admin', icon: 'Settings', path: '/admin', roles: ['SUPER_ADMIN'] },
];

export const ROLES_CONFIG: Record<UserRole, { label: string; description: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', description: 'System-level access and configuration.' },
  OWNER: { label: 'Owner', description: 'Full system access and high-level analytics.' },
  MANAGER: { label: 'Manager', description: 'Operational oversight and production tracking.' },
  HR: { label: 'HR Manager', description: 'Employee management and attendance.' },
  STORE_MANAGER: { label: 'Store Manager', description: 'Inventory control and stock management.' },
  BUYER: { label: 'Procurement', description: 'Supplier relations and purchasing.' },
  SALES: { label: 'Sales Executive', description: 'Customer orders and POS interface.' },
  TENDER: { label: 'Tender Team', description: 'Contract management and bidding.' },
  ORDER_RECEPTION: { label: 'Order Desk', description: 'Initial order intake and processing.' },
  DESIGNER: { label: 'Designer', description: 'Design preparation and file readiness.' },
  PRODUCTION_TEAM: { label: 'Production', description: 'Task-focused workflow for shop floor.' },
};
