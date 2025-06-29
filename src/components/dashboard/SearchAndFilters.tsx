import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Download, AlertTriangle, MessageSquare, X } from 'lucide-react';
import { FilterState } from '../../types';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
  showRunnerFilter?: boolean;
}

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

const runnerRemarkTypes = [
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

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onRefresh,
  onExport,
  onFilterChange,
  activeFilters,
  showRunnerFilter = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    onFilterChange({
      ...activeFilters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
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
    };
    onFilterChange(clearedFilters);
    setSearchQuery('');
    onSearch('');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      <div className="p-4 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Trip ID, Vehicle No, FO Name, Owner, Route, Supplier..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2.5 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              getActiveFilterCount() > 0
                ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {/* Slot Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slot Status
              </label>
              <select 
                value={activeFilters.slotStatus}
                onChange={(e) => handleFilterChange('slotStatus', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Slot Status</option>
                {slotStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                value={activeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Statuses</option>
                <option value="vehicle_unloaded">Vehicle Unloaded</option>
                <option value="in_progress">In Progress</option>
                <option value="pod_collected">POD Collected</option>
                <option value="couriered">Couriered</option>
                <option value="delivered">Delivered</option>
                <option value="fo_courier">FO Courier</option>
              </select>
            </div>

            {/* Runner Filter - Only show for non-runner view */}
            {showRunnerFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Runner (for assignment)
                </label>
                <select 
                  value={activeFilters.runner}
                  onChange={(e) => handleFilterChange('runner', e.target.value)}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
                >
                  <option value="">Select Runner</option>
                  <option value="Lokesh Kumar">Lokesh Kumar</option>
                  <option value="Arjun Singh">Arjun Singh</option>
                  <option value="Rahul Sharma">Rahul Sharma</option>
                </select>
              </div>
            )}

            {/* Trip Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Owner
              </label>
              <select 
                value={activeFilters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Owners</option>
                <option value="Ajay Kumar">Ajay Kumar</option>
                <option value="Vijay Singh">Vijay Singh</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin
              </label>
              <select 
                value={activeFilters.origin}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Origins</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select 
                value={activeFilters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Destinations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* D Node */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                D Node (Cluster)
              </label>
              <select 
                value={activeFilters.dNode}
                onChange={(e) => handleFilterChange('dNode', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Clusters</option>
                <option value="Delhi North Cluster">Delhi North Cluster</option>
                <option value="Delhi South Cluster">Delhi South Cluster</option>
                <option value="Delhi Central Cluster">Delhi Central Cluster</option>
                <option value="Mumbai West Cluster">Mumbai West Cluster</option>
                <option value="Mumbai Central Cluster">Mumbai Central Cluster</option>
                <option value="Bangalore South Cluster">Bangalore South Cluster</option>
                <option value="Hyderabad Central Cluster">Hyderabad Central Cluster</option>
                <option value="Jaipur East Cluster">Jaipur East Cluster</option>
              </select>
            </div>

            {/* Aging */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aging
              </label>
              <select 
                value={activeFilters.aging}
                onChange={(e) => handleFilterChange('aging', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Ages</option>
                <option value="0-1">0-1 days</option>
                <option value="2-3">2-3 days</option>
                <option value="4-7">4-7 days</option>
                <option value="7+">7+ days (Overdue)</option>
              </select>
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex flex-wrap items-center gap-6 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.hasIssues}
                onChange={(e) => handleFilterChange('hasIssues', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200"
              />
              <div className="ml-3 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm font-medium text-red-800">Show Only Trips with Issues</span>
              </div>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.hasRunnerRemarks}
                onChange={(e) => handleFilterChange('hasRunnerRemarks', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200"
              />
              <div className="ml-3 flex items-center">
                <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm font-medium text-purple-800">Show Only Trips with Runner Remarks</span>
              </div>
            </label>
          </div>

          {/* Clear Filters */}
          {(getActiveFilterCount() > 0 || searchQuery) && (
            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters ({getActiveFilterCount() + (searchQuery ? 1 : 0)})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;