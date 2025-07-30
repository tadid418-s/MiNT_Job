'use client';

import React, { useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface User {
  employeeId: string;
  name: string;
  department: string;
}

const ReportUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('User not found in localStorage');
        }

        const parsedUser = JSON.parse(storedUser);
        const employeeId = parsedUser?.employeeId;

        if (!employeeId) throw new Error('Employee ID missing');

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) throw new Error('Failed to fetch user info');

        const data = await res.json();
        setUser({
          employeeId: data.employeeId,
          name: data.name,
          department: data.department,
        });
      } catch (err) {
        console.error('User load error:', err);
        setMessage('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setMessage('File or user info missing.');
      return;
    }

    const formData = new FormData();
    formData.append('report', file);
    formData.append('employeeId', user.employeeId);
    formData.append('name', user.name);
    formData.append('department', user.department);

    try {
      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('Report uploaded successfully.');
        setFile(null);
      } else {
        setMessage('Failed to upload report.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('An error occurred during upload.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading user info...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-red-600">
        Cannot upload report. User not found.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Report</h2>

      <div className="mb-4 text-sm text-gray-700">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Employee ID:</strong> {user.employeeId}</p>
        <p><strong>Department:</strong> {user.department}</p>
      </div>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <UploadCloud size={18} /> Upload
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default ReportUpload;
