'use client'

import { useState } from 'react';

const jobTypeOptions = [
  { label: 'All', count: 2567 },
  { label: 'Full-Time', count: 450 },
  { label: 'Part-Time', count: 145 },
  { label: 'Internship', count: 85 },
  { label: 'Contract', count: 12 },
];
const jobFunctionOptions = [
  { label: 'Marketing', count: 21 },
  { label: 'Engineering', count: 45 },
  { label: 'Design', count: 71 },
  { label: 'Sales', count: 24 },
  { label: 'Customer Service', count: 109 },
];
const experienceOptions = [
  { label: 'Fresher/Entry-Level', count: 265 },
  { label: 'Junior', count: 41 },
  { label: 'Mid-Level', count: 212 },
  { label: 'Senior', count: 12 },
  { label: 'Lead/Managerial', count: 24 },
  { label: 'Director/Executive', count: 10 },
];

const JobFilters = () => {
  const [expanded, setExpanded] = useState<string[]>(['Job Type']);

  const handleToggle = (section: string) => {
    setExpanded((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleExpandAll = () => {
    setExpanded(['Job Type', 'Job Functions', 'Experience Level']);
  };
  const handleCollapseAll = () => {
    setExpanded([]);
  };
  const handleClearAll = () => {
    setExpanded([]);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 md:mb-0 md:mr-8 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-text-primary">Filter</span>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-blue-600 focus:outline-none"
          onClick={handleClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>
      {/* Job Type */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-2 focus:outline-none"
          onClick={() => handleToggle('Job Type')}
          aria-expanded={expanded.includes('Job Type')}
        >
          Job Type
          <span>{expanded.includes('Job Type') ? '-' : '+'}</span>
        </button>
        {expanded.includes('Job Type') && (
          <div className="flex flex-col gap-2">
            {jobTypeOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" className="accent-purple-600" />
                <span>{opt.label}</span>
                <span className="ml-auto text-xs text-gray-400">({opt.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Job Functions */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-2 focus:outline-none"
          onClick={() => handleToggle('Job Functions')}
          aria-expanded={expanded.includes('Job Functions')}
        >
          Job Functions
          <span>{expanded.includes('Job Functions') ? '-' : '+'}</span>
        </button>
        {expanded.includes('Job Functions') && (
          <div className="flex flex-col gap-2">
            {jobFunctionOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" className="accent-purple-600" />
                <span>{opt.label}</span>
                <span className="ml-auto text-xs text-gray-400">({opt.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Experience Level */}
      <div className="mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-2 focus:outline-none"
          onClick={() => handleToggle('Experience Level')}
          aria-expanded={expanded.includes('Experience Level')}
        >
          Experience Level
          <span>{expanded.includes('Experience Level') ? '-' : '+'}</span>
        </button>
        {expanded.includes('Experience Level') && (
          <div className="flex flex-col gap-2">
            {experienceOptions.map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" className="accent-purple-600" />
                <span>{opt.label}</span>
                <span className="ml-auto text-xs text-gray-400">({opt.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Expand/Collapse all */}
      <div className="flex gap-2">
        <button
          type="button"
          className="text-xs text-purple-700 font-medium hover:underline focus:outline-none"
          onClick={handleExpandAll}
          aria-label="Expand all filter sections"
        >
          Expand all
        </button>
        {expanded.length === 3 && (
          <button
            type="button"
            className="text-xs text-gray-600 font-medium hover:underline focus:outline-none"
            onClick={handleCollapseAll}
            aria-label="Collapse all filter sections"
          >
            Show Less
          </button>
        )}
      </div>
    </aside>
  );
};

export default JobFilters; 