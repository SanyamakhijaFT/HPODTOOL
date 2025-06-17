import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RunnerProfile from '../components/runner/RunnerProfile';
import AssignedTrips from '../components/runner/AssignedTrips';
import { mockTrips, mockRunnerProfile } from '../data/mockData';
import { Trip } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { User, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const RunnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedRunner, setSelectedRunner] = useState<string>(user?.id || '2');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  // Initialize trips state with mock data
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  
  // Get all trips for the selected runner from current state
  const allRunnerTrips = trips.filter(trip => trip.runnerId === selectedRunner);
  
  // Separate active and completed trips
  const activeTrips = allRunnerTrips.filter(trip => trip.status !== 'delivered');
  const completedTrips = allRunnerTrips.filter(trip => trip.status === 'delivered');

  const handleUpdateTrip = (tripId: string, updates: Partial<Trip>) => {
    console.log('Updating trip:', tripId, 'with updates:', updates); // Debug log
    
    setTrips(prevTrips => {
      const updatedTrips = prevTrips.map(trip =>
        trip.id === tripId ? { ...trip, ...updates } : trip
      );
      console.log('Updated trips:', updatedTrips); // Debug log
      return updatedTrips;
    });
  };

  // Get runner names for filter dropdown
  const availableRunners = [
    { id: '2', name: 'Lokesh Kumar' },
    { id: '3', name: 'Arjun Singh' },
  ];

  // Calculate stats for selected runner
  const todayStats = {
    assigned: activeTrips.filter(trip => trip.status === 'assigned').length,
    completed: completedTrips.length,
    pending: activeTrips.filter(trip => ['assigned', 'in_progress', 'pod_collected', 'couriered'].includes(trip.status)).length,
    kmToday: mockRunnerProfile.todayStats.kmToday, // Keep mock data for KM
  };

  const selectedRunnerData = availableRunners.find(r => r.id === selectedRunner);
  const runnerProfile = {
    ...mockRunnerProfile,
    name: selectedRunnerData?.name || mockRunnerProfile.name,
    phone: user?.phone || mockRunnerProfile.phone,
    zone: user?.zone || mockRunnerProfile.zone,
    city: user?.city || mockRunnerProfile.city,
    todayStats,
  };

  const currentTrips = activeTab === 'active' ? activeTrips : completedTrips;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Runner Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your trip overview.</p>
            </div>
            
            {/* Runner Filter */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <User className="h-5 w-5 text-gray-400" />
              <select
                value={selectedRunner}
                onChange={(e) => setSelectedRunner(e.target.value)}
                className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded-md font-medium text-gray-700"
              >
                {availableRunners.map(runner => (
                  <option key={runner.id} value={runner.id}>{runner.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Runner Profile */}
        <RunnerProfile profile={runnerProfile} />

        {/* Trip Management */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Active Trips</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activeTrips.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {completedTrips.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Trip Content */}
          <div className="p-6">
            {activeTab === 'active' ? (
              <AssignedTrips
                trips={currentTrips}
                onUpdateTrip={handleUpdateTrip}
              />
            ) : (
              <CompletedTrips trips={currentTrips} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Completed Trips Component
interface CompletedTripsProps {
  trips: Trip[];
}

const CompletedTrips: React.FC<CompletedTripsProps> = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed trips</h3>
        <p className="text-gray-500">Completed trips will appear here once delivered.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Completed Trips</h3>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trips.length} trip{trips.length !== 1 ? 's' : ''} completed
        </div>
      </div>

      <div className="grid gap-4">
        {trips.map((trip) => (
          <div key={trip.id} className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{trip.id}</h4>
                  <span className="text-xs text-gray-600">{trip.vehicleNo}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Delivered
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>FO: {trip.foName}</div>
                  <div>LSP: {trip.supplyPocName}</div>
                  <div>Delivered: {trip.deliveryDate ? new Date(trip.deliveryDate).toLocaleDateString() : 'N/A'}</div>
                  {trip.courierPartner && (
                    <div>Courier: {trip.courierPartner} • {trip.awbNumber}</div>
                  )}
                </div>
              </div>
              <Link
                to={`/trip/${trip.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunnerDashboard;