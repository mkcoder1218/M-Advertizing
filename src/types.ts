export type UserRole = 
  | 'SUPER_ADMIN'
  | 'OWNER' 
  | 'MANAGER' 
  | 'HR' 
  | 'STORE_MANAGER' 
  | 'BUYER' 
  | 'SALES' 
  | 'TENDER' 
  | 'ORDER_RECEPTION' 
  | 'DESIGNER'
  | 'PRODUCTION_TEAM';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  workTypeId?: string | null;
}

export interface NavItem {
  title: string;
  icon: string;
  path: string;
  roles: UserRole[];
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  status: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
}

export interface ProductionJob {
  id: string;
  productName: string;
  quantity: number;
  deadline: string;
  assignedTeam: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  role: UserRole;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customer: string;
  customerContact?: string;
  date: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  approvalStatus:
    | 'AWAITING_RECEPTION'
    | 'SENT_TO_DESIGNER'
    | 'SENT_TO_WORKER'
    | 'WORKER_ACCEPTED'
    | 'WORK_IN_PROGRESS'
    | 'WORK_COMPLETED'
    | 'WORKER_REJECTED';
  assignedWorkerId?: string;
  assignedDesignerId?: string;
  acceptedById?: string;
  needsDesign?: boolean;
  fileAvailable?: boolean;
  orderFileUrl?: string;
  designFileUrl?: string;
  assignedWorker?: string;
  items: number;
  orderItems?: {
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    workTypeId?: string;
    workTypeName?: string;
  }[];
  messages: Message[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  attendance: number;
}

export interface Tender {
  id: string;
  title: string;
  client: string;
  value: number;
  deadline: string;
  status: 'OPEN' | 'SUBMITTED' | 'WON' | 'LOST';
  approvalStatus: 'DRAFT' | 'PENDING_MANAGEMENT' | 'APPROVED' | 'REJECTED' | 'ASSIGNED_TO_WORKER' | 'WORKER_ACCEPTED';
  assignedWorker?: string;
  assignedBy?: string;
}
