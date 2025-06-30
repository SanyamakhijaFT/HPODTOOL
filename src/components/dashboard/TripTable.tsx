import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Phone,
  UserPlus,
  Send,
  Package,
  CheckCircle,
  Truck,
  User,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Edit3,
  Save,
  X,
  ImageIcon,
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
  viewType: 'runner_assigned' | 'non_runner';
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
    icon: CheckCircle,
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

const slotStatusOptions = [
  { value: 'recovered', label: 'Recovered' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'recovered_25_plus', label: 'Recovered >25' },
  { value: 'onsite_epod_pending', label: 'Onsite - EPOD Pending' },
  { value: 'lost_ibond_submitted', label: 'Lost - IBond Submitted' },
  { value: 'lost_ibond_not_required', label: 'Lost - IBond Not Required' },
  { value: 'lost', label: 'Lost' },
  { value: 'critical', label: 'Critical' },
  { value: 'below_15_days_pending', label: 'Below 15 Days Pending' },
  { value: 'below_5_days_pending', label: 'Below 5 Days Pending' },
  { value: 'intransit', label: 'Intransit' },
  { value: 'cancelled', label: 'Cancelled' },
];

const getSlotStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'recovered': 'Recovered',
    'onsite': 'Onsite',
    'recovered_25_plus': 'Recovered >25',
    'onsite_epod_pending': 'Onsite - EPOD Pending',
    'lost_ibond_submitted': 'Lost - IBond Submitted',
    'lost_ibond_not_required': 'Lost - IBond Not Required',
    'lost': 'Lost',
    'critical': 'Critical',
    'below_15_days_pending': 'Below 15 Days Pending',
    'below_5_days_pending': 'Below 5 Days Pending',
    'intransit': 'Intransit',
    'cancelled': 'Cancelled',
  };
  return statusMap[status] || status;
};

const getSlotStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    'recovered': 'bg-green-100 text-green-800',
    'onsite': 'bg-blue-100 text-blue-800',
    'recovered_25_plus': 'bg-emerald-100 text-emerald-800',
    'onsite_epod_pending': 'bg-cyan-100 text-cyan-800',
    'lost_ibond_submitted': 'bg-red-100 text-red-800',
    'lost_ibond_not_required': 'bg-orange-100 text-orange-800',
    'lost': 'bg-red-100 text-red-800',
    'critical': 'bg-red-100 text-red-800',
    'below_15_days_pending': 'bg-yellow-100 text-yellow-800',
    'below_5_days_pending': 'bg-yellow-100 text-yellow-800',
    'intransit': 'bg-indigo-100 text-indigo-800',
    'cancelled': 'bg-gray-100 text-gray-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const TripTable: React.FC<TripTableProps> = ({
  trips,
  selectedTrips,
  onSelectTrip,
  onSelectAll,
  onUpdateTrip,
  viewType,
}) => {
  const [expandedTrips, setExpandedTrips] = useState<Set<string>>(new Set());
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingOwner, setEditingOwner] = useState<string | null>(null);
  const [editingRunner, setEditingRunner] = useState<string | null>(null);
  const [editingSlotStatus, setEditingSlotStatus] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressValue, setAddressValue] = useState<string>('');

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

  const startEditingStatus = (tripId: string) => {
    setEditingStatus(tripId);
  };

  const startEditingOwner = (tripId: string) => {
    setEditingOwner(tripId);
  };

  const startEditingRunner = (tripId: string) => {
    setEditingRunner(tripId);
  };

  const startEditingSlotStatus = (tripId: string) => {
    setEditingSlotStatus(tripId);
  };

  const startEditingAddress = (tripId: string, currentAddress: string) => {
    setEditingAddress(tripId);
    setAddressValue(currentAddress || '');
  };

  const cancelEditing = () => {
    setEditingStatus(null);
    setEditingOwner(null);
    setEditingRunner(null);
    setEditingSlotStatus(null);
    setEditingAddress(null);
    setAddressValue('');
  };

  const saveStatusUpdate = async (tripId: string, newStatus: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateTrip(tripId, { status: newStatus as Trip['status'] });
    setEditingStatus(null);
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

  const saveSlotStatusUpdate = async (tripId: string, newSlotStatus: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateTrip(tripId, { slotStatus: newSlotStatus as Trip['slotStatus'] });
    setEditingSlotStatus(null);
  };

  const saveAddressUpdate = async (tripId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateTrip(tripId, { supplierAddress: addressValue });
    setEditingAddress(null);
    setAddressValue('');
  };

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedTrips.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              {selectedTrips.length} trip{selectedTrips.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              {viewType === 'non_runner' && (
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Bulk Assign Runner
                </button>
              )}
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200">
                <User className="h-4 w-4 mr-1" />
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
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
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
      <div className="divide-y divide-gray-100">
        {trips.map((trip) => {
          const isExpanded = expandedTrips.has(trip.id);
          const isSelected = selectedTrips.includes(trip.id);
          const isEditingStatusForTrip = editingStatus === trip.id;
          const isEditingOwnerForTrip = editingOwner === trip.id;
          const isEditingRunnerForTrip = editingRunner === trip.id;
          const isEditingSlotStatusForTrip = editingSlotStatus === trip.id;
          const isEditingAddressForTrip = editingAddress === trip.id;
          const statusInfo = statusConfig[trip.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={trip.id}
              className={`px-6 py-4 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors duration-200`}
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
                            defaultValue={trip.status}
                            onChange={(e) => saveStatusUpdate(trip.id, e.target.value)}
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
                            onClick={() => setEditingStatus(null)}
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
                            onClick={() => startEditingStatus(trip.id)}
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
                            <User className="h-3 w-3 mr-1" />
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

                      {/* Runner Assignment - Show for both views */}
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

                      {/* Slot Status */}
                      {isEditingSlotStatusForTrip ? (
                        <div className="flex items-center space-x-2">
                          <select
                            defaultValue={trip.slotStatus}
                            onChange={(e) => saveSlotStatusUpdate(trip.id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {slotStatusOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingSlotStatus(null)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSlotStatusColor(trip.slotStatus)}`}>
                            <Package className="h-3 w-3 mr-1" />
                            {getSlotStatusLabel(trip.slotStatus)}
                          </span>
                          <button
                            onClick={() => startEditingSlotStatus(trip.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit Slot Status"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Runner Remarks Indicator */}
                      {trip.runnerRemarks && trip.runnerRemarks.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {trip.runnerRemarks.length} Remark{trip.runnerRemarks.length !== 1 ? 's' : ''}
                        </span>
                      )}

                      {/* Issue Indicator */}
                      {trip.issueReported && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Issue Reported
                        </span>
                      )}
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

              {/* Quick Info Row */}
              {!isExpanded && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    FO: {trip.foName}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCallFO(trip.foPhone)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call FO
                </button>

                {/* Dynamic Action Buttons */}
                {viewType === 'non_runner' && !trip.runner && (
                  <button 
                    onClick={() => startEditingRunner(trip.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign Runner
                  </button>
                )}

                <button
                  onClick={() => handleSendFOLink(trip.foPhone, trip.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send FO Link
                </button>
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
                        {/* Supplier Address - Editable in expanded view */}
                        <div className="flex items-start justify-between">
                          <div className="text-sm text-gray-600 flex-1">
                            <div className="font-medium mb-1">Supplier Address:</div>
                            {isEditingAddressForTrip ? (
                              <div className="flex items-start space-x-2">
                                <textarea
                                  value={addressValue}
                                  onChange={(e) => setAddressValue(e.target.value)}
                                  placeholder="Enter supplier address..."
                                  rows={3}
                                  className="flex-1 text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex flex-col space-y-1">
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
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="text-xs text-gray-500 flex-1 mr-2">
                                  {trip.supplierAddress || 'No address set'}
                                </div>
                                <button
                                  onClick={() => startEditingAddress(trip.id, trip.supplierAddress)}
                                  className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                  title="Edit Address"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
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
                      </div>
                    </div>
                  </div>

                  {/* Runner Remarks Section */}
                  {trip.runnerRemarks && trip.runnerRemarks.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Runner Remarks</h4>
                      <div className="space-y-3">
                        {trip.runnerRemarks.map((remark, index) => (
                          <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-sm text-purple-800 mb-2">
                              <span className="font-medium">{remark.type}:</span> {remark.text}
                            </div>
                            {remark.images && remark.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {remark.images.map((_, imgIndex) => (
                                  <span
                                    key={imgIndex}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700"
                                  >
                                    <ImageIcon className="h-3 w-3 mr-1" />
                                    Image {imgIndex + 1}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-purple-600">
                              Added: {new Date(remark.addedAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                          {trip.collectedFrom && (
                            <div>
                              <span className="text-gray-600">Collected From:</span>
                              <div className="font-medium">{trip.collectedFrom}</div>
                            </div>
                          )}
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
                              <ImageIcon className="h-4 w-4" />
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