import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import TripTabs from '../components/dashboard/TripTabs';
import SearchAndFilters from '../components/dashboard/SearchAndFilters';
import TripTable from '../components/dashboard/TripTable';
import { mockTrips, mockStats } from '../data/mockData';
import { Trip, FilterState } from '../types';

const ControlTower: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
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

  // Filter trips based on active tab, search query, and filters
  const filteredTrips = trips.filter((trip) => {
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

    return matchesTab && matchesSearch && matchesTripId && matchesSlotStatus && 
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
    a.setAttribute('download', `trips_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedTrips([]);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">POD Control Tower</h1>
        <button
          onClick={handleSyncFromCRM}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing...' : 'Sync from CRM'}
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={mockStats} />

      {/* Trip Management */}
      <div className="bg-white shadow rounded-lg">
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
          />
        </div>
      </div>
    </div>
  );
};

export default ControlTower;