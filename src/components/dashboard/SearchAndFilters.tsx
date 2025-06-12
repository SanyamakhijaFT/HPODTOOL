import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Download, AlertTriangle } from 'lucide-react';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  origin: string;
  destination: string;
  vehicle: string;
  runner: string;
  priority: string;
  status: string;
  owner: string;
  hasIssues: boolean;
  aging: string;
  dNode: string;
}

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
      priority: '',
      status: '',
      owner: '',
      hasIssues: false,
      aging: '',
      dNode: '',
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aging
              </label>
              <select 
                value={activeFilters.aging}
                onChange={(e) => handleFilterChange('aging', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Ages</option>
                <option value="0-1">0-1 days</option>
                <option value="2-3">2-3 days</option>
                <option value="4-7">4-7 days</option>
                <option value="7+">7+ days (Overdue)</option>
              </select>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                D Node (Cluster)
              </label>
              <select 
                value={activeFilters.dNode}
                onChange={(e) => handleFilterChange('dNode', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
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