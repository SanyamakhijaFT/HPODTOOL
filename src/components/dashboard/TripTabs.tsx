import React from 'react';

interface Tab {
  id: string;
  name: string;
  count: number;
  description: string;
  color: string;
}

interface TripTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  {
    id: 'all',
    name: 'All Trips',
    count: 680,
    description: 'All trips in system',
    color: 'bg-gray-100 text-gray-800',
  },
  {
    id: 'vehicle_unloaded',
    name: 'Vehicle Unloaded',
    count: 127,
    description: 'Ready for assignment',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'assigned',
    name: 'Assigned',
    count: 45,
    description: 'Assigned to runners',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'in_progress',
    name: 'In Progress',
    count: 32,
    description: 'Collection in progress',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'pod_collected',
    name: 'POD Collected',
    count: 89,
    description: 'Ready for courier',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'couriered',
    name: 'Couriered',
    count: 156,
    description: 'In transit to office',
    color: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'delivered',
    name: 'Delivered',
    count: 203,
    description: 'Received at office',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'fo_courier',
    name: 'FO Courier',
    count: 28,
    description: 'Couriered by FO',
    color: 'bg-cyan-100 text-cyan-800',
  },
];

const TripTabs: React.FC<TripTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm min-w-0 flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{tab.name}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tab.color}`}>
                {tab.count}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TripTabs;