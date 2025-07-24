'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Job = {
  _id: string;
  title: string;
  organization?: string;
  department?: string;
  location?: string;
  createdAt?: string;
};

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!jobs.length) return <p>No jobs found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="py-2 px-3">Title</th>
            <th className="py-2 px-3">Organization</th>
            <th className="py-2 px-3">Location</th>
            <th className="py-2 px-3">Created</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-b">
              <td className="py-2 px-3">{job.title}</td>
              <td className="py-2 px-3">{job.organization || '-'}</td>
              <td className="py-2 px-3">{job.location || '-'}</td>
              <td className="py-2 px-3">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}
              </td>
              <td className="py-2 px-3 flex gap-2">
                <Link
                  href={`/jobs/edit/${job._id}`}
                  className="px-2 py-1 rounded bg-blue-600 text-white"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-2 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
