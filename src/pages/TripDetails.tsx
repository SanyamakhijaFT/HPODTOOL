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
  X
} from 'lucide-react';
import { mockTrips } from '../data/mockData';
import { Trip } from '../types';

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | undefined>(mockTrips.find(t => t.id === id));
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressValue, setAddressValue] = useState(trip?.supplierAddress || '');

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
    vehicle_unloaded: { label: 'Vehicle Unloaded', icon: Truck, color: 'bg-orange-100 text-orange-800' },
    assigned: { label: 'Assigned', icon: User, color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'bg-purple-100 text-purple-800' },
    pod_collected: { label: 'POD Collected', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    couriered: { label: 'Couriered', icon: Package, color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
    fo_courier: { label: 'FO Courier', icon: Send, color: 'bg-cyan-100 text-cyan-800' },
  };

  const statusInfo = statusConfig[trip.status];
  const StatusIcon = statusInfo.icon;

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{trip.id}</h1>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {statusInfo.label}
                </span>
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
            <div className="bg-white shadow-lg rounded-xl p-6">
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
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-500 mb-2">Demand POC</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium">{trip.demandPocName}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {trip.demandPocPhone}
                    </div>
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
            <div className="bg-white shadow-lg rounded-xl p-6">
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

            {/* POD Collection Details */}
            {(trip.status === 'pod_collected' || trip.status === 'couriered' || trip.status === 'delivered') && (
              <div className="bg-white shadow-lg rounded-xl p-6">
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
              <div className="bg-white shadow-lg rounded-xl p-6">
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
            <div className="bg-white shadow-lg rounded-xl p-6">
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

            {/* Assignment Info */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Info</h3>
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
                  <label className="block text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(trip.priority)}`}>
                      {trip.priority.charAt(0).toUpperCase() + trip.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow-lg rounded-xl p-6">
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