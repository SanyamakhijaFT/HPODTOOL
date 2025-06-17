import React, { useState } from 'react';
import { Search, Filter, MessageSquare } from 'lucide-react';

interface RunnerFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: RunnerFilterState) => void;
  activeFilters: RunnerFilterState;
}

export interface RunnerFilterState {
  slotStatus: string;
  hasRunnerRemarks: boolean;
  runnerRemarksType: string;
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

            {/* Runner Remarks Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark Type
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
          </div>

          {/* Remarks Filter */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
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