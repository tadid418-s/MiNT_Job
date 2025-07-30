'use client';

import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/settings/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const { message } = await res.json();
        setMessage(message || 'Error changing password.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600">Current Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600">New Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600">Confirm New Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;
