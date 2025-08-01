'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  CalendarDays,
  User,
  Building2,
  FileText,
  Send,
  History,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface User {
  name?: string;
  employeeId: string;
  email?: string;
  role: string;
  position?: string;
  department?: string;
}

interface LeaveRequestData {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  submittedDate?: string;
  approvedBy?: string;
}

interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
  emergency: number;
}

const LeaveSection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('request');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock leave balance data
  const [leaveBalance] = useState<LeaveBalance>({
    annual: 15,
    sick: 10,
    casual: 8,
    emergency: 3
  });

  // Mock calendar data for leave visualization
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setStatusMessage('You are not logged in. Please login to use leave requests.');
          setMessageType('error');
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
          setStatusMessage('Invalid user data in local storage.');
          setMessageType('error');
          return;
        }

        const employeeId = parsedUser?.employeeId;
        const role = parsedUser?.role;

        if (!employeeId || !role) {
          setStatusMessage('Employee ID or role not found in user data.');
          setMessageType('error');
          return;
        }

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch user: ${res.status} ${text}`);
        }

        const data = await res.json();

        setUser({
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          employeeId: data.employeeId || employeeId,
          role: data.role || role,
          department: data.department || 'N/A',
          position: data.position || 'N/A',
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setStatusMessage('Failed to load user data.');
        setMessageType('error');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch('/api/leave/my-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: user?.employeeId }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch leave requests');
      }

      const data = await res.json();
      setLeaveRequests(data.leaves || []);
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
      setStatusMessage('Failed to load leave requests.');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setStatusMessage('User not loaded.');
      setMessageType('error');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setStatusMessage('End date must be after start date.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leave/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user.employeeId,
          leaveType,
          startDate,
          endDate,
          reason,
        }),
      });

      const result = await res.json();
      setStatusMessage(result.message || 'Leave request submitted successfully!');
      setMessageType(res.ok ? 'success' : 'error');

      if (res.ok && result.success) {
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveRequests();
        setActiveTab('history');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to submit leave request.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateLeaveDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const filteredRequests = leaveRequests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status.toLowerCase() === filterStatus;
    const matchesSearch = req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const leaveTypeOptions = [
    { value: 'Annual', label: 'Annual Leave', color: 'bg-blue-100 text-blue-800', available: leaveBalance.annual },
    { value: 'Sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800', available: leaveBalance.sick },
    { value: 'Casual', label: 'Casual Leave', color: 'bg-green-100 text-green-800', available: leaveBalance.casual },
    { value: 'Emergency', label: 'Emergency Leave', color: 'bg-orange-100 text-orange-800', available: leaveBalance.emergency },
    { value: 'Vacation', label: 'Vacation Leave', color: 'bg-purple-100 text-purple-800', available: 0 }
  ];

  const tabs = [
    { id: 'request', label: 'New Request', icon: Plus },
    { id: 'balance', label: 'Leave Balance', icon: CalendarDays },
    { id: 'history', label: 'Request History', icon: History },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087684] to-[#066466] rounded-xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
            <p className="text-[#B8E6EE]">Request time off and track your leave balance</p>
          </div>
        </div>
      </div>

      {/* User Info Quick View */}
      {user && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F0F9FF] rounded-full flex items-center justify-center">
              <User size={24} className="text-[#087684]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{user.employeeId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#087684] border-b-2 border-[#087684]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* New Request Tab */}
          {activeTab === 'request' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Plus size={24} className="text-[#087684]" />
                <h2 className="text-2xl font-bold text-gray-900">Submit Leave Request</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#087684] focus:border-[#087684]"
            required
          >
                      <option value="">Select leave type</option>
                      {leaveTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} ({option.available} days available)
                        </option>
                      ))}
          </select>
        </div>

        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className={`p-3 rounded-lg border ${
                      calculateLeaveDays() > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-green-600" />
                        <span className="font-medium text-gray-900">
                          {calculateLeaveDays()} day{calculateLeaveDays() !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#087684] focus:border-[#087684]"
            required
          />
        </div>

        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#087684] focus:border-[#087684]"
            required
          />
                  </div>
        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#087684] focus:border-[#087684] h-32"
                    placeholder="Please provide a brief explanation for your leave request..."
            required
          />
        </div>

        <button
          type="submit"
                  disabled={loading || !user}
                  className="w-full bg-[#087684] text-white py-3 px-6 rounded-lg hover:bg-[#066466] disabled:bg-[#6B7280] transition-colors font-semibold flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Leave Request
                    </>
                  )}
        </button>
      </form>
            </motion.div>
          )}

          {/* Leave Balance Tab */}
          {activeTab === 'balance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays size={24} className="text-[#087684]" />
                <h2 className="text-2xl font-bold text-gray-900">Leave Balance Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leaveTypeOptions.map((type, index) => (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{type.label}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${type.color}`}>
                        {type.available} days
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Available</span>
                        <span>{type.available} days</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#087684] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((type.available / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leave Calendar View */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leave Schedule</h3>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 text-center py-8">
                    Calendar view for upcoming leaves will be displayed here
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Request History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History size={24} className="text-[#087684]" />
                  <h2 className="text-2xl font-bold text-gray-900">Leave Request History</h2>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-[#087684]"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#087684] focus:border-[#087684]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No leave requests found</p>
                    <p className="text-gray-500">Submit your first leave request to get started</p>
                  </div>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{req.leaveType} Leave</h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(req.status)}`}>
                              {getStatusIcon(req.status)}
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Start Date</p>
                              <p className="font-medium">{new Date(req.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">End Date</p>
                              <p className="font-medium">{new Date(req.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">
                                {Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="text-gray-800">{req.reason}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : messageType === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              {messageType === 'success' && <CheckCircle size={20} />}
              {messageType === 'error' && <AlertCircle size={20} />}
              {messageType === 'info' && <AlertCircle size={20} />}
              <p className="font-medium">{statusMessage}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveSection;
