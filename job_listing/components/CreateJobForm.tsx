'use client';

import React, { useState } from 'react';

const CreateJobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    deadline: '',
    qualifications: '',
    type: '',
    category: '',
    experiencelevel: '',
    organization: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job');
      }

      setMessage({
        text: 'Job created successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        deadline: '',
        qualifications: '',
        type: '',
        category: '',
        experiencelevel: '',
        organization: ''
      });

    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-3 rounded border ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form fields remain the same as your original */}
      <div>
        <label className="block font-medium text-gray-700">Job Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>
      
      {/* Include all other form fields here */}
      <div>
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700">Department</label>
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Qualifications</label>
          <input
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Experience Level</label>
          <input
            name="experiencelevel"
            value={formData.experiencelevel}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Organization</label>
          <input
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-[#087684] text-white px-4 py-2 rounded hover:bg-[#066469] disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Job'}
      </button>
    </form>
  );
};

export default CreateJobForm;