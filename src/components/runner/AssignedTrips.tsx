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
  MessageSquare,
  MapPin,
  FileText,
} from 'lucide-react';
import { Trip } from '../../types';
import PODCollection from './PODCollection';
import RunnerFilters, { RunnerFilterState } from './RunnerFilters';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* FO Contact */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900">Field Officer</div>
              <div className="text-blue-800 font-semibold">{trip.foName}</div>
              <div className="text-xs text-blue-600">{trip.foPhone}</div>
            </div>
            <button
              onClick={() => handleCall(trip.foPhone)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>

          {/* LSP Contact */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-medium text-green-900">LSP Contact</div>
              <div className="text-green-800 font-semibold">{trip.supplyPocName}</div>
              <div className="text-xs text-green-600">{trip.supplyPocPhone}</div>
            </div>
            <button
              onClick={() => handleCall(trip.supplyPocPhone)}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>

          {/* Driver Contact */}
          {trip.driverPhone && (
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-900">Driver</div>
                <div className="text-orange-800 font-semibold">{trip.driverName || 'Driver'}</div>
                <div className="text-xs text-orange-600">{trip.driverPhone}</div>
              </div>
              <button
                onClick={() => handleCall(trip.driverPhone!)}
                className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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

const AssignedTrips: React.FC<AssignedTripsProps> = ({
  trips,
  onUpdateTrip,
}) => {
  const [showContactModal, setShowContactModal] = useState<string | null>(null);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RunnerFilterState>({
    slotStatus: '',
    hasRunnerRemarks: false,
    runnerRemarksType: '',
  });

  // Filter trips - only show assigned trips (not delivered) and apply filters
  const filteredTrips = trips.filter(trip => {
    const isNotDelivered = trip.status !== 'delivered';
    
    // Search filter
    const matchesSearch = !searchQuery || 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.foName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.supplyPocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.supplierAddress.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter conditions
    const matchesSlotStatus = !filters.slotStatus || trip.slotStatus === filters.slotStatus;
    const matchesRunnerRemarks = !filters.hasRunnerRemarks || (trip.runnerRemarks && trip.runnerRemarks.length > 0);
    
    // Runner remarks type filter
    const matchesRunnerRemarksType = !filters.runnerRemarksType || 
      (trip.runnerRemarks && trip.runnerRemarks.some(remark => remark.type === filters.runnerRemarksType));

    return isNotDelivered && matchesSearch && matchesSlotStatus && matchesRunnerRemarks && matchesRunnerRemarksType;
  });

  const handleNavigate = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
  };

  const toggleExpanded = (tripId: string) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  if (filteredTrips.length === 0) {
    return (
      <div className="space-y-4">
        <RunnerFilters
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          activeFilters={filters}
        />
        
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500">No trips match your current filters or search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <RunnerFilters
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
          activeFilters={filters}
        />

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                My Active Trips
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredTrips.map((trip) => {
              const isExpanded = expandedTrip === trip.id;
              const statusInfo = statusConfig[trip.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo?.icon || User;

              return (
                <div key={trip.id} className="transition-all duration-200 hover:bg-gray-50">
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpanded(trip.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Trip Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{trip.id}</h4>
                          <span className="text-sm text-gray-600 mt-1 sm:mt-0">{trip.vehicleNo}</span>
                        </div>
                        
                        {/* Trip Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="truncate"><strong>FO:</strong> {trip.foName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Building className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span className="truncate"><strong>LSP:</strong> {trip.supplyPocName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                            <span className={`truncate ${trip.supplierAddress ? 'text-green-600' : 'text-red-600'}`}>
                              {trip.supplierAddress ? 'Address Available' : 'No Address'}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                            <span>Unloaded: {new Date(trip.unloadDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* Slot Status */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSlotStatusColor(trip.slotStatus)}`}>
                            <Package className="h-3 w-3 mr-1" />
                            {getSlotStatusLabel(trip.slotStatus)}
                          </span>

                          {/* Remarks Indicator */}
                          {trip.runnerRemarks && trip.runnerRemarks.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {trip.runnerRemarks.length} Remark{trip.runnerRemarks.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {/* Status Badge */}
                        {!trip.issueReported && statusInfo && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {statusInfo.label}
                          </span>
                        )}

                        {/* Issue Indicator */}
                        {trip.issueReported && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Issue Reported
                          </span>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowContactModal(trip.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Contact Info"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(trip.supplierAddress);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Navigate"
                          >
                            <Navigation className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <Truck className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium">Courier:</span>
                          <span className="ml-1">{trip.courierPartner} • {trip.awbNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded POD Collection Flow */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4">
                        <PODCollection
                          trip={trip}
                          onUpdateTrip={onUpdateTrip}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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