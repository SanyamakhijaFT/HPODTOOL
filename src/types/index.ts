export interface User {
  id: string;
  email: string;
  name: string;
  role: 'control_tower' | 'runner';
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
  secondaryRunner?: string;
  secondaryRunnerId?: string;
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
  collectedFrom?: string; // New field for who POD was collected from
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
  
  // New fields for filtering
  slotStatus: 'recovered' | 'onsite' | 'recovered_25_plus' | 'onsite_epod_pending' | 'lost_ibond_submitted' | 'lost_ibond_not_required' | 'lost' | 'critical' | 'below_15_days_pending' | 'below_5_days_pending' | 'intransit' | 'cancelled';
  slotImage?: string; // Last image updated by CT team
  supplierImage?: string; // Image that comes with trip data
  runnerRemarks?: {
    type: string;
    text: string;
    images: string[]; // 2-3 images added by runner
    addedAt: string;
  }[];
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

export interface FilterState {
  origin: string;
  destination: string;
  vehicle: string;
  runner: string;
  secondaryRunner: string;
  priority: string;
  status: string;
  owner: string;
  hasIssues: boolean;
  aging: string;
  dNode: string;
  slotStatus: string;
  supplier: string;
  tripId: string;
  hasRunnerRemarks: boolean;
  runnerRemarksType: string; // New filter for specific remark types
}