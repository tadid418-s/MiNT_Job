'use client';

import React, { useState } from 'react';
import {
  Users,
  ClipboardCheck,
  FileCheck2,
  CalendarClock,
  User,
  History,
  Download,
  Settings,
  BookCheck,
  BadgeCheck,
  FileText,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard Home', icon: User, action: 'home' },

  // Manager-specific
  { label: 'Department Employees', icon: Users, action: 'departmentEmployees' },
  { label: 'View Leave Requests', icon: ClipboardCheck, action: 'leaveRequests' },
  { label: 'Approve/Reject Requests', icon: BadgeCheck, action: 'approveReject' },
  { label: 'Schedule Meetings', icon: CalendarClock, action: 'meetings' },
  { label: 'Schedule Training', icon: BookCheck, action: 'training' },
  { label: 'View Employee Profiles', icon: FileText, action: 'employeeProfiles' },

  // Employee-level features
  { label: 'My Profile', icon: User, action: 'myProfile' },
  { label: 'Submit Leave Request', icon: ClipboardCheck, action: 'submitLeave' },
  { label: 'Leave Request Status', icon: FileCheck2, action: 'leaveStatus' },
  { label: 'Attendance & Leave History', icon: History, action: 'leaveHistory' },
  { label: 'Payslips', icon: Download, action: 'payslips' },
  { label: 'Settings / Password', icon: Settings, action: 'settings' },
];

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'departmentEmployees':
        return <p>List of employees in your department.</p>;
      case 'leaveRequests':
        return <p>View leave requests submitted by your employees.</p>;
      case 'approveReject':
        return <p>Approve or reject employee leave requests.</p>;
      case 'meetings':
        return <p>Schedule meetings for your department.</p>;
      case 'training':
        return <p>Arrange training sessions for your team.</p>;
      case 'employeeProfiles':
        return <p>View employee profiles under your supervision.</p>;

      // Employee-level
      case 'myProfile':
        return <p>View your own profile (name, position, department, etc.).</p>;
      case 'submitLeave':
        return <p>Submit a leave request.</p>;
      case 'leaveStatus':
        return <p>View status of submitted leave requests.</p>;
      case 'leaveHistory':
        return <p>View attendance and leave history.</p>;
      case 'payslips':
        return <p>Download monthly payslips.</p>;
      case 'settings':
        return <p>Change your password or update preferences.</p>;

      default:
        return <p>Welcome, Manager! Here you can manage your team and access employee functionalities.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-4 space-y-4">
        <h2 className="text-2xl font-bold text-[#087684] mb-6">Manager Dashboard</h2>
        {menuItems.map((item) => (
          <button
            key={item.action}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left hover:bg-[#e6f7f7] ${
              activeSection === item.action ? 'bg-[#d1f4f4] text-[#087684] font-semibold' : 'text-gray-700'
            }`}
            onClick={() => setActiveSection(item.action)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#087684] mb-4">
          {menuItems.find((item) => item.action === activeSection)?.label}
        </h1>
        <div className="text-lg text-gray-700">{renderContent()}</div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
