'use client';

import React, { useState, useEffect } from 'react';

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
}

const LeaveSection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setStatusMessage('You are not logged in. Please login to use leave requests.');
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
          setStatusMessage('Invalid user data in local storage.');
          return;
        }

        const employeeId = parsedUser?.employeeId;
        const role = parsedUser?.role;

        if (!employeeId || !role) {
          setStatusMessage('Employee ID or role not found in user data.');
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setStatusMessage('User not loaded.');
      return;
    }

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
      setStatusMessage(result.message || 'Request submitted.');

      if (res.ok && result.success) {
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveRequests();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to submit leave request.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leave Request Form</h2>

      {statusMessage && (
        <p className="mb-4 text-green-600">{statusMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-1">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Vacation">Vacation</option>
            <option value="Emergency">Emergency</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded md:col-span-2"
          disabled={!user}
        >
          Submit Request
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">My Leave Requests</h3>
        <ul className="space-y-4">
          {leaveRequests.length === 0 && <li>No leave requests found.</li>}
          {leaveRequests.map((req, idx) => (
            <li key={idx} className="border p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <span className="font-medium">Leave Type: {req.leaveType}</span>
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    req.status === 'approved'
                      ? 'bg-green-600'
                      : req.status === 'rejected'
                      ? 'bg-red-600'
                      : 'bg-yellow-500'
                  }`}
                >
                  {req.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Start Date: {req.startDate}</p>
              <p className="text-sm text-gray-600">End Date: {req.endDate}</p>
              <p className="mt-1 text-gray-800 text-sm">Reason: {req.reason}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaveSection;
