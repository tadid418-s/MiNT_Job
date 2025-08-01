'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  FileUp,
  UserCheck,
  Calendar,
  DollarSign,
  Settings as SettingsIcon,
  User,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Bell,
  Plus,
  Building2,
  Badge,
  Activity,
  Target,
  Award,
  Briefcase,
  MessageSquare,
  Search,
  Filter,
  Edit,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReportUpload from './ReportUpload';
import Settings from './Settings';
import Profile from './Profile';
import LeaveSection from './LeaveSection';
import CalendarSchedule from './CalendarSchedule';
import Payslip from './Payslip';

type Tab = 'dashboard' | 'report' | 'profile' | 'settings' | 'leave' | 'CalendarSchedule' | 'Payslip';

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

interface Staff {
  _id: string;
  name: string;
  employeeId: string;
  department: string;
  email?: string;
  role?: string;
  status?: string;
}

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [managerName, setManagerName] = useState('');
  const [managerDepartment, setManagerDepartment] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [teamPerformance, setTeamPerformance] = useState(95);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview and quick actions' },
    { id: 'report', label: 'Reports', icon: FileUp, description: 'Upload and manage reports' },
    { id: 'leave', label: 'Leave Management', icon: UserCheck, description: 'Manage team leave requests' },
    { id: 'CalendarSchedule', label: 'Calendar', icon: Calendar, description: 'Schedule and events' },
    { id: 'Payslip', label: 'Payroll', icon: DollarSign, description: 'Payroll management' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Your profile settings' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, description: 'Dashboard preferences' }
  ];

  useEffect(() => {
    const fetchManagerAndStaff = async () => {
      const employeeId = localStorage.getItem('employee_id');
      if (!employeeId) return;

      try {
        // 1. Get manager's data
        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        const { user } = await res.json();
        if (user) {
          setManagerName(user.name);
          setManagerDepartment(user.department);

          // 2. Fetch staff in same department
          const staffRes = await fetch('/api/get-employees-by-department', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ department: user.department }),
          });

          const staffData = await staffRes.json();
          setStaffList(staffData.employees || []);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerAndStaff();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#087684] to-[#066466] rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {managerName}! 👋
                  </h1>
                  <p className="text-[#B8E6EE] text-lg mb-4">
                    Here's your team overview for the {managerDepartment} Department
                  </p>
                  <div className="flex items-center gap-6 text-[#B8E6EE]">
                    <div className="flex items-center gap-2">
                      <Building2 size={20} />
                      <span>{managerDepartment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span>{staffList.length} Team Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge size={20} />
                      <span>Manager</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <Users size={40} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Team Members</p>
                    <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{staffList.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-[#087684]" />
                  </div>
                </div>
              </TiltedCard>

              <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Pending Leaves</p>
                    <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{pendingLeaves}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-[#D97706]" />
                  </div>
                </div>
              </TiltedCard>

              <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Upcoming Events</p>
                    <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{upcomingEvents}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-[#2563EB]" />
                  </div>
                </div>
              </TiltedCard>

              <TiltedCard className="p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl" intensity={8}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Team Performance</p>
                    <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{teamPerformance}%</p>
                  </div>
                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-[#059669]" />
                  </div>
                </div>
              </TiltedCard>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#1C1C1E] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('leave')}
                  className="flex items-center space-x-3 p-4 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                    <UserCheck size={20} className="text-[#D97706]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#1C1C1E]">Review Leave Requests</div>
                    <div className="text-sm text-[#6B7280]">Approve or reject pending requests</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('CalendarSchedule')}
                  className="flex items-center space-x-3 p-4 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-[#2563EB]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#1C1C1E]">Schedule Meeting</div>
                    <div className="text-sm text-[#6B7280]">Add events to team calendar</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className="flex items-center space-x-3 p-4 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                    <FileUp size={20} className="text-[#087684]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#1C1C1E]">Upload Report</div>
                    <div className="text-sm text-[#6B7280]">Submit department reports</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Team Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1C1C1E]">Team Members</h3>
                    <p className="text-sm text-[#6B7280]">{managerDepartment} Department Staff</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                      <Filter size={14} className="inline mr-1" />
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm bg-[#087684] text-white rounded-lg hover:bg-[#066466] transition-colors">
                      <Plus size={14} className="inline mr-1" />
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
            {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#087684]"></div>
                  </div>
            ) : staffList.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-[#9CA3AF] mb-4" />
                    <h4 className="text-lg font-medium text-[#1C1C1E] mb-2">No Team Members Found</h4>
                    <p className="text-[#6B7280]">No staff members found in the {managerDepartment} department.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffList.map((staff) => (
                      <SpotlightCard key={staff._id} className="p-4 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                              <User size={20} className="text-[#087684]" />
                            </div>
                            <div>
                              <div className="font-medium text-[#1C1C1E]">{staff.name}</div>
                              <div className="text-sm text-[#6B7280]">{staff.role || 'Employee'}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-[#6B7280] hover:text-[#087684] transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-[#6B7280] hover:text-[#087684] transition-colors">
                              <MessageSquare size={16} />
                            </button>
                            <button className="p-1 text-[#6B7280] hover:text-[#087684] transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                          <div className="flex items-center justify-between text-sm text-[#6B7280]">
                            <span>ID: {staff.employeeId}</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#1C1C1E] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'leave', message: 'John Doe submitted leave request', time: '2 hours ago', status: 'pending' },
                  { type: 'report', message: 'Monthly department report uploaded', time: '1 day ago', status: 'completed' },
                  { type: 'meeting', message: 'Team standup meeting scheduled', time: '2 days ago', status: 'completed' },
                  { type: 'approval', message: 'Leave request approved for Jane Smith', time: '3 days ago', status: 'completed' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#FAFBFC] rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'leave' ? 'bg-[#FEF3C7]' :
                      activity.type === 'report' ? 'bg-[#F0F9FF]' :
                      activity.type === 'meeting' ? 'bg-[#DBEAFE]' :
                      'bg-[#D1FAE5]'
                    }`}>
                      {activity.type === 'leave' && <Clock size={16} className="text-[#D97706]" />}
                      {activity.type === 'report' && <FileUp size={16} className="text-[#087684]" />}
                      {activity.type === 'meeting' && <Calendar size={16} className="text-[#2563EB]" />}
                      {activity.type === 'approval' && <CheckCircle size={16} className="text-[#059669]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#1C1C1E]">{activity.message}</div>
                      <div className="text-sm text-[#6B7280]">{activity.time}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'report':
        return <ReportUpload />;
      case 'profile':
        return <Profile />;
      case 'CalendarSchedule':
        return <CalendarSchedule />;
      case 'Payslip':
        return <Payslip />;
      case 'settings':
        return <Settings />;
      case 'leave':
        return <LeaveSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white shadow-lg border-r border-[#E5E7EB] flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#087684] to-[#066466] rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E]">Manager Portal</h2>
              <p className="text-sm text-[#6B7280]">Team Management Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#087684] to-[#066466] text-white shadow-lg' 
                    : 'text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6]'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`${isActive ? 'text-white' : 'text-[#9CA3AF] group-hover:text-[#087684]'} transition-colors`}
                />
                <div className="flex-1">
                  <div className={`font-medium ${isActive ? 'text-white' : 'text-[#1C1C1E]'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white/70' : 'text-[#6B7280]'}`}>
                    {item.description}
                  </div>
                </div>
            </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="flex items-center space-x-3 p-3 bg-[#F8FAFB] rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-[#087684] to-[#066466] rounded-lg flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-[#1C1C1E]">{managerName}</div>
              <div className="text-sm text-[#6B7280]">{managerDepartment} Manager</div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#1C1C1E]">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
              <span>•</span>
              <span>{sidebarItems.find(item => item.id === activeTab)?.description}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
