'use client';

import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  PlusCircle,
  CreditCard,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard Home', icon: LayoutDashboard, action: 'home' },
  { label: 'Leave Requests', icon: ClipboardList, action: 'leave' },
  { label: 'Calendar Schedule', icon: Calendar, action: 'calendar' },
  { label: 'Payslip', icon: CreditCard, action: 'payslip' }, // Payslip added
  { label: 'Reports', icon: FileText, action: 'reports' },
  { label: 'Settings', icon: Settings, action: 'settings' },
  { label: 'Profile', icon: Users, action: 'profile' }, // Profile added
];

const mockUser = {
  name: 'Manager Jane',
  department: 'Engineering',
};

type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  requestDate: string;
  reason: string;
  status: LeaveStatus;
}

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    leaveType: 'Sick Leave',
    startDate: '2025-07-22',
    endDate: '2025-07-25',
    requestDate: '2025-07-20',
    reason: 'Medical checkup and rest',
    status: 'pending',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    leaveType: 'Annual Leave',
    startDate: '2025-07-28',
    endDate: '2025-08-03',
    requestDate: '2025-07-18',
    reason: 'Vacation with family',
    status: 'pending',
  },
];

export default function ManagerDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [activeTab, setActiveTab] = useState('home');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [calendarForm, setCalendarForm] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Meeting',
  });

  const [scheduledEvents, setScheduledEvents] = useState<
    { id: string; title: string; date: string; time: string; type: string }[]
  >([]);

  const updateLeaveStatus = (id: string, newStatus: LeaveStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeName: mockUser.name,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      requestDate: new Date().toISOString().split('T')[0],
      reason: formData.reason,
      status: 'pending',
    };
    setRequests([...requests, newRequest]);
    setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    setShowLeaveForm(false);
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Manager Dashboard</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => setActiveTab(item.action)}
              className={`flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-green-100 text-gray-700 gap-2 ${
                activeTab === item.action ? 'bg-green-100 font-semibold' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button className="mt-10 flex items-center text-red-600 hover:underline">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 space-y-10">
        {activeTab === 'home' && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-green-800">Manager Dashboard</h1>
                <p className="text-green-600">Welcome back, {mockUser.name}!</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">12</div>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {requests.filter((r) => r.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {requests.filter((r) => r.status === 'approved').length}
                </div>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {requests.filter((r) => r.status === 'rejected').length}
                </div>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'leave' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Leave Requests
              </h2>
              <button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {showLeaveForm ? 'Hide Form' : 'Request Leave'}
              </button>
            </div>

            {showLeaveForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white border p-6 rounded shadow max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select leave type</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="State your reason for the leave..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </form>
            )}

            {requests.length === 0 ? (
              <p className="text-gray-500">No leave requests found.</p>
            ) : (
              <div className="space-y-6 max-w-4xl">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="border rounded p-6 bg-white shadow flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{req.employeeName}</h3>
                        <span
                          className={`flex items-center text-sm px-2 py-1 rounded ${getStatusColor(req.status)} gap-1`}
                        >
                          {getStatusIcon(req.status)}
                          <span className="capitalize">{req.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Leave Type:</strong> {req.leaveType}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Duration:</strong> {req.startDate} to {req.endDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Requested On:</strong> {req.requestDate}
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Reason:</strong> {req.reason}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      {req.status === 'pending' && (
                        <>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            onClick={() => updateLeaveStatus(req.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button
                            className="border border-red-300 text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm flex items-center gap-1"
                            onClick={() => updateLeaveStatus(req.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white p-6 rounded shadow max-w-2xl space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendar Schedule (Manager View)
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newEvent = {
                  id: Date.now().toString(),
                  title: calendarForm.title,
                  date: calendarForm.date,
                  time: calendarForm.time,
                  type: calendarForm.type,
                };
                setScheduledEvents((prev) => [...prev, newEvent]);
                setCalendarForm({ title: '', date: '', time: '', type: 'Meeting' });
              }}
              className="space-y-4 bg-gray-50 p-4 rounded border"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  value={calendarForm.title}
                  onChange={(e) => setCalendarForm({ ...calendarForm, title: e.target.value })}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={calendarForm.date}
                    onChange={(e) => setCalendarForm({ ...calendarForm, date: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={calendarForm.time}
                    onChange={(e) => setCalendarForm({ ...calendarForm, time: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={calendarForm.type}
                  onChange={(e) => setCalendarForm({ ...calendarForm, type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Training">Training</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Schedule
              </button>
            </form>

            {scheduledEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Events</h3>
                <ul className="space-y-3">
                  {scheduledEvents.map((event) => (
                    <li
                      key={event.id}
                      className="border p-3 rounded bg-white shadow flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-green-700">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {event.type} on {event.date} at {event.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payslip' && (
          <div className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Payslip</h2>
            <p className="text-gray-600">Your payslips will be listed here. (Coming soon...)</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Reports</h2>
            <p className="text-gray-600">Reports content goes here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Settings</h2>
            <p className="text-gray-600">Settings content goes here.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded shadow max-w-xl space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Profile Information</h2>

            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {mockUser.name}
              </p>
              <p>
                <strong>Department:</strong> {mockUser.department}
              </p>
              <p>
                <strong>Position:</strong> Team Manager
              </p>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Password change requested.');
                }}
                className="space-y-3"
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Request Password Change
                </button>
              </form>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Request Profile Update</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Request sent to HR for profile update.');
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  placeholder="New Address"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="New Contact Number"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <textarea
                  placeholder="Other change requests (e.g., emergency contact)"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Submit to HR
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
