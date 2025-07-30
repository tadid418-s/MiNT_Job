'use client';

import React, { useState, useEffect } from 'react';
import ReportUpload from './ReportUpload';
import Settings from './Settings';
import Profile from './Profile';
import LeaveSection from './LeaveSection';
import CalendarSchedule from './CalendarSchedule';
import Payslip from './Payslip';

type Tab = 'dashboard' | 'report' | 'profile' | 'settings' | 'leave' | 'CalendarSchedule' | 'Payslip';

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
          <div className="mt-10 text-gray-700">
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome, Manager {managerName} 👋</h1>
            <p className="text-center mb-6">Staff in <strong>{managerDepartment}</strong> Department:</p>

            {loading ? (
              <p className="text-center text-gray-500">Loading staff...</p>
            ) : staffList.length === 0 ? (
              <p className="text-center text-red-500 font-medium">No staff found in this department.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {staffList.map((staff) => (
                  <div key={staff._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <h3 className="text-xl font-semibold text-blue-700">{staff.name}</h3>
                    <p className="text-sm text-gray-700">ID: {staff.employeeId}</p>
                    <p className="text-sm text-gray-700">Department: {staff.department}</p>
                    {staff.email && <p className="text-sm text-gray-700">Email: {staff.email}</p>}
                    {staff.role && <p className="text-sm text-gray-700">Role: {staff.role}</p>}
                    {staff.status && <p className="text-sm text-gray-700">Status: {staff.status}</p>}
                  </div>
                ))}
              </div>
            )}
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Manager Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {['dashboard', 'report', 'leave', 'profile', 'CalendarSchedule', 'Payslip', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`text-left px-4 py-2 rounded ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {tab === 'dashboard' ? 'Home' : tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default ManagerDashboard;
