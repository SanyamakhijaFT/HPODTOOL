import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  Truck,
  User,
  Clock,
  Camera,
  Upload,
  X,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  Edit3,
  Save,
  RefreshCw,
  MessageSquare,
  Plus,
  Send,
} from 'lucide-react';
import { Trip, FOResponse } from '../../types';

interface PODCollectionProps {
  trip: Trip;
  onUpdateTrip: (tripId: string, updates: Partial<Trip>) => void;
}

const statusSteps = [
  { key: 'assigned', label: 'Assigned', icon: User },
  { key: 'in_progress', label: 'Picked Up', icon: Clock },
  { key: 'pod_collected', label: 'POD Collected', icon: CheckCircle },
  { key: 'couriered', label: 'Couriered', icon: Truck },
];

const courierOptions = [
  'Blue Dart',
  'DTDC',
  'DHL',
  'FedEx',
  'Delhivery',
  'Hand Delivered',
  'Other',
];

const headquartersOptions = [
  'Delhi',
  'Bengaluru',
  'Mumbai',
  'Chennai',
];

const issueTypes = [
  'FO Unavailable',
  'Address Not Found',
  'Already Couriered',
  'POD Not Ready',
  'Vehicle Issue',
  'Traffic/Route Issue',
  'Customer Not Available',
  'Document Missing',
  'VEHICLE LEFT',
  'LOCATION IS OUT REACH',
  'UNLOADING ISSUE',
  'CANCEL',
  'RUNNER ISSUE',
  'Other Issue',
];

const remarkTypes = [
  'COLLECTED FROM DRIVER',
  'COLLECTED FROM SUPPLIER',
  '(empty)',
  'ON-SITE',
  'CRM ENTRY LATE',
  'COLLECTED FROM PUNE OFFICE',
  'LATE NIGHT UNLOADED',
  'INTRANSIT',
  'WAITING FOR UNLOADING',
  'COLLECTED FROM CHN OFFICE',
  'FO COURIERED',
  'Other',
];

const collectedFromOptions = [
  'SUPPLIER',
  'DRIVER',
];

const PODCollection: React.FC<PODCollectionProps> = ({ trip, onUpdateTrip }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(trip.podImages || []);
  const [courierPartner, setCourierPartner] = useState(trip.courierPartner || '');
  const [awbNumber, setAwbNumber] = useState(trip.awbNumber || '');
  const [courierDate, setCourierDate] = useState(trip.courierDate || '');
  const [courierComments, setCourierComments] = useState(trip.courierComments || '');
  const [headquarters, setHeadquarters] = useState('');
  const [collectedFrom, setCollectedFrom] = useState(trip.collectedFrom || '');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showUpdateIssueForm, setShowUpdateIssueForm] = useState(false);
  const [showAddRemarkForm, setShowAddRemarkForm] = useState(false);
  const [showFOCourierForm, setShowFOCourierForm] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [remarkType, setRemarkType] = useState('');
  const [remarkText, setRemarkText] = useState('');
  
  // FO Courier form states
  const [foCourierService, setFOCourierService] = useState('');
  const [foDocketNumber, setFODocketNumber] = useState('');
  const [foName, setFOName] = useState(trip.foName);
  const [foPhone, setFOPhone] = useState(trip.foPhone);
  const [foCourierComments, setFOCourierComments] = useState('');
  
  const [loading, setLoading] = useState(false);

  const currentStepIndex = statusSteps.findIndex(step => step.key === trip.status);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Validate file types - only images allowed
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Only image files are allowed for proof of receipt');
      return;
    }

    setUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newFiles = validFiles.map(file => file.name);
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    
    // Update the trip with new images
    onUpdateTrip(trip.id, { podImages: updatedFiles });
    setUploading(false);
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter(file => file !== fileName);
    setUploadedFiles(updatedFiles);
    onUpdateTrip(trip.id, { podImages: updatedFiles });
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updates: Partial<Trip> = { status: newStatus as Trip['status'] };
    
    if (newStatus === 'couriered') {
      updates.courierPartner = courierPartner;
      updates.awbNumber = awbNumber;
      updates.courierDate = courierDate || new Date().toISOString().split('T')[0];
      updates.courierComments = courierComments;
    }

    if (newStatus === 'pod_collected' && collectedFrom) {
      updates.collectedFrom = collectedFrom;
    }
    
    // Ensure POD images are included in the update
    if (uploadedFiles.length > 0) {
      updates.podImages = uploadedFiles;
    }
    
    onUpdateTrip(trip.id, updates);
    setLoading(false);
  };

  const handleAddRemark = async () => {
    const finalRemarkText = remarkType === 'Other' ? remarkText : remarkType;
    if (!finalRemarkText.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRemark = {
      type: remarkType,
      text: finalRemarkText,
      images: [], // No images for remarks in runner view
      addedAt: new Date().toISOString(),
    };

    const updatedRemarks = [...(trip.runnerRemarks || []), newRemark];
    
    onUpdateTrip(trip.id, {
      runnerRemarks: updatedRemarks
    });
    
    setShowAddRemarkForm(false);
    setRemarkType('');
    setRemarkText('');
    setLoading(false);
  };

  const handleSubmitFOCourier = async () => {
    if (!foCourierService || !foDocketNumber) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create FO Response entry
    const foResponse: Partial<FOResponse> = {
      id: `FOR_${Date.now()}`,
      tripId: trip.id,
      foName: foName,
      foPhone: foPhone,
      courierService: foCourierService,
      docketNumber: foDocketNumber,
      remarks: foCourierComments,
      submittedAt: new Date().toISOString(),
      status: 'pending_verification',
      submittedBy: 'runner', // Special flag to indicate this was submitted by runner
    };

    // Add FO COURIERED remark
    const newRemark = {
      type: 'FO COURIERED',
      text: `FO has couriered via ${foCourierService} - Docket: ${foDocketNumber}`,
      images: [],
      addedAt: new Date().toISOString(),
    };

    const updatedRemarks = [...(trip.runnerRemarks || []), newRemark];
    
    onUpdateTrip(trip.id, {
      runnerRemarks: updatedRemarks,
      foResponse: foResponse // This will be sent to CT team
    });

    // Reset form
    setShowFOCourierForm(false);
    setFOCourierService('');
    setFODocketNumber('');
    setFOCourierComments('');
    setLoading(false);

    alert('FO courier information has been sent to the Control Tower team for verification.');
  };

  const handleReportIssue = async () => {
    const finalIssueDescription = issueType === 'Other Issue' ? issueDescription : issueType;
    if (!issueType) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdateTrip(trip.id, {
      issueReported: {
        type: issueType,
        description: finalIssueDescription,
        reportedAt: new Date().toISOString(),
        updates: trip.issueReported?.updates || [],
      }
    });
    
    setShowIssueForm(false);
    setIssueType('');
    setIssueDescription('');
    setLoading(false);
  };

  const handleUpdateIssue = async () => {
    if (!issueType && !issueDescription) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentIssue = trip.issueReported;
    if (currentIssue) {
      const newUpdate = {
        updatedAt: new Date().toISOString(),
        type: issueType || currentIssue.type,
        description: issueDescription || currentIssue.description,
      };

      onUpdateTrip(trip.id, {
        issueReported: {
          ...currentIssue,
          type: issueType || currentIssue.type,
          description: issueDescription || currentIssue.description,
          updates: [...(currentIssue.updates || []), newUpdate],
        }
      });
    }
    
    setShowUpdateIssueForm(false);
    setIssueType('');
    setIssueDescription('');
    setLoading(false);
  };

  const handleResolveIssue = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mark issue as resolved and allow runner to continue
    const currentIssue = trip.issueReported;
    if (currentIssue) {
      const resolveUpdate = {
        updatedAt: new Date().toISOString(),
        type: 'Issue Resolved',
        description: 'Issue has been resolved. Resuming normal workflow.',
      };

      onUpdateTrip(trip.id, {
        issueReported: {
          ...currentIssue,
          resolved: true,
          resolvedAt: new Date().toISOString(),
          updates: [...(currentIssue.updates || []), resolveUpdate],
        }
      });
    }
    
    setLoading(false);
  };

  const canMarkCollected = trip.status === 'in_progress' && uploadedFiles.length > 0;
  const canMarkCouriered = trip.status === 'pod_collected' && courierPartner && awbNumber && collectedFrom && headquarters;

  if (trip.status === 'couriered') {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
          <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-900">Task Completed</h3>
          <p className="mt-1 text-sm text-gray-600">
            POD has been successfully collected and couriered.
          </p>
          {trip.courierPartner && (
            <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-green-800">Courier Details:</div>
                <div className="text-green-700">
                  {trip.courierPartner} • {trip.awbNumber}
                  {trip.courierDate && (
                    <div className="text-xs">Date: {new Date(trip.courierDate).toLocaleDateString()}</div>
                  )}
                  {trip.collectedFrom && (
                    <div className="text-xs">Collected from: {trip.collectedFrom}</div>
                  )}
                  {trip.courierComments && (
                    <div className="text-xs mt-1">Comments: {trip.courierComments}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (trip.issueReported && !trip.issueReported.resolved) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
          <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-900">Issue Reported</h3>
          
          {/* Current Issue Details */}
          <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg text-left">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-800">Current Issue:</div>
                <div className="text-red-700 font-semibold">{trip.issueReported.type}</div>
                {trip.issueReported.description && (
                  <>
                    <div className="font-medium text-red-800 mt-2">Description:</div>
                    <div className="text-red-700">{trip.issueReported.description}</div>
                  </>
                )}
                <div className="text-xs text-red-600 mt-2">
                  Reported: {new Date(trip.issueReported.reportedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Issue Updates History */}
          {trip.issueReported.updates && trip.issueReported.updates.length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg text-left">
              <div className="text-sm font-medium text-yellow-800 mb-2">Issue Updates:</div>
              <div className="space-y-2">
                {trip.issueReported.updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-yellow-300 pl-3">
                    <div className="text-xs text-yellow-600">
                      {new Date(update.updatedAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-yellow-800 font-medium">{update.type}</div>
                    {update.description && (
                      <div className="text-sm text-yellow-700">{update.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Update Issue */}
            {!showUpdateIssueForm ? (
              <button
                onClick={() => setShowUpdateIssueForm(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Update Issue
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Update Issue Type (Optional)
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                  >
                    <option value="">Keep current type</option>
                    {issueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {issueType === 'Other Issue' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Update Description
                    </label>
                    <textarea
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Add update about the issue..."
                      rows={3}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateIssue}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Updating...' : 'Update Issue'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateIssueForm(false);
                      setIssueType('');
                      setIssueDescription('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Resolve Issue */}
            <button
              onClick={handleResolveIssue}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Resolving...' : 'Mark Issue as Resolved & Resume'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
        POD Collection - {trip.id}
      </h3>

      {/* Status Progress Timeline */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between relative">
          {statusSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className={`mt-2 text-xs font-medium text-center ${
                  isCompleted 
                    ? 'text-green-600'
                    : isActive
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute top-4 sm:top-5 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(50%)', zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Runner Remarks Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Runner Remarks</h4>
          <button
            onClick={() => setShowAddRemarkForm(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Remark
          </button>
        </div>

        {/* Existing Remarks */}
        {trip.runnerRemarks && trip.runnerRemarks.length > 0 ? (
          <div className="space-y-3">
            {trip.runnerRemarks.map((remark, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-800 mb-2">
                  <span className="font-medium">{remark.type}:</span> {remark.text}
                </div>
                <div className="text-xs text-purple-600">
                  Added: {new Date(remark.addedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No remarks added yet</div>
        )}

        {/* Add Remark Form */}
        {showAddRemarkForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Add New Remark</h5>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Remark Type
                </label>
                <select
                  value={remarkType}
                  onChange={(e) => {
                    setRemarkType(e.target.value);
                    if (e.target.value === 'FO COURIERED') {
                      setShowFOCourierForm(true);
                    }
                  }}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="">Select remark type</option>
                  {remarkTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {remarkType === 'Other' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Custom Remark
                  </label>
                  <textarea
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="Enter your custom remark..."
                    rows={3}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>
              )}

              {remarkType !== 'FO COURIERED' && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddRemark}
                    disabled={!remarkType || (remarkType === 'Other' && !remarkText.trim()) || loading}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Adding...' : 'Add Remark'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddRemarkForm(false);
                      setRemarkType('');
                      setRemarkText('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FO Courier Form */}
        {showFOCourierForm && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="text-sm font-medium text-blue-900 mb-3">FO Courier Details</h5>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    FO Name *
                  </label>
                  <input
                    type="text"
                    value={foName}
                    onChange={(e) => setFOName(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    FO Phone *
                  </label>
                  <input
                    type="text"
                    value={foPhone}
                    onChange={(e) => setFOPhone(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Courier Service *
                </label>
                <select
                  value={foCourierService}
                  onChange={(e) => setFOCourierService(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select courier service</option>
                  {courierOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Docket Number *
                </label>
                <input
                  type="text"
                  value={foDocketNumber}
                  onChange={(e) => setFODocketNumber(e.target.value)}
                  placeholder="Enter docket/AWB number"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Comments (Optional)
                </label>
                <textarea
                  value={foCourierComments}
                  onChange={(e) => setFOCourierComments(e.target.value)}
                  placeholder="Any additional comments..."
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitFOCourier}
                  disabled={!foCourierService || !foDocketNumber || loading}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Submitting...' : 'Submit to CT Team'}
                </button>
                <button
                  onClick={() => {
                    setShowFOCourierForm(false);
                    setShowAddRemarkForm(false);
                    setRemarkType('');
                    setFOCourierService('');
                    setFODocketNumber('');
                    setFOCourierComments('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Action Button */}
      <div className="mb-4 sm:mb-6">
        {trip.status === 'assigned' && (
          <button
            onClick={() => handleStatusChange('in_progress')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Picking Up...' : 'Pick Up Trip'}
          </button>
        )}

        {trip.status === 'in_progress' && (
          <button
            onClick={() => handleStatusChange('pod_collected')}
            disabled={!canMarkCollected || loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Marking...' : 'Mark POD Collected'}
          </button>
        )}

        {trip.status === 'pod_collected' && (
          <button
            onClick={() => handleStatusChange('couriered')}
            disabled={!canMarkCouriered || loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Truck className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Marking...' : 'Mark as Couriered'}
          </button>
        )}
      </div>

      {/* Proof of Receipt Upload Section - Only show when trip is picked up */}
      {trip.status === 'in_progress' && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Upload Proof of Receipt</h4>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Upload photos
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
                <span className="text-sm text-gray-500"> or </span>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  <Camera className="inline h-4 w-4 mr-1" />
                  Take Photo
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only image files (PNG, JPG) up to 10MB
              </p>
            </div>
          </div>

          {uploading && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Uploading photos...
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-medium text-gray-700">Uploaded Photos:</h5>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center min-w-0 flex-1">
                    <ImageIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{file}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadedFiles.length === 0 && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Photos Required:</strong> You must upload proof of receipt photos before marking POD as collected.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show uploaded photos for other statuses */}
      {(['pod_collected', 'couriered'].includes(trip.status)) && uploadedFiles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Proof of Receipt Photos</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-green-50 rounded border border-green-200">
                <ImageIcon className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-green-800 truncate">{file}</span>
                <CheckCircle className="h-4 w-4 text-green-600 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courier Details Section */}
      {(['pod_collected', 'couriered'].includes(trip.status)) && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Enter Courier Details</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Courier Partner *
              </label>
              <select
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select courier partner</option>
                {courierOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                AWB/Docket Number *
              </label>
              <input
                type="text"
                value={awbNumber}
                onChange={(e) => setAwbNumber(e.target.value)}
                placeholder="Enter AWB or docket number"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Headquarters *
              </label>
              <select
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select headquarters</option>
                {headquartersOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Collected From *
              </label>
              <select
                value={collectedFrom}
                onChange={(e) => setCollectedFrom(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select who you collected from</option>
                {collectedFromOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Courier Date (Optional)
              </label>
              <input
                type="date"
                value={courierDate}
                onChange={(e) => setCourierDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                value={courierComments}
                onChange={(e) => setCourierComments(e.target.value)}
                placeholder="Add any comments about the courier..."
                rows={3}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {trip.status === 'pod_collected' && (!courierPartner || !awbNumber || !collectedFrom || !headquarters) && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Required:</strong> Fill courier partner, AWB number, headquarters, and collected from field to mark as couriered.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Issue Reporting - Available at any point */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        {!showIssueForm ? (
          <button
            onClick={() => setShowIssueForm(true)}
            className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Issue
          </button>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Report Issue</h4>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              >
                <option value="">Select issue type</option>
                {issueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {issueType === 'Other Issue' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleReportIssue}
                disabled={!issueType || (issueType === 'Other Issue' && !issueDescription.trim()) || loading}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={() => {
                  setShowIssueForm(false);
                  setIssueType('');
                  setIssueDescription('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PODCollection;