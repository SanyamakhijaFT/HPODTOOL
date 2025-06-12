export interface User {
  id: string;
  email: string;
  name: string;
  role: 'control_tower' | 'runner' | 'auditor';
  phone?: string;
  zone?: string;
  city?: string;
}

export interface Trip {
  id: string;
  vehicleNo: string;
  status: 'vehicle_unloaded' | 'assigned' | 'in_progress' | 'pod_collected' | 'couriered' | 'delivered' | 'fo_courier';
  foName: string;
  foPhone: string;
  psaName?: string;
  psaPhone?: string;
  origin: string;
  destination: string;
  route: string;
  unloadDate: string;
  loadingDate: string;
  dNode: string; // cluster location
  supplierAddress: string;
  supplyPocName: string;
  supplyPocPhone: string;
  demandPocName: string;
  demandPocPhone: string;
  driverName?: string;
  driverPhone?: string;
  runner?: string;
  runnerId?: string;
  priority: 'high' | 'medium' | 'low';
  aging: number;
  distance?: number;
  estimatedTime?: string;
  foLink?: string;
  courierPartner?: string;
  awbNumber?: string;
  courierDate?: string;
  deliveryDate?: string;
  podImages?: string[];
  issueReported?: {
    type: string;
    description?: string;
    reportedAt: string;
    resolved?: boolean;
    resolvedAt?: string;
    updates?: {
      updatedAt: string;
      type: string;
      description?: string;
    }[];
  };
  owner?: string;
  foOfficeAddress?: string;
  courierComments?: string;
}

export interface FOResponse {
  id: string;
  tripId: string;
  foName: string;
  foPhone: string;
  courierService: string;
  docketNumber: string;
  remarks?: string;
  submittedAt: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface PODAudit {
  id: string;
  tripId: string;
  vehicleNo: string;
  foName: string;
  courierPartner: string;
  awbNumber: string;
  receivedDate: string;
  status: 'pending_audit' | 'under_review' | 'audit_complete';
  priority: 'high' | 'medium' | 'low';
  runner: string;
  documents: {
    name: string;
    type: string;
    size: string;
  }[];
  auditResult?: {
    status: 'clean' | 'unclean' | 'partial';
    deductionAmount?: number;
    notes: string;
  };
}

export interface Stats {
  name: string;
  value: number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  description: string;
}

export interface RunnerProfile {
  name: string;
  phone: string;
  zone: string;
  city: string;
  todayStats: {
    assigned: number;
    completed: number;
    pending: number;
    kmToday: number;
  };
  performanceStats: {
    weeklyCompleted: number;
    monthlyCompleted: number;
    successRate: number;
  };
  gpsActive: boolean;
}