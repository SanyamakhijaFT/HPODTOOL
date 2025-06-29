import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import TripTabs from '../components/dashboard/TripTabs';
import SearchAndFilters from '../components/dashboard/SearchAndFilters';
import TripTable from '../components/dashboard/TripTable';
import { mockTrips } from '../data/mockData';
import { Trip, FilterState } from '../types';

const ControlTower: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeView, setActiveView] = useState<'runner_assigned' | 'non_runner'>('runner_assigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    origin: '',
    destination: '',
    vehicle: '',
    runner: '',
    secondaryRunner: '',
    priority: '',
    status: '',
    owner: '',
    hasIssues: false,
    aging: '',
    dNode: '',
    slotStatus: '',
    supplier: '',
    tripId: '',
    hasRunnerRemarks: false,
    runnerRemarksType: '',
  });

  // Filter trips based on view, active tab, search query, and filters
  const filteredTrips = trips.filter((trip) => {
    // View filter - Runner Assigned vs Non-Runner
    const matchesView = activeView === 'runner_assigned' 
      ? trip.runner // Has a runner assigned
      : !trip.runner; // No runner assigned

    // Tab filter
    const matchesTab = activeTab === 'all' || trip.status === activeTab;
    
    // Search filter
    const matchesSearch = !searchQuery || 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.foName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.supplyPocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.owner && trip.owner.toLowerCase().includes(searchQuery.toLowerCase()));

    // Advanced filters
    const matchesTripId = !filters.tripId || trip.id.toLowerCase().includes(filters.tripId.toLowerCase());
    const matchesSlotStatus = !filters.slotStatus || trip.slotStatus === filters.slotStatus;
    const matchesSupplier = !filters.supplier || trip.supplyPocName.toLowerCase().includes(filters.supplier.toLowerCase());
    const matchesOrigin = !filters.origin || trip.origin === filters.origin;
    const matchesDestination = !filters.destination || trip.destination === filters.destination;
    const matchesVehicle = !filters.vehicle || trip.vehicleNo.toLowerCase().includes(filters.vehicle.toLowerCase());
    const matchesRunner = !filters.runner || 
      (filters.runner === 'Unassigned' ? !trip.runner : trip.runner === filters.runner);
    const matchesSecondaryRunner = !filters.secondaryRunner || 
      (filters.secondaryRunner === 'Unassigned' ? !trip.secondaryRunner : trip.secondaryRunner === filters.secondaryRunner);
    const matchesPriority = !filters.priority || trip.priority === filters.priority;
    const matchesStatus = !filters.status || trip.status === filters.status;
    const matchesOwner = !filters.owner || 
      (filters.owner === 'Unassigned' ? !trip.owner : trip.owner === filters.owner);
    const matchesIssues = !filters.hasIssues || trip.issueReported;
    const matchesDNode = !filters.dNode || trip.dNode === filters.dNode;
    const matchesRunnerRemarks = !filters.hasRunnerRemarks || (trip.runnerRemarks && trip.runnerRemarks.length > 0);
    
    // Runner remarks type filter
    const matchesRunnerRemarksType = !filters.runnerRemarksType || 
      (trip.runnerRemarks && trip.runnerRemarks.some(remark => remark.type === filters.runnerRemarksType));
    
    // Aging filter
    let matchesAging = true;
    if (filters.aging) {
      switch (filters.aging) {
        case '0-1':
          matchesAging = trip.aging <= 1;
          break;
        case '2-3':
          matchesAging = trip.aging >= 2 && trip.aging <= 3;
          break;
        case '4-7':
          matchesAging = trip.aging >= 4 && trip.aging <= 7;
          break;
        case '7+':
          matchesAging = trip.aging > 7;
          break;
      }
    }

    return matchesView && matchesTab && matchesSearch && matchesTripId && matchesSlotStatus && 
           matchesSupplier && matchesOrigin && matchesDestination && 
           matchesVehicle && matchesRunner && matchesSecondaryRunner && matchesPriority && 
           matchesStatus && matchesOwner && matchesIssues && matchesAging && 
           matchesDNode && matchesRunnerRemarks && matchesRunnerRemarksType;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = filteredTrips.map(trip => 
      `${trip.id},${trip.vehicleNo},${trip.status},${trip.foName},${trip.origin},${trip.destination},${trip.owner || 'Unassigned'},${trip.runner || 'Unassigned'},${trip.slotStatus},${trip.runnerRemarks?.length || 0}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `trips_${activeView}_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSyncFromCRM = async () => {
    setLoading(true);
    // Simulate CRM sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // In a real app, you'd fetch new data here
  };

  const handleSelectTrip = (tripId: string) => {
    setSelectedTrips(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTrips(filteredTrips.map(trip => trip.id));
    } else {
      setSelectedTrips([]);
    }
  };

  const handleUpdateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId ? { ...trip, ...updates } : trip
      )
    );
  };

  // Clear selection when tab or view changes
  useEffect(() => {
    setSelectedTrips([]);
  }, [activeTab, activeView]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">POD Control Tower</h1>
              <p className="text-gray-600 mt-1">Manage and track POD collection across all trips</p>
            </div>
            <button
              onClick={handleSyncFromCRM}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing...' : 'Sync from CRM'}
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveView('runner_assigned')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeView === 'runner_assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Runner Assigned Trips</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {trips.filter(t => t.runner).length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveView('non_runner')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeView === 'non_runner'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Non-Runner Trips</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {trips.filter(t => !t.runner).length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Trip Tabs */}
          <div className="px-6 pt-6">
            <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Search and Filters */}
          <div className="p-6">
            <SearchAndFilters
              onSearch={handleSearch}
              onRefresh={handleRefresh}
              onExport={handleExport}
              onFilterChange={handleFilterChange}
              activeFilters={filters}
              showRunnerFilter={activeView === 'non_runner'}
            />
          </div>

          {/* Trip Table */}
          <div className="pb-6">
            <TripTable
              trips={filteredTrips}
              selectedTrips={selectedTrips}
              onSelectTrip={handleSelectTrip}
              onSelectAll={handleSelectAll}
              onUpdateTrip={handleUpdateTrip}
              viewType={activeView}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTower;