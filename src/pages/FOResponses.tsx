import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Phone, 
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Download,
  User,
  Package,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { mockFOResponses } from '../data/mockData';
import { FOResponse } from '../types';

const statusConfig = {
  pending_verification: {
    label: 'Pending Verification',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
  },
};

const FOResponses: React.FC = () => {
  const [responses, setResponses] = useState<FOResponse[]>(mockFOResponses);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredResponses = responses.filter((response) => {
    const matchesSearch = !searchQuery || 
      response.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.foName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.courierService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.docketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || response.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedResponseData = responses.find(r => r.id === selectedResponse);

  const handleVerifyResponse = async (responseId: string, status: 'verified' | 'rejected', notes: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResponses(prevResponses =>
      prevResponses.map(response =>
        response.id === responseId 
          ? { 
              ...response, 
              status, 
              verifiedBy: 'Current User', // In real app, get from auth context
              verificationNotes: notes 
            }
          : response
      )
    );
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    const csvContent = filteredResponses.map(response => 
      `${response.tripId},${response.foName},${response.courierService},${response.docketNumber},${response.status},${new Date(response.submittedAt).toLocaleDateString()}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `fo_responses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">FO Responses</h1>
        <p className="text-gray-600">Review and verify courier information submitted by Field Officers</p>
      </div>

      {/* Search and Filters */}
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
                placeholder="Search by Trip ID, FO Name, Courier Service, Docket Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responses List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              FO Responses ({filteredResponses.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredResponses.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No responses found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No FO responses match your search criteria.
                </p>
              </div>
            ) : (
              filteredResponses.map((response) => {
                const isSelected = selectedResponse === response.id;
                const statusInfo = statusConfig[response.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={response.id}
                    onClick={() => setSelectedResponse(response.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 hover:bg-blue-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{response.tripId}</h4>
                          <span className="text-xs text-gray-600">{response.foName}</span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {response.courierService} • {response.docketNumber}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {response.foPhone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Submitted: {new Date(response.submittedAt).toLocaleDateString()}
                          </div>
                          {response.remarks && (
                            <div className="flex items-start">
                              <FileText className="h-3 w-3 mr-1 mt-0.5" />
                              <span className="line-clamp-2">{response.remarks}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                        
                        <div className="text-xs text-gray-500">
                          {new Date(response.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Verification Info */}
                    {(response.status === 'verified' || response.status === 'rejected') && response.verifiedBy && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {response.status === 'verified' ? 'Verified' : 'Rejected'} by: {response.verifiedBy}
                          </div>
                          {response.verificationNotes && (
                            <div className="mt-1 text-gray-500">
                              Notes: {response.verificationNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Response Details */}
        <div className="bg-white shadow rounded-lg">
          {selectedResponseData ? (
            <ResponseDetails 
              response={selectedResponseData} 
              onVerify={handleVerifyResponse}
              loading={loading}
            />
          ) : (
            <div className="p-6">
              <div className="text-center text-gray-500">
                <div className="text-sm">Select a response from the list to view details</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResponseDetailsProps {
  response: FOResponse;
  onVerify: (responseId: string, status: 'verified' | 'rejected', notes: string) => void;
  loading: boolean;
}

const ResponseDetails: React.FC<ResponseDetailsProps> = ({ response, onVerify, loading }) => {
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const statusInfo = statusConfig[response.status];
  const StatusIcon = statusInfo.icon;

  const handleVerify = (status: 'verified' | 'rejected') => {
    onVerify(response.id, status, verificationNotes);
    setShowVerificationForm(false);
    setVerificationNotes('');
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Response Details - {response.tripId}
      </h3>

      {/* Response Information */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Trip ID:</span>
            <div className="text-gray-900">{response.tripId}</div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">FO Name:</span>
            <div className="text-gray-900">{response.foName}</div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">FO Phone:</span>
            <div className="text-gray-900">{response.foPhone}</div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Submitted:</span>
            <div className="text-gray-900">{new Date(response.submittedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Courier Service:</span>
              <div className="text-gray-900 font-semibold">{response.courierService}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Docket Number:</span>
              <div className="text-gray-900 font-semibold">{response.docketNumber}</div>
            </div>
          </div>
        </div>

        {response.remarks && (
          <div className="border-t border-gray-200 pt-4">
            <span className="text-gray-600 font-medium">Remarks:</span>
            <div className="text-gray-900 mt-1">{response.remarks}</div>
          </div>
        )}

        {/* Current Status */}
        <div className="border-t border-gray-200 pt-4">
          <span className="text-gray-600 font-medium">Status:</span>
          <div className="mt-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      {response.status === 'pending_verification' && (
        <div className="border-t border-gray-200 pt-6">
          {!showVerificationForm ? (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowVerificationForm(true)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Response
              </button>
              <button
                onClick={() => setShowVerificationForm(true)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Response
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Verification Notes</h4>
              
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add verification notes (optional)..."
                rows={3}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => handleVerify('verified')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                
                <button
                  onClick={() => handleVerify('rejected')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Rejecting...' : 'Reject'}
                </button>
                
                <button
                  onClick={() => {
                    setShowVerificationForm(false);
                    setVerificationNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show verification result if completed */}
      {(response.status === 'verified' || response.status === 'rejected') && response.verifiedBy && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Verification Result</h4>
          <div className={`p-4 rounded-lg ${
            response.status === 'verified' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-start">
              <StatusIcon className={`h-5 w-5 mr-3 mt-0.5 ${
                response.status === 'verified' ? 'text-green-400' : 'text-red-400'
              }`} />
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  response.status === 'verified' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {response.status === 'verified' ? 'Response Verified' : 'Response Rejected'}
                </div>
                <div className={`text-sm mt-1 ${
                  response.status === 'verified' ? 'text-green-700' : 'text-red-700'
                }`}>
                  By: {response.verifiedBy}
                </div>
                {response.verificationNotes && (
                  <div className={`text-sm mt-2 ${
                    response.status === 'verified' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <strong>Notes:</strong> {response.verificationNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FOResponses;