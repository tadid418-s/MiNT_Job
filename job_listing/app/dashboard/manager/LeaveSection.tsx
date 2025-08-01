'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building2,
  Search,
  Filter,
  Eye,
  MessageSquare,
  MoreHorizontal,
  UserCheck,
  AlertTriangle,
  CalendarDays,
  FileText
} from 'lucide-react';

interface User {
  name?: string;
  employeeId: string;
  email?: string;
  role: string;
  position?: string;
  department?: string;
}

// Tilted Card Component
const TiltedCard = ({ children, className = "", intensity = 10 }: { children: React.ReactNode, className?: string, intensity?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -intensity;
      const rotateY = (x - centerX) / centerX * intensity;
      
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }}
    >
      {children}
    </div>
  );
};

// Spotlight Card Component (keeping for backward compatibility)
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(8, 118, 132, 0.2)" }: { children: React.ReactNode, className?: string, spotlightColor?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
      divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spotlight-color': spotlightColor
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface LeaveRequestData {
  _id?: string;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  submittedAt?: string;
  department?: string;
}

const LeaveSection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequestData[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setStatusMessage('You are not logged in. Please login to access leave management.');
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const employeeId = parsedUser?.employeeId;

        if (!employeeId) {
          setStatusMessage('Employee ID not found in user data.');
          return;
        }

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        setUser({
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          employeeId: data.employeeId || employeeId,
          role: data.role || 'Manager',
          department: data.department || 'N/A',
          position: data.position || 'Manager',
        });

        // Fetch all leave requests for the manager's department
        await fetchDepartmentLeaveRequests(data.department);
      } catch (error) {
        console.error('Failed to fetch manager data:', error);
        setStatusMessage('Failed to load manager data.');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, statusFilter, searchTerm]);

  const fetchDepartmentLeaveRequests = async (department: string) => {
    try {
      // This would need to be a new API endpoint that fetches all leave requests for a department
      const res = await fetch('/api/leave/department-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeaveRequests(data.leaves || []);
      } else {
        // Fallback to mock data for demonstration
        setLeaveRequests([
          {
            _id: '1',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            leaveType: 'Annual',
            startDate: '2024-02-15',
            endDate: '2024-02-20',
            reason: 'Family vacation',
            status: 'pending',
            submittedAt: '2024-02-01',
            department: department
          },
          {
            _id: '2',
            employeeId: 'EMP002',
            employeeName: 'Jane Smith',
            leaveType: 'Sick',
            startDate: '2024-02-10',
            endDate: '2024-02-12',
            reason: 'Medical appointment',
            status: 'pending',
            submittedAt: '2024-02-05',
            department: department
          },
          {
            _id: '3',
            employeeId: 'EMP003',
            employeeName: 'Mike Johnson',
            leaveType: 'Emergency',
            startDate: '2024-01-25',
            endDate: '2024-01-26',
            reason: 'Family emergency',
            status: 'approved',
            submittedAt: '2024-01-20',
            department: department
          },
          {
            _id: '4',
            employeeId: 'EMP004',
            employeeName: 'Sarah Wilson',
            leaveType: 'Vacation',
            startDate: '2024-01-15',
            endDate: '2024-01-18',
            reason: 'Personal vacation',
            status: 'rejected',
            submittedAt: '2024-01-10',
            department: department
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch department leave requests:', error);
      setStatusMessage('Failed to load leave requests.');
    }
  };

  const filterRequests = () => {
    let filtered = leaveRequests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // This would need to be implemented in the API
      const res = await fetch('/api/leave/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          status: newStatus,
          managerId: user?.employeeId 
        }),
      });

      if (res.ok) {
        // Update local state
        setLeaveRequests(prev => 
          prev.map(req => 
            req._id === requestId ? { ...req, status: newStatus } : req
          )
        );
        setStatusMessage(`Leave request ${newStatus} successfully.`);
      } else {
        // For demo purposes, update locally
        setLeaveRequests(prev => 
          prev.map(req => 
            req._id === requestId ? { ...req, status: newStatus } : req
          )
        );
        setStatusMessage(`Leave request ${newStatus} successfully.`);
      }
    } catch (error) {
      console.error('Failed to update leave status:', error);
      setStatusMessage('Failed to update leave status.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087684] to-[#066466] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Leave Management 📋
            </h1>
            <p className="text-[#B8E6EE] text-lg">
              Review and manage leave requests from your team members
            </p>
            <div className="flex items-center gap-6 mt-4 text-[#B8E6EE]">
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <span>{user?.department} Department</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck size={20} />
                <span>{filteredRequests.length} Requests</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <CalendarDays size={40} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800">{statusMessage}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Total Requests</p>
              <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{leaveRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-[#087684]" />
            </div>
          </div>
        </TiltedCard>

        <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Pending</p>
              <p className="text-2xl font-bold text-[#1C1C1E] mt-1">
                {leaveRequests.filter(req => req.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-[#D97706]" />
            </div>
          </div>
        </TiltedCard>

        <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Approved</p>
              <p className="text-2xl font-bold text-[#1C1C1E] mt-1">
                {leaveRequests.filter(req => req.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-[#059669]" />
            </div>
          </div>
        </TiltedCard>

        <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Rejected</p>
              <p className="text-2xl font-bold text-[#1C1C1E] mt-1">
                {leaveRequests.filter(req => req.status === 'rejected').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
              <XCircle size={24} className="text-[#DC2626]" />
            </div>
          </div>
        </TiltedCard>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087684] focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087684] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Filter size={16} className="text-[#6B7280]" />
              <span className="text-[#6B7280]">More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
          <h3 className="text-lg font-semibold text-[#1C1C1E]">Leave Requests</h3>
          <p className="text-sm text-[#6B7280]">Review and manage employee leave requests</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#087684]"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays size={48} className="mx-auto text-[#9CA3AF] mb-4" />
            <h4 className="text-lg font-medium text-[#1C1C1E] mb-2">No Leave Requests Found</h4>
            <p className="text-[#6B7280]">
              {searchTerm || statusFilter !== 'all' 
                ? 'No requests match your current filters.' 
                : 'No leave requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <SpotlightCard key={request._id} className="p-6 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                        <User size={24} className="text-[#087684]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-[#1C1C1E]">
                            {request.employeeName || 'Unknown Employee'}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#6B7280] mb-3">
                          <div>
                            <span className="font-medium">Employee ID:</span>
                            <div>{request.employeeId}</div>
                          </div>
                          <div>
                            <span className="font-medium">Leave Type:</span>
                            <div className="capitalize">{request.leaveType}</div>
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>
                            <div>{calculateDuration(request.startDate, request.endDate)} days</div>
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span>
                            <div>{new Date(request.submittedAt || '').toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
                          <span className="text-sm font-medium text-[#374151]">Reason:</span>
                          <p className="text-sm text-[#6B7280] mt-1">{request.reason}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request._id!, 'approved')}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request._id!, 'rejected')}
                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <button className="p-2 text-[#6B7280] hover:text-[#087684] transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-[#6B7280] hover:text-[#087684] transition-colors">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-2 text-[#6B7280] hover:text-[#087684] transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveSection;
