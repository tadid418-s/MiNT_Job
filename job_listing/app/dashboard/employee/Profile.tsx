// Profile.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  employeeId: string;
  email: string;
  role: string;
  position: string;
  department: string;
}

interface ProfileUpdate {
  address: string;
  contactNumber: string;
  otherChanges: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileUpdate, setProfileUpdate] = useState<ProfileUpdate>({
    address: '',
    contactNumber: '',
    otherChanges: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          alert('User not found in localStorage');
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
          alert('Invalid user data in localStorage');
          return;
        }

        const employeeId = parsedUser?.employeeId;
        if (!employeeId) {
          alert('Employee ID not found in stored user data');
          return;
        }

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setUser({
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          employeeId: data.employeeId || 'N/A',
          role: data.role || 'Employee',
          department: data.department || 'N/A',
          position: data.position || 'N/A',
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        alert('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Request sent to HR for profile update.');
    setProfileUpdate({ address: '', contactNumber: '', otherChanges: '' });
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Password change requested.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-700">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">Unable to load user profile.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-green-800">Profile Information</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Employee ID:</strong> {user.employeeId}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Position:</strong> {user.position}</p>
      </div>
      <hr className="my-4" />
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
        <form onSubmit={handlePasswordChangeSubmit} className="space-y-3">
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
        <form onSubmit={handleProfileUpdateSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="New Address"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileUpdate.address}
            onChange={(e) => setProfileUpdate((prev) => ({ ...prev, address: e.target.value }))}
          />
          <input
            type="text"
            placeholder="New Contact Number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileUpdate.contactNumber}
            onChange={(e) => setProfileUpdate((prev) => ({ ...prev, contactNumber: e.target.value }))}
          />
          <textarea
            placeholder="Other change requests (e.g., emergency contact)"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={profileUpdate.otherChanges}
            onChange={(e) => setProfileUpdate((prev) => ({ ...prev, otherChanges: e.target.value }))}
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
  );
};

export default Profile;