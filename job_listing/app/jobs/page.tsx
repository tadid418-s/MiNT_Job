'use client'

import Navbar from '../../components/Navbar';
import JobFilters from '../../components/JobFilters';
import JobCard from '../../components/JobCard';
import { jobs } from '../../data/jobs';
import { useState } from 'react';
import Footer from '../../components/Footer';

export default function JobsPage() {
  const [sort, setSort] = useState('Popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleJobs, setVisibleJobs] = useState(6);
  const [viewMoreCount, setViewMoreCount] = useState(0);

  // Filter jobs based on search term and remove Ministry of Innovation/MiNT references
  const filteredJobs = jobs
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.organization.toLowerCase().includes('ministry of innovation') &&
      !job.organization.toLowerCase().includes('mint')
    )
    .map(job => ({
      ...job,
      organization: job.organization.replace(/Ministry of Innovation|MiNT/gi, 'Innovation Hub')
    }));

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sort === 'Newest') {
      return b.id - a.id;
    } else if (sort === 'Popular') {
      return a.id - b.id; // For demo, using ID as popularity
    }
    return 0;
  });

  const handleViewMore = () => {
    const newCount = viewMoreCount + 1;
    setViewMoreCount(newCount);
    
    if (newCount === 3) {
      // Show all jobs on third click
      setVisibleJobs(sortedJobs.length);
    } else {
      // Show 6 more jobs
      setVisibleJobs(prev => Math.min(prev + 6, sortedJobs.length));
    }
  };

  const handleShowLess = () => {
    setViewMoreCount(0);
    setVisibleJobs(6);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filter above
  };

  const displayedJobs = sortedJobs.slice(0, visibleJobs);
  const hasMoreJobs = visibleJobs < sortedJobs.length;

  return (
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden pt-28">
      <Navbar />
      {/* Header Section */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Search</h1>
          <p className="text-lg text-gray-500 mb-8">Search for your desired job matching your skills</p>

          {/* Search Bar - Only Job Title */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-0 bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-2 mb-8" role="search" aria-label="Job search">
            <div className="flex items-center flex-1 px-3">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Enter Job title" 
                className="w-full bg-transparent outline-none text-base text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-[#087684] hover:bg-[#087684]/90 text-white font-semibold px-8 py-3 rounded-xl ml-0 md:ml-4 mt-2 md:mt-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2">Search</button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 pb-16 flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <JobFilters />
        </div>
        {/* Job Results */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">All Jobs</span>
              <span className="text-sm text-gray-400">({filteredJobs.length})</span>
            </div>
            <div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#087684]">
                <option value="Popular">Popular</option>
                <option value="Newest">Newest</option>
              </select>
            </div>
          </div>
          {/* Job Cards Grid */}
          <div className="flex flex-col space-y-6">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} {...job} department={job.organization} id={job.id} />
            ))}
          </div>
          {/* View More/Show Less Buttons */}
          <div className="flex justify-center mt-10 gap-4">
            {hasMoreJobs && viewMoreCount < 3 && (
              <button 
                onClick={handleViewMore}
                className="text-[#087684] font-medium hover:underline text-lg focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2"
              >
                {viewMoreCount === 2 ? 'View All' : 'View More'}
              </button>
            )}
            {(viewMoreCount >= 3 || visibleJobs > 6) && (
              <button 
                onClick={handleShowLess}
                className="text-gray-600 font-medium hover:underline text-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 