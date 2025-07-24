'use client';

import React, { useEffect, useState } from 'react';

type Applicant = {
  _id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
};

const statusOptions = ['Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'];

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch applicants');
      const data = await res.json();
      setApplicants(data);
    } catch (err: any) {
      setError(err.message || 'Error loading applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === id ? { ...applicant, status: newStatus } : applicant
        )
      );
    } catch (err) {
      alert('Status update failed');
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!applicants.length) return <p>No applicants found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border border-gray-300 px-3 py-2">Name</th>
            <th className="border border-gray-300 px-3 py-2">Email</th>
            <th className="border border-gray-300 px-3 py-2">Job Title</th>
            <th className="border border-gray-300 px-3 py-2">Status</th>
            <th className="border border-gray-300 px-3 py-2">Applied Date</th>
            <th className="border border-gray-300 px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(({ _id, fullName, email, jobTitle, status, appliedAt }) => (
            <tr key={_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{fullName}</td>
              <td className="border border-gray-300 px-3 py-2">{email}</td>
              <td className="border border-gray-300 px-3 py-2">{jobTitle}</td>
              <td className="border border-gray-300 px-3 py-2">
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(_id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {new Date(appliedAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {/* You can add more action buttons here (e.g., view resume) */}
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => alert(`Viewing resume for ${fullName}`)}
                >
                  View Resume
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplicants;
