import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Download, AlertTriangle, Image as ImageIcon } from 'lucide-react';
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
  { value: 'collected_from_driver', label: 'Collected from Driver' },
  { value: 'empty', label: '(empty)' },
  { value: 'driver_supplier_issue', label: 'Driver / Supplier Issue' },
  { value: 'couriered', label: 'Couriered' },
  { value: 'vehicle_left', label: 'Vehicle Left' },
  { value: 'collected_from_supplier', label: 'Collected from Supplier' },
  { value: 'location_out_reach', label: 'Location is Out Reach' },
  { value: 'on_site', label: 'On-Site' },
  { value: 'crm_entry_late', label: 'CRM Entry Late' },
  { value: 'collected_from_pune_office', label: 'Collected from Pune Office' },
  { value: 'assigned_to_runner', label: 'Assigned to Runner' },
  { value: 'late_night_unloaded', label: 'Late Night Unloaded' },
  { value: 'waiting_for_unloading', label: 'Waiting for Unloading' },
  { value: 'unloading_issue', label: 'Unloading Issue' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'collected_from_chn_office', label: 'Collected from CHN Office' },
  { value: 'runner_issue', label: 'Runner Issue' },
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
              placeholder="Search by Trip ID, Vehicle No, FO Name, Owner, Route..."
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
            {/* Trip ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip ID
              </label>
              <input
                type="text"
                value={activeFilters.tripId}
                onChange={(e) => handleFilterChange('tripId', e.target.value)}
                placeholder="Enter Trip ID"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

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

            {/* Supplier Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={activeFilters.supplier}
                onChange={(e) => handleFilterChange('supplier', e.target.value)}
                placeholder="Enter supplier name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
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
          </div>

          {/* Special Filters */}
          <div className="flex items-center space-x-6 mb-4">
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-2 flex items-center">
                <ImageIcon className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-800">Show Only Trips with Runner Remarks</span>
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