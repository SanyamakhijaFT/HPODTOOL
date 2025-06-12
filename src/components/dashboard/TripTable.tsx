import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Phone,
  UserPlus,
  Send,
  Package,
  CheckCircle,
  Truck,
  User,
  Calendar,
  AlertTriangle,
  Copy,
  MessageSquare,
  Mail,
  ExternalLink,
  FileText,
  Clock,
  Edit3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Users,
  Building,
  Route,
} from 'lucide-react';
import { Trip } from '../../types';

interface TripTableProps {
  trips: Trip[];
  selectedTrips: string[];
  onSelectTrip: (tripId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateTrip: (tripId: string, updates: Partial<Trip>) => void;
}

const statusConfig = {
  vehicle_unloaded: {
    label: 'Vehicle Unloaded',
    icon: Truck,
    color: 'bg-orange-100 text-orange-800',
    nextStatus: 'assigned',
  },
  assigned: {
    label: 'Assigned',
    icon: User,
    color: 'bg-blue-100 text-blue-800',
    nextStatus: 'in_progress',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    color: 'bg-purple-100 text-purple-800',
    nextStatus: 'pod_collected',
  },
  pod_collected: {
    label: 'POD Collected',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    nextStatus: 'couriered',
  },
  couriered: {
    label: 'Couriered',
    icon: Package,
    color: 'bg-indigo-100 text-indigo-800',
    nextStatus: 'delivered',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'bg-emerald-100 text-emerald-800',
    nextStatus: null,
  },
  fo_courier: {
    label: 'FO Courier',
    icon: Send,
    color: 'bg-cyan-100 text-cyan-800',
    nextStatus: 'delivered',
  },
};

const priorityConfig = {
  high: { color: 'border-red-500', badge: 'bg-red-100 text-red-800' },
  medium: { color: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  low: { color: 'border-green-500', badge: 'bg-green-100 text-green-800' },
};

const courierOptions = [
  'Blue Dart',
  'DTDC',
  'DHL',
  'FedEx',
  'Delhivery',
  'Hand Delivered',
  'Other',
];

const ownerOptions = [
  'Ajay Kumar',
  'Vijay Singh',
];

const runnerOptions = [
  'Lokesh Kumar',
  'Arjun Singh',
  'Rahul Sharma',
];

const TripTable: React.FC<TripTableProps> = ({
  trips,
  selectedTrips,
  onSelectTrip,
  onSelectAll,
  onUpdateTrip,
}) => {
  const [expandedTrips, setExpandedTrips] = useState<Set<string>>(new Set());
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingOwner, setEditingOwner] = useState<string | null>(null);
  const [editingRunner, setEditingRunner] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressValue, setAddressValue] = useState<string>('');
  const [statusUpdates, setStatusUpdates] = useState<{[key: string]: any}>({});

  const toggleExpanded = (tripId: string) => {
    const newExpanded = new Set(expandedTrips);
    if (newExpanded.has(tripId)) {
      newExpanded.delete(tripId);
    } else {
      newExpanded.add(tripId);
    }
    setExpandedTrips(newExpanded);
  };

  const handleCallFO = (foPhone: string) => {
    window.open(`tel:${foPhone}`, '_self');
  };

  const handleSendFOLink = (foPhone: string, tripId: string) => {
    const message = `Hi, Please provide POD for Trip ${tripId}. Link: https://pod.freighttiger.com/fo/${tripId}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = foPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCopyLink = (tripId: string) => {
    const link = `https://pod.freighttiger.com/fo/${tripId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const startEditingStatus = (tripId: string, currentStatus: string) => {
    setEditingStatus(tripId);
    setStatusUpdates({
      ...statusUpdates,
      [tripId]: {
        status: currentStatus,
        runner: '',
        courierPartner: '',
        awbNumber: '',
        courierComments: '',
        podImages: [],
      }
    });
  };

  const startEditingOwner = (tripId: string) => {
    setEditingOwner(tripId);
  };

  const startEditingRunner = (tripId: string) => {
    setEditingRunner(tripId);
  };

  const startEditingAddress = (tripId: string, currentAddress: string) => {
    setEditingAddress(tripId);
    setAddressValue(currentAddress || '');
  };

  const cancelEditing = () => {
    setEditingStatus(null);
    setEditingOwner(null);
    setEditingRunner(null);
    setEditingAddress(null);
    setAddressValue('');
    setStatusUpdates({});
  };

  const handleStatusChange = (tripId: string, newStatus: string) => {
    setStatusUpdates({
      ...statusUpdates,
      [tripId]: {
        ...statusUpdates[tripId],
        status: newStatus,
      }
    });
  };

  const handleFieldChange = (tripId: string, field: string, value: any) => {
    setStatusUpdates({
      ...statusUpdates,
      [tripId]: {
        ...statusUpdates[tripId],
        [field]: value,
      }
    });
  };

  const handleFileUpload = (tripId: string, files: FileList) => {
    const fileNames = Array.from(files).map(file => file.name);
    setStatusUpdates({
      ...statusUpdates,
      [tripId]: {
        ...statusUpdates[tripId],
        podImages: [...(statusUpdates[tripId]?.podImages || []), ...fileNames],
      }
    });
  };

  const saveStatusUpdate = async (tripId: string) => {
    const updates = statusUpdates[tripId];
    if (!updates) return;

    // Validation
    if (updates.status === 'assigned' && !updates.runner) {
      alert('Please select a runner for assignment');
      return;
    }

    if (updates.status === 'pod_collected' && (!updates.podImages || updates.podImages.length === 0)) {
      alert('POD images are required for POD collected status');
      return;
    }

    if (updates.status === 'couriered' && (!updates.courierPartner || !updates.awbNumber)) {
      alert('Courier partner and AWB number are required for couriered status');
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the trip
    const updateData: Partial<Trip> = {
      status: updates.status as Trip['status'],
    };

    if (updates.runner) updateData.runner = updates.runner;
    if (updates.courierPartner) updateData.courierPartner = updates.courierPartner;
    if (updates.awbNumber) updateData.awbNumber = updates.awbNumber;
    if (updates.courierComments) updateData.courierComments = updates.courierComments;
    if (updates.podImages) updateData.podImages = updates.podImages;

    onUpdateTrip(tripId, updateData);
    setEditingStatus(null);
    setStatusUpdates({});
  };

  const saveOwnerUpdate = async (tripId: string, newOwner: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateTrip(tripId, { owner: newOwner });
    setEditingOwner(null);
  };

  const saveRunnerUpdate = async (tripId: string, newRunner: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const updates: Partial<Trip> = { 
      runner: newRunner,
      status: newRunner ? 'assigned' : 'vehicle_unloaded'
    };
    onUpdateTrip(tripId, updates);
    setEditingRunner(null);
  };

  const saveAddressUpdate = async (tripId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateTrip(tripId, { supplierAddress: addressValue });
    setEditingAddress(null);
    setAddressValue('');
  };

  if (trips.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Bulk Actions Bar */}
      {selectedTrips.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              {selectedTrips.length} trip{selectedTrips.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                <UserPlus className="h-4 w-4 mr-1" />
                Bulk Assign Runner
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200">
                <Users className="h-4 w-4 mr-1" />
                Bulk Assign Owner
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200">
                <Send className="h-4 w-4 mr-1" />
                Send FO Links
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedTrips.length === trips.length}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-3 text-sm font-medium text-gray-900">
            Select All ({trips.length} trips)
          </span>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="divide-y divide-gray-200">
        {trips.map((trip) => {
          const isExpanded = expandedTrips.has(trip.id);
          const isSelected = selectedTrips.includes(trip.id);
          const isEditingStatusForTrip = editingStatus === trip.id;
          const isEditingOwnerForTrip = editingOwner === trip.id;
          const isEditingRunnerForTrip = editingRunner === trip.id;
          const isEditingAddressForTrip = editingAddress === trip.id;
          const statusInfo = statusConfig[trip.status];
          const priorityInfo = priorityConfig[trip.priority];
          const StatusIcon = statusInfo.icon;
          const currentUpdates = statusUpdates[trip.id];

          return (
            <div
              key={trip.id}
              className={`px-6 py-4 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} ${
                priorityInfo.color
              } border-l-4`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectTrip(trip.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{trip.id}</h3>
                      <span className="text-sm text-gray-600">{trip.vehicleNo}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      {/* Status Display/Edit */}
                      {isEditingStatusForTrip ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={currentUpdates?.status || trip.status}
                            onChange={(e) => handleStatusChange(trip.id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="vehicle_unloaded">Vehicle Unloaded</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="pod_collected">POD Collected</option>
                            <option value="couriered">Couriered</option>
                            <option value="delivered">Delivered</option>
                            <option value="fo_courier">FO Courier</option>
                          </select>
                          <button
                            onClick={() => saveStatusUpdate(trip.id)}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          <button
                            onClick={() => startEditingStatus(trip.id, trip.status)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit Status"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Trip Owner */}
                      {isEditingOwnerForTrip ? (
                        <div className="flex items-center space-x-2">
                          <select
                            defaultValue={trip.owner || ''}
                            onChange={(e) => saveOwnerUpdate(trip.id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Unassigned</option>
                            {ownerOptions.map(owner => (
                              <option key={owner} value={owner}>{owner}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingOwner(null)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trip.owner ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <Users className="h-3 w-3 mr-1" />
                            Owner: {trip.owner || 'Unassigned'}
                          </span>
                          <button
                            onClick={() => startEditingOwner(trip.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Assign Owner"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Runner Assignment */}
                      {isEditingRunnerForTrip ? (
                        <div className="flex items-center space-x-2">
                          <select
                            defaultValue={trip.runner || ''}
                            onChange={(e) => saveRunnerUpdate(trip.id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Unassigned</option>
                            {runnerOptions.map(runner => (
                              <option key={runner} value={runner}>{runner}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingRunner(null)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trip.runner ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <User className="h-3 w-3 mr-1" />
                            Runner: {trip.runner || 'Unassigned'}
                          </span>
                          <button
                            onClick={() => startEditingRunner(trip.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Assign Runner"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      {trip.aging > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {trip.aging} days overdue
                        </span>
                      )}

                      {trip.issueReported && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Issue Reported
                        </span>
                      )}
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.badge}`}>
                        {trip.priority.charAt(0).toUpperCase() + trip.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpanded(trip.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Status Update Form */}
              {isEditingStatusForTrip && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status Details</h4>
                  
                  {/* Runner Assignment */}
                  {(currentUpdates?.status === 'assigned' || currentUpdates?.status === 'in_progress') && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Assign Runner
                      </label>
                      <select
                        value={currentUpdates?.runner || trip.runner || ''}
                        onChange={(e) => handleFieldChange(trip.id, 'runner', e.target.value)}
                        className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Runner</option>
                        {runnerOptions.map(runner => (
                          <option key={runner} value={runner}>{runner}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* POD Images Upload */}
                  {currentUpdates?.status === 'pod_collected' && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        POD Images (Required)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                        <div className="text-center">
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <div className="mt-1">
                            <label htmlFor={`pod-upload-${trip.id}`} className="cursor-pointer">
                              <span className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                Upload POD Images
                              </span>
                              <input
                                id={`pod-upload-${trip.id}`}
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFileUpload(trip.id, e.target.files)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      {currentUpdates?.podImages && currentUpdates.podImages.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600 mb-1">Uploaded Images:</div>
                          {currentUpdates.podImages.map((image: string, index: number) => (
                            <div key={index} className="flex items-center text-xs text-gray-700">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              {image}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Courier Details */}
                  {currentUpdates?.status === 'couriered' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Courier Partner (Required)
                        </label>
                        <select
                          value={currentUpdates?.courierPartner || trip.courierPartner || ''}
                          onChange={(e) => handleFieldChange(trip.id, 'courierPartner', e.target.value)}
                          className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Courier Partner</option>
                          {courierOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          AWB/Docket Number (Required)
                        </label>
                        <input
                          type="text"
                          value={currentUpdates?.awbNumber || trip.awbNumber || ''}
                          onChange={(e) => handleFieldChange(trip.id, 'awbNumber', e.target.value)}
                          placeholder="Enter AWB or docket number"
                          className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Comments (Optional)
                        </label>
                        <textarea
                          value={currentUpdates?.courierComments || trip.courierComments || ''}
                          onChange={(e) => handleFieldChange(trip.id, 'courierComments', e.target.value)}
                          placeholder="Add any comments about the courier..."
                          rows={2}
                          className="block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Info Row */}
              {!isExpanded && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Route className="h-4 w-4 mr-2 text-gray-400" />
                    {trip.route}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    {trip.dNode}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Unloaded: {new Date(trip.unloadDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Loaded: {new Date(trip.loadingDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {trip.runner || 'Unassigned'}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{trip.supplierAddress || 'No Address'}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/trip/${trip.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Link>
                
                <button
                  onClick={() => handleCallFO(trip.foPhone)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call FO
                </button>

                {/* Supplier Address Management */}
                {isEditingAddressForTrip ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={addressValue}
                      onChange={(e) => setAddressValue(e.target.value)}
                      placeholder="Enter supplier address..."
                      className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          saveAddressUpdate(trip.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => saveAddressUpdate(trip.id)}
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Save Address"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditingAddress(trip.id, trip.supplierAddress)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Building className="h-4 w-4 mr-1" />
                    Edit Supplier Address
                  </button>
                )}

                {/* Dynamic Action Buttons */}
                {trip.status === 'vehicle_unloaded' && (
                  <>
                    <button 
                      onClick={() => startEditingRunner(trip.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign Runner
                    </button>
                    <button
                      onClick={() => handleSendFOLink(trip.foPhone, trip.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send FO Link
                    </button>
                  </>
                )}

                {trip.status === 'pod_collected' && (
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <Package className="h-4 w-4 mr-1" />
                    Mark Couriered
                  </button>
                )}

                {(trip.status === 'couriered' || trip.status === 'fo_courier') && (
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Delivered
                  </button>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">FO: {trip.foName}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCallFO(trip.foPhone)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{trip.foPhone}</div>
                        
                        <div className="text-sm text-gray-600">Supply POC: {trip.supplyPocName}</div>
                        <div className="text-xs text-gray-500">{trip.supplyPocPhone}</div>
                        
                        <div className="text-sm text-gray-600">Demand POC: {trip.demandPocName}</div>
                        <div className="text-xs text-gray-500">{trip.demandPocPhone}</div>
                        
                        {trip.driverName && (
                          <>
                            <div className="text-sm text-gray-600">Driver: {trip.driverName}</div>
                            <div className="text-xs text-gray-500">{trip.driverPhone}</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Address & Documents */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Address & Documents</h4>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="text-sm text-gray-600 flex-1">
                            <div className="font-medium">Supplier Address:</div>
                            <div className="text-xs text-gray-500 mt-1">{trip.supplierAddress || 'No address set'}</div>
                          </div>
                        </div>

                        {trip.foOfficeAddress && (
                          <div className="flex items-start justify-between">
                            <div className="text-sm text-gray-600 flex-1">
                              <div className="font-medium">FO Office Address:</div>
                              <div className="text-xs text-gray-500 mt-1">{trip.foOfficeAddress}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">LR Document</span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issue Details */}
                  {trip.issueReported && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Reported Issue</h4>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-red-800">{trip.issueReported.type}</div>
                            {trip.issueReported.description && (
                              <div className="text-sm text-red-700 mt-1">{trip.issueReported.description}</div>
                            )}
                            <div className="text-xs text-red-600 mt-2">
                              Reported: {new Date(trip.issueReported.reportedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FO Link Management */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">FO Link Management</h4>
                    {trip.foLink ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">FO Link Generated</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCopyLink(trip.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy Link"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSendFOLink(trip.foPhone, trip.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Send via WhatsApp"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600" title="Send via Email">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600" title="Open Link">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border">
                          {trip.foLink}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-2">No FO link generated yet</div>
                    )}
                    
                    {!trip.foLink && (
                      <button
                        onClick={() => handleSendFOLink(trip.foPhone, trip.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Generate & Send FO Link
                      </button>
                    )}
                  </div>

                  {/* Courier Details */}
                  {(trip.status === 'couriered' || trip.status === 'delivered') && trip.courierPartner && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Courier Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Courier Partner:</span>
                            <div className="font-medium">{trip.courierPartner}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">AWB/Docket:</span>
                            <div className="font-medium">{trip.awbNumber}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <div className="font-medium text-green-600">In Transit</div>
                          </div>
                          {trip.courierComments && (
                            <div className="col-span-3">
                              <span className="text-gray-600">Comments:</span>
                              <div className="font-medium">{trip.courierComments}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* POD Images */}
                  {trip.podImages && trip.podImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">POD Images</h4>
                      <div className="flex flex-wrap gap-2">
                        {trip.podImages.map((image, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded px-3 py-2">
                            <span className="text-sm text-gray-600">{image}</span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripTable;