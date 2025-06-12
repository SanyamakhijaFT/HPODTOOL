import React, { useState } from 'react';
import AuditQueue from '../components/audit/AuditQueue';
import AuditDetails from '../components/audit/AuditDetails';
import { mockPODs } from '../data/mockData';
import { PODAudit } from '../types';

const AuditWorkflow: React.FC = () => {
  const [selectedPOD, setSelectedPOD] = useState<string | null>(null);
  const [pods, setPods] = useState<PODAudit[]>(mockPODs);

  const selectedPODData = pods.find(pod => pod.id === selectedPOD);

  const handleUpdatePOD = (podId: string, updates: Partial<PODAudit>) => {
    setPods(prevPods =>
      prevPods.map(pod =>
        pod.id === podId ? { ...pod, ...updates } : pod
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">POD Audit Workflow</h1>
        <p className="text-gray-600">Review and audit POD documents for quality assurance</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Queue */}
        <div className="lg:col-span-1">
          <AuditQueue
            pods={pods}
            selectedPOD={selectedPOD}
            onSelectPOD={setSelectedPOD}
          />
        </div>

        {/* Audit Details */}
        <div className="lg:col-span-1">
          {selectedPODData ? (
            <AuditDetails
              pod={selectedPODData}
              onUpdatePOD={handleUpdatePOD}
            />
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center text-gray-500">
                <div className="text-sm">Select a POD from the queue to start auditing</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditWorkflow;