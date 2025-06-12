import React, { useState } from 'react';
import { 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  FileText,
  Calendar,
  Truck,
  User
} from 'lucide-react';
import { PODAudit } from '../../types';

interface AuditDetailsProps {
  pod: PODAudit;
  onUpdatePOD: (podId: string, updates: Partial<PODAudit>) => void;
}

const AuditDetails: React.FC<AuditDetailsProps> = ({ pod, onUpdatePOD }) => {
  const [auditStatus, setAuditStatus] = useState(pod.auditResult?.status || '');
  const [deductionAmount, setDeductionAmount] = useState(pod.auditResult?.deductionAmount || 0);
  const [auditNotes, setAuditNotes] = useState(pod.auditResult?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleViewDocument = (docName: string) => {
    // In a real app, this would open the document viewer
    alert(`Opening document: ${docName}`);
  };

  const handleDownloadDocument = (docName: string) => {
    // In a real app, this would download the document
    alert(`Downloading document: ${docName}`);
  };

  const handleSubmitAudit = async () => {
    if (!auditStatus) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const auditResult = {
      status: auditStatus as 'clean' | 'unclean' | 'partial',
      deductionAmount: auditStatus === 'unclean' ? deductionAmount : undefined,
      notes: auditNotes,
    };

    onUpdatePOD(pod.id, {
      status: 'audit_complete',
      auditResult,
    });

    setLoading(false);
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const auditResult = {
      status: auditStatus as 'clean' | 'unclean' | 'partial',
      deductionAmount: auditStatus === 'unclean' ? deductionAmount : undefined,
      notes: auditNotes,
    };

    onUpdatePOD(pod.id, {
      status: 'under_review',
      auditResult,
    });

    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Audit Details - {pod.id}
      </h3>

      {/* POD Information */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">POD Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600 w-24">Trip ID:</span>
            <span className="font-medium">{pod.tripId}</span>
          </div>
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600 w-20">Vehicle:</span>
            <span className="font-medium">{pod.vehicleNo}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600 w-24">FO Name:</span>
            <span className="font-medium">{pod.foName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600 w-20">Received:</span>
            <span className="font-medium">{new Date(pod.receivedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Documents</h4>
        <div className="space-y-2">
          {pod.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDocument(doc.name)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="View Document"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownloadDocument(doc.name)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Download Document"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Result Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Audit Result</h4>
        
        <div className="space-y-4">
          {/* Audit Status Radio Buttons */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="auditStatus"
                value="clean"
                checked={auditStatus === 'clean'}
                onChange={(e) => setAuditStatus(e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <div className="ml-3 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Clean - No Issues</span>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="auditStatus"
                value="unclean"
                checked={auditStatus === 'unclean'}
                onChange={(e) => setAuditStatus(e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <div className="ml-3 flex items-center">
                <XCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">Unclean - Issues Found</span>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="auditStatus"
                value="partial"
                checked={auditStatus === 'partial'}
                onChange={(e) => setAuditStatus(e.target.value)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
              />
              <div className="ml-3 flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Partial - Minor Issues</span>
              </div>
            </label>
          </div>

          {/* Deduction Amount */}
          {auditStatus === 'unclean' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deduction Amount (₹)
              </label>
              <input
                type="number"
                value={deductionAmount}
                onChange={(e) => setDeductionAmount(Number(e.target.value))}
                placeholder="Enter deduction amount"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
          )}

          {/* Audit Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audit Notes
            </label>
            <textarea
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              placeholder="Enter audit notes and observations..."
              rows={4}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSubmitAudit}
          disabled={!auditStatus || loading}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Submitting...' : 'Submit Audit'}
        </button>
        
        <button
          onClick={handleSaveDraft}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            'Save Draft'
          )}
        </button>
      </div>

      {/* Show existing audit result if completed */}
      {pod.status === 'audit_complete' && pod.auditResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Audit Completed</h5>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            pod.auditResult.status === 'clean' 
              ? 'bg-green-100 text-green-800'
              : pod.auditResult.status === 'unclean'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {pod.auditResult.status === 'clean' && <CheckCircle className="h-4 w-4 mr-1" />}
            {pod.auditResult.status === 'unclean' && <XCircle className="h-4 w-4 mr-1" />}
            {pod.auditResult.status === 'partial' && <AlertTriangle className="h-4 w-4 mr-1" />}
            {pod.auditResult.status.charAt(0).toUpperCase() + pod.auditResult.status.slice(1)}
            {pod.auditResult.deductionAmount && ` • Deduction: ₹${pod.auditResult.deductionAmount}`}
          </div>
          {pod.auditResult.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Notes:</strong> {pod.auditResult.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditDetails;