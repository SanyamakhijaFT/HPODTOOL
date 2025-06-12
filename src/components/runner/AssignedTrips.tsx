import React, { useState } from 'react';
import { 
  Phone, 
  Navigation, 
  User, 
  CheckCircle, 
  Truck,
  Calendar,
  Clock,
  AlertTriangle,
  Package,
  X,
  Users,
  Building,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { Trip } from '../../types';
import PODCollection from './PODCollection';

interface AssignedTripsProps {
  trips: Trip[];
  onUpdateTrip: (tripId: string, updates: Partial<Trip>) => void;
}

interface ContactModalProps {
  trip: Trip;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ trip, onClose }) => {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* FO Contact */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">FO: {trip.foName}</div>
                <div className="text-xs text-gray-500">{trip.foPhone}</div>
              </div>
              <button
                onClick={() => handleCall(trip.foPhone)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Supply POC */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Supply POC: {trip.supplyPocName}</div>
                <div className="text-xs text-gray-500">{trip.supplyPocPhone}</div>
              </div>
              <button
                onClick={() => handleCall(trip.supplyPocPhone)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Driver Contact */}
          {trip.driverPhone && (
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Driver: {trip.driverName || 'Driver'}</div>
                  <div className="text-xs text-gray-500">{trip.driverPhone}</div>
                </div>
                <button
                  onClick={() => handleCall(trip.driverPhone)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const statusConfig = {
  assigned: {
    label: 'Assigned',
    icon: User,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  in_progress: {
    label: 'Picked Up',
    icon: Clock,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  pod_collected: {
    label: 'POD Collected',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  couriered: {
    label: 'Couriered',
    icon: Truck,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
};

const priorityConfig = {
  high: { color: 'border-l-red-500', badge: 'bg-red-100 text-red-800' },
  medium: { color: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  low: { color: 'border-l-green-500', badge: 'bg-green-100 text-green-800' },
};

const AssignedTrips: React.FC<AssignedTripsProps> = ({
  trips,
  onUpdateTrip,
}) => {
  const [showContactModal, setShowContactModal] = useState<string | null>(null);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Filter trips - only show assigned trips (not delivered) and apply status filter
  const filteredTrips = trips.filter(trip => {
    const isNotDelivered = trip.status !== 'delivered';
    const matchesStatusFilter = !statusFilter || trip.status === statusFilter;
    return isNotDelivered && matchesStatusFilter;
  });

  const handleNavigate = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
  };

  const toggleExpanded = (tripId: string) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  const clearFilter = () => {
    setStatusFilter('');
  };

  if (filteredTrips.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 sm:p-8 text-center">
        <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {statusFilter ? 'No trips found' : 'No trips assigned'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {statusFilter 
            ? `No trips match the selected status filter.`
            : 'You have no trips assigned at the moment.'
          }
        </p>
        {statusFilter && (
          <button
            onClick={clearFilter}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              My Trips ({filteredTrips.length})
            </h3>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">Picked Up</option>
                <option value="pod_collected">POD Collected</option>
                <option value="couriered">Couriered</option>
              </select>
              {statusFilter && (
                <button
                  onClick={clearFilter}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-80 sm:max-h-96 overflow-y-auto">
          {filteredTrips.map((trip) => {
            const isExpanded = expandedTrip === trip.id;
            const statusInfo = statusConfig[trip.status as keyof typeof statusConfig];
            const priorityInfo = priorityConfig[trip.priority];
            const StatusIcon = statusInfo?.icon || User;

            return (
              <div key={trip.id} className={`border-l-4 ${priorityInfo.color}`}>
                <div
                  className="p-3 sm:p-4 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => toggleExpanded(trip.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{trip.id}</h4>
                        <span className="text-xs text-gray-600 mt-1 sm:mt-0">{trip.vehicleNo}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 sm:mt-0 ${priorityInfo.badge}`}>
                          {trip.priority.charAt(0).toUpperCase() + trip.priority.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Supply POC: {trip.supplyPocName}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className={`truncate ${trip.supplierAddress ? 'text-green-600' : 'text-red-600'}`}>
                            {trip.supplierAddress ? 'Supplier Address Set' : 'No Supplier Address'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>Unloaded: {new Date(trip.unloadDate).toLocaleDateString()}</span>
                        </div>
                        {trip.aging > 2 && (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{trip.aging} days old</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-2">
                      {/* Only show status badge if no issue is reported */}
                      {!trip.issueReported && statusInfo && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      )}

                      {/* Show issue indicator if issue is reported */}
                      {trip.issueReported && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Issue Reported
                        </span>
                      )}

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowContactModal(trip.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Contact Info"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(trip.supplierAddress);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Navigate"
                        >
                          <Navigation className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Courier Details if couriered */}
                  {trip.status === 'couriered' && trip.courierPartner && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          <span className="truncate">{trip.courierPartner} • {trip.awbNumber}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded POD Collection Flow */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <PODCollection
                      trip={trip}
                      onUpdateTrip={onUpdateTrip}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          trip={filteredTrips.find(t => t.id === showContactModal)!}
          onClose={() => setShowContactModal(null)}
        />
      )}
    </>
  );
};

export default AssignedTrips;