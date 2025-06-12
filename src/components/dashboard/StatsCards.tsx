import React from 'react';
import { 
  Truck, 
  Users, 
  Clock, 
  CheckCircle, 
  Package, 
  Send, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Stats } from '../../types';

interface StatsCardsProps {
  stats: Stats[];
}

const iconMap = {
  Truck,
  Users,
  Clock,
  CheckCircle,
  Package,
  Send,
  AlertTriangle,
};

const colorMap = {
  orange: 'bg-orange-100 text-orange-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  red: 'bg-red-100 text-red-600',
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        const colorClass = colorMap[stat.color as keyof typeof colorMap];
        
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-3 rounded-md ${colorClass}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;