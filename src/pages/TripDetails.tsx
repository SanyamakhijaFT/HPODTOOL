import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  AlertTriangle, 
  Calendar, 
  User, 
  Phone, 
  Package, 
  CheckCircle, 
  UserPlus, 
  Send, 
  Navigation,
  Clock,
  Route,
  Building,
  Edit3,
  Save,
  X,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';
import { mockTrips } from '../data/mockData';
import { Trip } from '../types';

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | undefined>(mockTrips.find(t => t.id === id));
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressValue, setAddressValue] = useState(trip?.supplierAddress || '');
  const [editingSlotStatus, setEditingSlotStatus] = useState(false);
  const [slotStatusValue, setSlotStatusValue] = useState(trip?.slotStatus || '');
  const [ownerRemark, setOwnerRemark] = useState('');
  const [addingOwnerRemark, setAddingOwnerRemark] = useState(false);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
          <p className="mt-2 text-gray-600">The trip you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Control Tower
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    assigned: { label: 'Assigned', icon: User, color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'bg-purple-100 text-purple-800' },
    pod_collected: { label: 'POD Collected', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    couriered: { label: 'Couriered', icon: Package, color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
    fo_courier: { label: 'FO Courier', icon: Send, color: 'bg-cyan-100 text-cyan-800' },
  };

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
    const option = slotStatusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
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

  const statusInfo = statusConfig[trip.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || User;

  const timelineEvents = [
    { event: 'Vehicle loaded', date: trip.loadingDate, icon: Truck },
    { event: 'Vehicle unloaded', date: trip.unloadDate, icon: Truck },
    ...(trip.runner ? [{ event: `Assigned to ${trip.runner}`, date: trip.unloadDate, icon: User }] : []),
    ...(trip.status === 'pod_collected' || trip.status === 'couriered' ? [{ event: 'POD collected', date: trip.unloadDate, icon: CheckCircle }] : []),
    ...(trip.status === 'couriered' ? [{ event: 'Couriered', date: trip.courierDate || trip.unloadDate, icon: Package }] : []),
  ];

  const handleSaveAddress = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setTrip(prev => prev ? { ...prev, supplierAddress: addressValue } : prev);
    setEditingAddress(false);
  };

  const handleCancelEdit = () => {
    setAddressValue(trip.supplierAddress || '');
    setEditingAddress(false);
  };

  const handleSaveSlotStatus = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setTrip(prev => prev ? { ...prev, slotStatus: slotStatusValue as Trip['slotStatus'] } : prev);
    setEditingSlotStatus(false);
  };

  const handleCancelSlotEdit = () => {
    setSlotStatusValue(trip.slotStatus || '');
    setEditingSlotStatus(false);
  };

  const handleAddOwnerRemark = async () => {
    if (!ownerRemark.trim()) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRemark = {
      text: ownerRemark,
      addedAt: new Date().toISOString(),
      addedBy: 'Current User', // In real app, get from auth context
    };

    setTrip(prev => prev ? {
      ...prev,
      ownerRemarks: [...(prev.ownerRemarks || []), newRemark]
    } : prev);
    
    setOwnerRemark('');
    setAddingOwnerRemark(false);
  };

  const handleDeleteOwnerRemark = async (index: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTrip(prev => prev ? {
      ...prev,
      ownerRemarks: prev.ownerRemarks?.filter((_, i) => i !== index) || []
    } : prev);
  };

  const handleNavigate = () => {
    if (trip.supplierAddress) {
      const query = encodeURIComponent(trip.supplierAddress);
      window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
    }
  };

  const handleCallFO = () => {
    window.open(`tel:${trip.foPhone}`, '_self');
  };

  const handleSendFOLink = () => {
    const message = `Hi, Please provide POD for Trip ${trip.id}. Link: https://pod.freighttiger.com/fo/${trip.id}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = trip.foPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Control Tower
        </Link>

        {/* Trip Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{trip.id}</h1>
              <div className="flex items-center space-x-3">
                {statusInfo && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {statusInfo.label}
                  </span>
                )}
                {trip.aging > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {trip.aging} days overdue
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle & Route Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle & Route Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Vehicle Number</label>
                  <div className="text-sm text-gray-900 font-medium">{trip.vehicleNo}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Route</label>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Route className="h-4 w-4 mr-2 text-gray-400" />
                    {trip.route}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">D Node (Cluster)</label>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    {trip.dNode}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Loading Date</label>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(trip.loadingDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Unloading Date</label>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(trip.unloadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">FO Details</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium">{trip.foName}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {trip.foPhone}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Supply POC</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium">{trip.supplyPocName}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {trip.supplyPocPhone}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">LSP Name</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium">{trip.supplyPocName}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Demand POC</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium">{trip.demandPocName}</div>
                  </div>
                </div>
                {trip.driverName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Driver Details</label>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900 font-medium">{trip.driverName}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {trip.driverPhone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier Address - Editable */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Supplier Address</h3>
                {!editingAddress && (
                  <button
                    onClick={() => setEditingAddress(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
              
              {editingAddress ? (
                <div className="space-y-4">
                  <textarea
                    value={addressValue}
                    onChange={(e) => setAddressValue(e.target.value)}
                    placeholder="Enter supplier address..."
                    rows={3}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveAddress}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="text-sm text-gray-900 flex-1">{trip.supplierAddress || 'No address set'}</div>
                  {trip.supplierAddress && (
                    <button
                      onClick={handleNavigate}
                      className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Runner Updates Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Runner Updates</h3>
              
              {/* Runner Remarks */}
              {trip.runnerRemarks && trip.runnerRemarks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Runner Remarks
                  </h4>
                  
                  <div className="space-y-3">
                    {trip.runnerRemarks
                      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                      .map((remark, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm text-purple-800 mb-2">
                              <span className="font-medium">{remark.type}:</span> {remark.text}
                            </div>
                            <div className="text-xs text-purple-600">
                              Added: {new Date(remark.addedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Runner Issues */}
              {trip.issueReported && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Reported Issues
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Current Issue */}
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-red-800 mb-1">{trip.issueReported.type}</div>
                          {trip.issueReported.description && (
                            <div className="text-sm text-red-700 mb-2">{trip.issueReported.description}</div>
                          )}
                          <div className="text-xs text-red-600">
                            Reported: {new Date(trip.issueReported.reportedAt).toLocaleString()}
                          </div>
                          {trip.issueReported.resolved && (
                            <div className="text-xs text-green-600 mt-1 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved: {new Date(trip.issueReported.resolvedAt!).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            trip.issueReported.resolved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trip.issueReported.resolved ? 'Resolved' : 'Open'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Issue Updates */}
                    {trip.issueReported.updates && trip.issueReported.updates.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Issue Updates</h5>
                        <div className="space-y-2">
                          {trip.issueReported.updates
                            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                            .map((update, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                              <div className="text-sm text-yellow-800 font-medium">{update.type}</div>
                              {update.description && (
                                <div className="text-sm text-yellow-700 mt-1">{update.description}</div>
                              )}
                              <div className="text-xs text-yellow-600 mt-1">
                                Updated: {new Date(update.updatedAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Updates Message */}
              {(!trip.runnerRemarks || trip.runnerRemarks.length === 0) && !trip.issueReported && (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Runner Updates</h4>
                  <p className="text-gray-500">No remarks or issues have been reported by the runner yet.</p>
                </div>
              )}
            </div>

            {/* POD Collection Details */}
            {(trip.status === 'pod_collected' || trip.status === 'couriered' || trip.status === 'delivered') && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">POD Collection Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">POD Successfully Collected</span>
                  </div>
                  {trip.runner && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Collected by</label>
                      <div className="mt-1 text-sm text-gray-900">{trip.runner}</div>
                    </div>
                  )}
                  {trip.podImages && trip.podImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">POD Images</label>
                      <div className="space-y-2">
                        {trip.podImages.map((image, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{image}</span>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Package className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Courier Details */}
            {(trip.status === 'couriered' || trip.status === 'delivered') && trip.courierPartner && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Courier Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Courier Partner</label>
                    <div className="mt-1 text-sm text-gray-900">{trip.courierPartner}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">AWB/Docket Number</label>
                    <div className="mt-1 text-sm text-gray-900">{trip.awbNumber}</div>
                  </div>
                  {trip.courierDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Courier Date</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(trip.courierDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {trip.deliveryDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Delivery Date</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(trip.deliveryDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {trip.courierComments && (
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-500">Comments</label>
                      <div className="mt-1 text-sm text-gray-900">{trip.courierComments}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSendFOLink}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send FO Link
                </button>
                
                <button
                  onClick={handleCallFO}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call FO
                </button>

                {!trip.runner && (
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Runner
                  </button>
                )}

                {trip.runner && (
                  <button
                    onClick={() => window.open(`tel:${trip.runner}`, '_self')}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Runner
                  </button>
                )}
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Trip Owner</label>
                  <div className="mt-1 text-sm text-gray-900">{trip.owner || 'Unassigned'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Assigned Runner</label>
                  <div className="mt-1 text-sm text-gray-900">{trip.runner || 'Unassigned'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Slot Selected</label>
                  {editingSlotStatus ? (
                    <div className="space-y-2">
                      <select
                        value={slotStatusValue}
                        onChange={(e) => setSlotStatusValue(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        {slotStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveSlotStatus}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelSlotEdit}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSlotStatusColor(trip.slotStatus)}`}>
                        <Package className="h-3 w-3 mr-1" />
                        {getSlotStatusLabel(trip.slotStatus)}
                      </span>
                      <button
                        onClick={() => setEditingSlotStatus(true)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit Slot Status"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => {
                  const EventIcon = event.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <EventIcon className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{event.event}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;