import React, { useState } from 'react';
import { Search, Filter, MessageSquare, X } from 'lucide-react';

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
    setSearchQuery('');
    onSearch('');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search trips by ID, FO, LSP, vehicle..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
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
            className={`inline-flex items-center px-4 py-3 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
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
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Slot Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Runner Remarks Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark Type
              </label>
              <select 
                value={activeFilters.runnerRemarksType}
                onChange={(e) => handleFilterChange('runnerRemarksType', e.target.value)}
                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3 transition-all duration-200"
              >
                <option value="">All Remark Types</option>
                {runnerRemarkTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Remarks Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.hasRunnerRemarks}
                onChange={(e) => handleFilterChange('hasRunnerRemarks', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200"
              />
              <div className="ml-3 flex items-center">
                <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm font-medium text-purple-800">Has Runner Remarks</span>
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
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RunnerFilters;