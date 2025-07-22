'use client'

import React, { useState } from 'react'
import { Home, User, ClipboardList, History, FileText, Key } from 'lucide-react'

const EmployeeDashboard = () => {
  const [selectedTask, setSelectedTask] = useState('profile')

  const renderContent = () => {
    switch (selectedTask) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Profile</h2>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Position:</strong> Software Engineer</p>
            <p><strong>Department:</strong> IT</p>
          </div>
        )
      case 'leave':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Submit Leave Request</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Reason"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="date"
                className="w-full px-4 py-2 border rounded"
              />
              <button className="px-4 py-2 bg-[#087684] text-white rounded hover:bg-[#065f6c]">
                Submit
              </button>
            </form>
          </div>
        )
      case 'status':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Leave Request Status</h2>
            <ul className="list-disc ml-4">
              <li>2025-07-05: Approved</li>
              <li>2025-06-20: Pending</li>
            </ul>
          </div>
        )
      case 'history':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Attendance & Leave History</h2>
            <p>June 2025: 20 Present, 2 Leave</p>
            <p>May 2025: 22 Present, 1 Leave</p>
          </div>
        )
      case 'payslip':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Monthly Payslips</h2>
            <ul>
              <li><a href="#" className="text-blue-600 underline">Download June 2025</a></li>
              <li><a href="#" className="text-blue-600 underline">Download May 2025</a></li>
            </ul>
          </div>
        )
      case 'password':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <form className="space-y-4">
              <input type="password" placeholder="Current Password" className="w-full px-4 py-2 border rounded" />
              <input type="password" placeholder="New Password" className="w-full px-4 py-2 border rounded" />
              <button className="px-4 py-2 bg-[#087684] text-white rounded hover:bg-[#065f6c]">
                Update Password
              </button>
            </form>
          </div>
        )
      default:
        return <p>Select a task from the sidebar</p>
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-2xl font-bold text-[#087684] mb-6">Employee</h2>
        <ul className="space-y-4">
          <li><button onClick={() => setSelectedTask('profile')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><User size={18} /> <span>Profile</span></button></li>
          <li><button onClick={() => setSelectedTask('leave')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><ClipboardList size={18} /> <span>Leave Request</span></button></li>
          <li><button onClick={() => setSelectedTask('status')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><ClipboardList size={18} /> <span>Request Status</span></button></li>
          <li><button onClick={() => setSelectedTask('history')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><History size={18} /> <span>Attendance History</span></button></li>
          <li><button onClick={() => setSelectedTask('payslip')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><FileText size={18} /> <span>Payslips</span></button></li>
          <li><button onClick={() => setSelectedTask('password')} className="flex items-center space-x-2 text-gray-700 hover:text-[#087684]"><Key size={18} /> <span>Change Password</span></button></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#087684] mb-6">Employee Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">{renderContent()}</div>
      </main>
    </div>
  )
}

export default EmployeeDashboard
