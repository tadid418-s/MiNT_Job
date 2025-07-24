'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  UserCheck,
  ListOrdered,
  Users,
  LayoutDashboard,
  ClipboardList,
  Building,
  Settings,
  LogOut,
} from 'lucide-react';
import CreateJobForm from '@/components/CreateJobForm';
import { useRouter } from 'next/navigation'; // ✅ correct import
import ManageJobs from '@/components/manageJobs';
import DefineQualification from '@/components/DefineQualification';
import ViewApplicants from '@/components/ViewApplicants';


const menuItems = [
  { label: 'Dashboard Home', icon: LayoutDashboard, action: 'home' },
  { label: 'Create Job Post', icon: Briefcase, action: 'createJob' },
  { label: 'Edit/Delete Job Post', icon: FileText, action: 'manageJobs' },
  { label: 'Define Qualifications', icon: ClipboardList, action: 'qualifications' },
  { label: 'View Applicants', icon: ListOrdered, action: 'viewApplicants' },
  { label: 'Access Resumes', icon: FileText, action: 'resumes' },
  { label: 'Ranked Applicants', icon: UserCheck, action: 'rankedApplicants' },
  { label: 'Applicant Notes/Status', icon: FileText, action: 'notesStatus' },
  { label: 'Employee Data', icon: Users, action: 'employeeData' },
  { label: 'Manage Leave Requests', icon: ClipboardList, action: 'leaveRequests' },
  { label: 'Assign Departments', icon: Building, action: 'assignDepartments' },
  { label: 'Settings', icon: Settings, action: 'settings' },
];

const HRDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter(); // ✅ useRouter instead of next/router

  const renderContent = () => {
    switch (activeSection) {
      case 'createJob':
        return <CreateJobForm />;
      case 'manageJobs':
        return <ManageJobs />;
      case 'qualifications':
        return <DefineQualification />;
      case 'viewApplicants':
        return <ViewApplicants />;
      case 'resumes':
        return <p>Access and download uploaded resumes.</p>;
      case 'rankedApplicants':
        return <p>View screened and ranked applicants based on resumes.</p>;
      case 'notesStatus':
        return <p>Add notes and assign applicant statuses (e.g., shortlisted).</p>;
      case 'employeeData':
        return <p>View employee details across all departments.</p>;
      case 'leaveRequests':
        return <p>Manage leave requests submitted organization-wide.</p>;
      case 'assignDepartments':
        return <p>Assign employees to their respective departments.</p>;
      case 'settings':
        return <p>Manage security settings and preferences.</p>;
      default:
        return <p>Welcome, HR! Here you can oversee your team and job postings.</p>;
    }
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 bg-white border-r shadow-md flex flex-col justify-between">
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#087684] mb-6">HR Dashboard</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.action}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition-all duration-200 ${
                  activeSection === item.action
                    ? 'bg-[#d1f4f4] text-[#087684] font-semibold'
                    : 'text-gray-700 hover:bg-[#e6f7f7]'
                }`}
                onClick={() => setActiveSection(item.action)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-100 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#087684] mb-6">
          {menuItems.find((item) => item.action === activeSection)?.label}
        </h1>
        <div className="text-base text-gray-700 bg-white shadow-sm rounded-xl p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
