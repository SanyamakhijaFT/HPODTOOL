import React from 'react';
import { MapPin, Smartphone, Users, Target, TrendingUp, Award } from 'lucide-react';
import { RunnerProfile as RunnerProfileType } from '../../types';

interface RunnerProfileProps {
  profile: RunnerProfileType;
}

const RunnerProfile: React.FC<RunnerProfileProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Profile Info */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{profile.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{profile.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{profile.zone}, {profile.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Today's Performance
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{profile.todayStats.assigned}</div>
            <div className="text-xs sm:text-sm text-gray-600">Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{profile.todayStats.completed}</div>
            <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{profile.todayStats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{profile.todayStats.kmToday}</div>
            <div className="text-xs sm:text-sm text-gray-600">KM Today</div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Performance Overview
        </h4>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weekly Completed</span>
            <span className="text-base sm:text-lg font-semibold text-gray-900">{profile.performanceStats.weeklyCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Completed</span>
            <span className="text-base sm:text-lg font-semibold text-gray-900">{profile.performanceStats.monthlyCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Success Rate</span>
            <div className="flex items-center">
              <span className="text-base sm:text-lg font-semibold text-green-600">{profile.performanceStats.successRate}%</span>
              <Award className="h-4 w-4 ml-1 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerProfile;