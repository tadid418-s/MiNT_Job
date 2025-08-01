'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Calendar, 
  User, 
  Settings as SettingsIcon, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Upload,
  LogOut,
  Building2,
  Badge,
  Bell,
  Plus
} from 'lucide-react';

// Spotlight Card Component
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
import ReportUpload from './ReportUpload';
import Settings from './Settings';
import Profile from './Profile';
import LeaveSection from './LeaveSection';

type Tab = 'dashboard' | 'report' | 'profile' | 'settings' | 'leave';

interface User {
  name: string;
  employeeId: string;
  email: string;
  role: string;
  department: string;
  position: string;
}

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const employeeId = parsedUser?.employeeId;
        if (!employeeId) return;

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        const data = await res.json();
        if (data) {
          setUser({
            name: data.name || 'N/A',
            employeeId: data.employeeId || 'N/A',
            email: data.email || 'N/A',
            role: data.role || 'Employee',
            department: data.department || 'N/A',
            position: data.position || 'N/A',
          });
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('employee_id');
    window.location.href = '/login';
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'View your overview and recent activities' },
    { id: 'report', label: 'Reports', icon: FileText, description: 'Upload and manage your reports' },
    { id: 'leave', label: 'Leave Requests', icon: Calendar, description: 'Manage your time off requests' },
    { id: 'profile', label: 'Profile', icon: User, description: 'View and update your profile' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, description: 'Configure your account settings' },
  ];

  const statsCards = [
    {
      title: 'Pending Requests',
      value: '2',
      icon: Clock,
      spotlightColor: 'rgba(245, 158, 11, 0.2)',
      bgColor: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]'
    },
    {
      title: 'Approved Leaves',
      value: '8',
      icon: CheckCircle,
      spotlightColor: 'rgba(39, 174, 96, 0.2)',
      bgColor: 'bg-[#F0FDF4]',
      iconColor: 'text-[#059669]'
    },
    {
      title: 'Reports Submitted',
      value: '12',
      icon: TrendingUp,
      spotlightColor: 'rgba(8, 118, 132, 0.2)',
      bgColor: 'bg-[#F0F9FF]',
      iconColor: 'text-[#087684]'
    },
    {
      title: 'This Month Performance',
      value: '94%',
      icon: Activity,
      spotlightColor: 'rgba(147, 51, 234, 0.2)',
      bgColor: 'bg-[#F3E8FF]',
      iconColor: 'text-[#7C3AED]'
    }
  ];

  const quickActions = [
    {
      title: 'Submit Report',
      description: 'Upload your latest work report',
      icon: Upload,
      action: () => setActiveTab('report'),
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Request Leave',
      description: 'Apply for time off',
      icon: Calendar,
      action: () => setActiveTab('leave'),
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Update Profile',
      description: 'Manage your information',
      icon: User,
      action: () => setActiveTab('profile'),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  const recentActivities = [
    { type: 'report', message: 'Monthly report approved', time: '2 hours ago', status: 'success' },
    { type: 'leave', message: 'Leave request submitted', time: '1 day ago', status: 'pending' },
    { type: 'profile', message: 'Profile updated', time: '3 days ago', status: 'success' },
    { type: 'report', message: 'Weekly report submitted', time: '5 days ago', status: 'success' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#087684] to-[#066466] rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Employee'}! 👋
                  </h1>
                  <p className="text-[#B8E6EE] text-lg">
                    Ready to make today productive? Here's your overview.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-[#B8E6EE]">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      <span>{user?.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge size={16} />
                      <span>{user?.position}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <User size={40} className="text-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards with Spotlight Effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <SpotlightCard key={card.title} spotlightColor={card.spotlightColor}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">{card.title}</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                      <card.icon size={20} className={card.iconColor} />
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <h4 className="text-lg font-semibold text-[#1C1C1E]">Quick Actions</h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={action.action}
                      className="p-6 border border-[#E5E7EB] rounded-xl text-left transition-all hover:border-[#087684] hover:shadow-md group"
                    >
                      <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#087684] transition-colors">
                        <action.icon size={20} className="text-[#087684] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold text-[#1C1C1E] mb-2">{action.title}</h3>
                      <p className="text-[#6B7280] text-sm">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB]">
                <h4 className="text-lg font-semibold text-[#1C1C1E]">Recent Activities</h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-[#F8FAFB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-[#F0FDF4]' : 
                        activity.status === 'pending' ? 'bg-[#FEF3C7]' : 'bg-[#F9FAFB]'
                      }`}>
                        {activity.status === 'success' ? 
                          <CheckCircle size={16} className="text-[#059669]" /> :
                          activity.status === 'pending' ?
                          <Clock size={16} className="text-[#D97706]" /> :
                          <XCircle size={16} className="text-[#6B7280]" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1C1C1E]">{activity.message}</p>
                        <p className="text-sm text-[#6B7280]">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'report':
        return <ReportUpload />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'leave':
        return <LeaveSection />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F7F8] font-['Inter']">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[250px] bg-[#0A1D1A] text-white flex flex-col shadow-lg"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1A2F2A]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#087684] rounded-lg flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">MiNT Portal</h2>
              <p className="text-xs text-[#9CA3AF]">Employee Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
          <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                activeTab === item.id 
                  ? 'bg-[#087684] text-white shadow-md' 
                  : 'text-[#D1D5DB] hover:bg-[#1A2F2A] hover:text-white'
              }`}
              onClick={() => setActiveTab(item.id as Tab)}
            >
              <span className="flex-shrink-0"><item.icon size={20} /></span>
              <span className="font-medium text-sm">{item.label}</span>
          </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1A2F2A]">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A2F2A]">
            <div className="w-8 h-8 bg-[#087684] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Employee'}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{user?.employeeId || 'N/A'}</p>
            </div>
            <button onClick={handleLogout} className="text-[#9CA3AF] hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
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
              <span>{sidebarItems.find(item => item.id === activeTab)?.description || 'Employee dashboard overview'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-[#6B7280] hover:text-[#1C1C1E] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E74C3C] rounded-full"></span>
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

export default EmployeeDashboard;