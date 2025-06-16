import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Download, AlertTriangle, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { FilterState } from '../../types';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
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
  'Other',
];

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onRefresh,
  onExport,
  onFilterChange,
  activeFilters,
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
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Trip ID, Vehicle No, FO Name, Owner, Route, Supplier..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Slot Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slot Status
              </label>
              <select 
                value={activeFilters.slotStatus}
                onChange={(e) => handleFilterChange('slotStatus', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="vehicle_unloaded">Vehicle Unloaded</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="pod_collected">POD Collected</option>
                <option value="couriered">Couriered</option>
                <option value="delivered">Delivered</option>
                <option value="fo_courier">FO Courier</option>
              </select>
            </div>

            {/* Runner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Runner
              </label>
              <select 
                value={activeFilters.runner}
                onChange={(e) => handleFilterChange('runner', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Runners</option>
                <option value="Lokesh Kumar">Lokesh Kumar</option>
                <option value="Arjun Singh">Arjun Singh</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Secondary Runner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Runner
              </label>
              <select 
                value={activeFilters.secondaryRunner}
                onChange={(e) => handleFilterChange('secondaryRunner', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Secondary Runners</option>
                <option value="Lokesh Kumar">Lokesh Kumar</option>
                <option value="Arjun Singh">Arjun Singh</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Trip Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Owner
              </label>
              <select 
                value={activeFilters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Owners</option>
                <option value="Ajay Kumar">Ajay Kumar</option>
                <option value="Vijay Singh">Vijay Singh</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select 
                value={activeFilters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Runner Remarks Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Runner Remarks Type
              </label>
              <select 
                value={activeFilters.runnerRemarksType}
                onChange={(e) => handleFilterChange('runnerRemarksType', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Remark Types</option>
                {runnerRemarkTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          </div>

          {/* Special Filters */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeFilters.hasIssues}
                onChange={(e) => handleFilterChange('hasIssues', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div className="ml-2 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm font-medium text-red-800">Show Only Trips with Issues</span>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeFilters.hasRunnerRemarks}
                onChange={(e) => handleFilterChange('hasRunnerRemarks', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="ml-2 flex items-center">
                <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm font-medium text-purple-800">Show Only Trips with Runner Remarks</span>
              </div>
            </label>
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all filters ({getActiveFilterCount()})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;