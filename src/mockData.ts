import { InventoryItem, ProductionJob, Order, Employee, Tender } from './types';

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Steel Sheet 2mm', sku: 'ST-2MM-001', category: 'Raw Materials', stock: 450, minStock: 100, unit: 'Sheets', price: 45.0, status: 'NORMAL' },
  { id: '2', name: 'Aluminum Rod 10mm', sku: 'AL-10MM-005', category: 'Raw Materials', stock: 120, minStock: 150, unit: 'Meters', price: 12.5, status: 'LOW' },
  { id: '3', name: 'M6 Industrial Bolts', sku: 'BLT-M6-HD', category: 'Fasteners', stock: 5000, minStock: 1000, unit: 'Units', price: 0.15, status: 'NORMAL' },
  { id: '4', name: 'Hydraulic Oil ISO 46', sku: 'OIL-ISO46', category: 'Consumables', stock: 5, minStock: 10, unit: 'Barrels', price: 280.0, status: 'LOW' },
  { id: '5', name: 'Welding Wire ER70S-6', sku: 'WLD-ER70S', category: 'Consumables', stock: 0, minStock: 20, unit: 'Spools', price: 35.0, status: 'OUT_OF_STOCK' },
];

export const MOCK_JOBS: ProductionJob[] = [
  { id: 'J-101', productName: 'Custom Gate Frame', quantity: 5, deadline: '2026-04-05', assignedTeam: 'Welding A', status: 'IN_PROGRESS', progress: 65 },
  { id: 'J-102', productName: 'Industrial Shelving Unit', quantity: 20, deadline: '2026-04-10', assignedTeam: 'Assembly B', status: 'PENDING', progress: 0 },
  { id: 'J-103', productName: 'Precision Brackets', quantity: 100, deadline: '2026-04-02', assignedTeam: 'CNC Team', status: 'IN_PROGRESS', progress: 90 },
  { id: 'J-104', productName: 'Conveyor Rollers', quantity: 50, deadline: '2026-04-15', assignedTeam: 'Machining', status: 'PENDING', progress: 0 },
  { id: 'J-105', productName: 'Ventilation Hoods', quantity: 2, deadline: '2026-03-31', assignedTeam: 'Sheet Metal', status: 'COMPLETED', progress: 100 },
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-5501', 
    customer: 'TechCorp Industries', 
    date: '2026-03-28', 
    total: 12500.0, 
    status: 'PROCESSING', 
    approvalStatus: 'SENT_TO_WORKER',
    assignedWorker: 'John Doe',
    items: 3,
    messages: [
      { id: 'm1', sender: 'Alexander Forge', text: 'Please review the specs for this custom frame.', timestamp: '10:30 AM', role: 'OWNER' },
      { id: 'm2', sender: 'John Doe', text: 'Looking at them now. Might need extra 2mm sheets.', timestamp: '10:45 AM', role: 'PRODUCTION_TEAM' }
    ]
  },
  { 
    id: 'ORD-5502', 
    customer: 'Global Logistics', 
    date: '2026-03-29', 
    total: 4200.5, 
    status: 'PENDING', 
    approvalStatus: 'AWAITING_RECEPTION',
    items: 12,
    messages: []
  },
  { 
    id: 'ORD-5503', 
    customer: 'BuildRight Construction', 
    date: '2026-03-25', 
    total: 8900.0, 
    status: 'SHIPPED', 
    approvalStatus: 'WORKER_ACCEPTED',
    assignedWorker: 'Mike Johnson',
    items: 5,
    messages: []
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'John Doe', role: 'Senior Welder', department: 'Production', status: 'ACTIVE', attendance: 98 },
  { id: 'EMP-002', name: 'Sarah Smith', role: 'Production Manager', department: 'Management', status: 'ACTIVE', attendance: 100 },
  { id: 'EMP-003', name: 'Mike Johnson', role: 'Inventory Clerk', department: 'Warehouse', status: 'ON_LEAVE', attendance: 85 },
];

export const MOCK_TENDERS: Tender[] = [
  { 
    id: 'T-2026-01', 
    title: 'Municipal Bridge Railings', 
    client: 'City Council', 
    value: 250000, 
    deadline: '2026-05-15', 
    status: 'OPEN',
    approvalStatus: 'PENDING_MANAGEMENT'
  },
  { 
    id: 'T-2026-02', 
    title: 'Airport Terminal Seating', 
    client: 'SkyPort Hub', 
    value: 120000, 
    deadline: '2026-04-20', 
    status: 'SUBMITTED',
    approvalStatus: 'APPROVED',
    assignedBy: 'Alexander Forge'
  },
];
