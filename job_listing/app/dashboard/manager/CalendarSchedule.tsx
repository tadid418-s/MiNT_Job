'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

interface User {
  employeeId: string;
  name: string;
  department: string;
}

export default function CalendarSchedule() {
  const [user, setUser] = useState<User | null>(null);
  const [calendarForm, setCalendarForm] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Meeting',
  });
  const [scheduledEvents, setScheduledEvents] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) throw new Error('No user in localStorage');

        const parsed = JSON.parse(stored);
        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: parsed.employeeId }),
        });

        if (!res.ok) throw new Error('Failed to fetch user info');

        const data = await res.json();
        setUser({
          employeeId: data.employeeId,
          name: data.name,
          department: data.department,
        });
      } catch (err) {
        console.error(err);
        setMessage('Failed to load user info');
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage('User not loaded');
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      ...calendarForm,
      ...user,
    };

    setScheduledEvents((prev) => [...prev, newEvent]);
    setCalendarForm({ title: '', date: '', time: '', type: 'Meeting' });

    try {
      const res = await fetch('/api/calendar/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) throw new Error('Failed to save event');

      setMessage('Event scheduled successfully');
    } catch (err) {
      console.error(err);
      setMessage('Error saving event');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Calendar Schedule (Manager View)
      </h2>

      {user ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
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
                        {event.type} by {event.name} ({event.department})<br />
                        On {event.date} at {event.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500">Loading user data...</p>
      )}

      {message && <p className="text-sm mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
