import React from 'react';
import { 
  AlertTriangle, 
  Package, 
  CheckCircle, 
  Calendar, 
  User, 
  Truck 
} from 'lucide-react';
import { PODAudit } from '../../types';

interface AuditQueueProps {
  pods: PODAudit[];
  selectedPOD: string | null;
  onSelectPOD: (podId: string) => void;
}

const statusConfig = {
  pending_audit: {
    label: 'Pending Audit',
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  under_review: {
    label: 'Under Review',
    icon: Package,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  audit_complete: {
    label: 'Audit Complete',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
};

const priorityConfig = {
  high: { color: 'border-l-red-500', badge: 'bg-red-100 text-red-800' },
  medium: { color: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  low: { color: 'border-l-green-500', badge: 'bg-green-100 text-green-800' },
};

const AuditQueue: React.FC<AuditQueueProps> = ({
  pods,
  selectedPOD,
  onSelectPOD,
}) => {
  if (pods.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No PODs in queue</h3>
        <p className="mt-1 text-sm text-gray-500">
          All PODs have been audited.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Audit Queue ({pods.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {pods.map((pod) => {
          const isSelected = selectedPOD === pod.id;
          const statusInfo = statusConfig[pod.status];
          const priorityInfo = priorityConfig[pod.priority];
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={pod.id}
              onClick={() => onSelectPOD(pod.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${priorityInfo.color} ${
                isSelected 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{pod.id}</h4>
                    <span className="text-xs text-gray-600">Trip: {pod.tripId}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityInfo.badge}`}>
                      {pod.priority.charAt(0).toUpperCase() + pod.priority.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      {pod.vehicleNo}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      FO: {pod.foName}
                    </div>
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      {pod.courierPartner} • {pod.awbNumber}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Received: {new Date(pod.receivedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Runner: {pod.runner}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </span>
                  
                  <div className="text-xs text-gray-500">
                    {pod.documents.length} doc{pod.documents.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Audit Result if completed */}
              {pod.status === 'audit_complete' && pod.auditResult && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    pod.auditResult.status === 'clean' 
                      ? 'bg-green-100 text-green-800'
                      : pod.auditResult.status === 'unclean'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pod.auditResult.status === 'clean' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {pod.auditResult.status === 'unclean' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {pod.auditResult.status === 'partial' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {pod.auditResult.status.charAt(0).toUpperCase() + pod.auditResult.status.slice(1)}
                    {pod.auditResult.deductionAmount && ` • ₹${pod.auditResult.deductionAmount}`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditQueue;