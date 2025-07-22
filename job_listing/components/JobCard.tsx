'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface JobCardProps {
  id: string;
  title: string;
  department: string;
  type?: string;
  location?: string;
  description?: string;
  postedAgo?: string;
  experienceLevel?: string;
  deadline?: string;
  category?: string;
  link?: string;
}

const typeColors: Record<string, string> = {
  'Full-time': 'bg-green-100 text-green-700 border-green-200',
  'Internship': 'bg-blue-100 text-blue-700 border-blue-200',
  'Part-time': 'bg-purple-100 text-purple-700 border-purple-200',
};

const JobCard: FC<JobCardProps> = ({
  title,
  department,
  type = 'Full-time',
  location = 'Remote',
  description = 'No description provided.',
  postedAgo = 'Posted recently',
  experienceLevel = 'ENTRY',
  deadline = 'No deadline',
  category = 'General',
  link = '',
  id,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleApplyNow = () => {
    console.log(`Applying for ${title}`);
    setIsModalOpen(false);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') handleCloseModal();
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 w-full group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        tabIndex={0}
        aria-label={`Job: ${title} at ${department}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
          <h2 className="text-xl font-bold text-text-primary" title={title}>{title}</h2>
          <span className="text-xs text-gray-400 md:text-right">{postedAgo}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-3 mb-2">
          <span className="text-text-primary font-medium flex items-center gap-1">
            {department}
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Verified">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="text-text-primary flex items-center gap-1 md:ml-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
        </div>

        <div className="mb-2 text-text-primary text-sm">
          We're seeking a <span className="font-semibold">{title}</span> to {description}
          {link && (
            <>
              <br />
              <span className="font-semibold">Full JD & Application Form: </span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all hover:text-blue-800"
              >
                {link}
              </a>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-200">{category}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{type}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
          <div className="flex flex-row flex-wrap gap-6 md:gap-8 mb-2 md:mb-0">
            <div className="flex flex-col items-start">
              <span className="text-gray-700 font-semibold text-base">{experienceLevel}</span>
              <span className="text-xs text-gray-400">Experience level</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 font-semibold text-base">{deadline}</span>
              <span className="text-xs text-gray-400">Deadline</span>
            </div>
          </div>

          <div className="flex flex-row gap-2 md:ml-auto">
            <button
              onClick={handleViewDetails}
              className="bg-white text-[#222] border border-[#222] font-medium text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 hover:border-[#444] hover:text-[#444] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#444] focus:ring-offset-2 w-24 text-center cursor-pointer"
              tabIndex={0}
              aria-label={`View details for ${title}`}
            >
              View Details
            </button>

            <Link
              href={`/apply/${id}`}
              className="bg-[#087684] text-white font-medium text-sm px-3 py-1.5 rounded-full border border-[#087684] hover:bg-[#087684]/90 hover:border-[#087684] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2 w-24 text-center flex items-center justify-center"
              tabIndex={0}
              aria-label={`Apply for ${title}`}
            >
              Apply Now
            </Link>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              {/* ... similar to above, omitted for brevity, you can keep your existing modal content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p>{description}</p>
                {/* Add more detailed job info here */}
                <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-gray-300 rounded">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;
