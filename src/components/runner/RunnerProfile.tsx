import React from 'react';
import { MapPin, Smartphone, Target, TrendingUp, Award, Clock, CheckCircle, Package, Navigation } from 'lucide-react';
import { RunnerProfile as RunnerProfileType } from '../../types';

interface RunnerProfileProps {
  profile: RunnerProfileType;
}

const RunnerProfile: React.FC<RunnerProfileProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Profile Info */}
      <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{profile.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span>{profile.zone}, {profile.city}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              profile.gpsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                profile.gpsActive ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              GPS {profile.gpsActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Today's Performance
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{profile.todayStats.assigned}</div>
            <div className="text-xs text-blue-700 font-medium flex items-center justify-center">
              <Package className="h-3 w-3 mr-1" />
              Assigned
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{profile.todayStats.completed}</div>
            <div className="text-xs text-green-700 font-medium flex items-center justify-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">{profile.todayStats.pending}</div>
            <div className="text-xs text-orange-700 font-medium flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{profile.todayStats.kmToday}</div>
            <div className="text-xs text-purple-700 font-medium flex items-center justify-center">
              <Navigation className="h-3 w-3 mr-1" />
              KM Today
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Overview
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weekly</span>
            <span className="text-lg font-semibold text-gray-900">{profile.performanceStats.weeklyCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly</span>
            <span className="text-lg font-semibold text-gray-900">{profile.performanceStats.monthlyCompleted}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Success Rate</span>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-green-600">{profile.performanceStats.successRate}%</span>
              <Award className="h-4 w-4 ml-1 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerProfile;