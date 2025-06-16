import React, { useState } from 'react';
import { Search, Filter, Image as ImageIcon, MessageSquare, X } from 'lucide-react';

interface RunnerFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: RunnerFilterState) => void;
  activeFilters: RunnerFilterState;
}

export interface RunnerFilterState {
  slotStatus: string;
  supplier: string;
  tripId: string;
  hasRunnerRemarks: boolean;
  hasSlotImage: boolean;
  hasSupplierImage: boolean;
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

const RunnerFilters: React.FC<RunnerFiltersProps> = ({
  onSearch,
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

  const handleFilterChange = (key: keyof RunnerFilterState, value: string | boolean) => {
    onFilterChange({
      ...activeFilters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    const clearedFilters: RunnerFilterState = {
      slotStatus: '',
      supplier: '',
      tripId: '',
      hasRunnerRemarks: false,
      hasSlotImage: false,
      hasSupplierImage: false,
    };
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Trip ID, Supplier, Vehicle No..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
          </div>

          {/* Image and Remarks Filters */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeFilters.hasSlotImage}
                onChange={(e) => handleFilterChange('hasSlotImage', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-2 flex items-center">
                <ImageIcon className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-800">Has Slot Image</span>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={activeFilters.hasSupplierImage}
                onChange={(e) => handleFilterChange('hasSupplierImage', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="ml-2 flex items-center">
                <ImageIcon className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-800">Has Supplier Image</span>
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
                <span className="text-sm font-medium text-purple-800">Has Runner Remarks</span>
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

export default RunnerFilters;