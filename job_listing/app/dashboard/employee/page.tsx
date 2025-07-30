'use client';

import React, { useState, useEffect } from 'react';
import ReportUpload from './ReportUpload';
import Settings from './Settings';
import Profile from './Profile';
import LeaveSection from './LeaveSection';

type Tab = 'dashboard' | 'report' | 'profile' | 'settings' | 'leave';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const employeeId = localStorage.getItem('employee_id');
      if (!employeeId) return;

      try {
        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        const data = await res.json();
        if (data.user) {
          setUserName(data.user.name);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    fetchUser();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="text-center mt-10 text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Welcome, {userName} 👋</h1>
            <p>This is your employee dashboard. Use the sidebar to navigate.</p>
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Employee Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-left px-4 py-2 rounded ${
              activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`text-left px-4 py-2 rounded ${
              activeTab === 'report' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Upload Report
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`text-left px-4 py-2 rounded ${
              activeTab === 'leave' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Leave
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-left px-4 py-2 rounded ${
              activeTab === 'profile' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`text-left px-4 py-2 rounded ${
              activeTab === 'settings' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default EmployeeDashboard;
