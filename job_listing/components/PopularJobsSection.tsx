'use client';
import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { jobs } from '../data/jobs';

// Get the first 4 jobs from the jobs data and format them for the popular jobs section
const postedAgoList = ["2 days ago", "1 day ago", "3 days ago", "5 hours ago"];
const popularJobs = jobs.slice(0, 4).map((job, idx) => ({
  id: job.id,
  title: job.title,
  organization: 'Innovation Hub',
  department: job.category,
  location: job.location,
  type: job.type,
  postedAgo: postedAgoList[idx % postedAgoList.length],
  description: job.description || `Join our team as a ${job.title} and contribute to our mission of innovation and excellence.`,
  applyUrl: `/apply/${job.id}`,
  detailsUrl: `/jobs`,
}));

const cardVariants = (i: number) => ({
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      type: 'spring' as const,
      stiffness: 60,
    },
  },
});

const PopularJobsSection: FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = popularJobs.length;

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  };
  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  };

  return (
    <section className="relative w-full py-20 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gray-100/60 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        <div className="max-w-3xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Popular Jobs</h2>
            <p className="text-text-primary text-base md:text-lg max-w-2xl mx-auto">
              Explore some of the most sought-after opportunities at Innovation Hub. Join our team and help drive innovation and transformation across Ethiopia.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous job"
              className="absolute left-1 sm:left-2 md:-left-12 z-20 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow p-2 md:p-3 hover:bg-[#087684]/10 transition-colors disabled:opacity-40"
              tabIndex={0}
              disabled={total <= 1}
            >
              <ChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-[#087684] transition-colors" />
            </button>
            {/* Card Slider */}
            <div className="w-full flex items-center justify-center px-4 sm:px-8 md:px-0">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={popularJobs[current].title}
                  custom={direction}
                  initial={{ opacity: 0, x: 80 * direction, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80 * direction, scale: 0.97 }}
                  transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
                  className="bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-start justify-between w-full max-w-md mx-auto px-6 py-8 min-h-[320px] border border-gray-200 backdrop-blur-md"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">{popularJobs[current].title}</h3>
                      <span className="text-xs text-gray-400">{popularJobs[current].postedAgo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span>{popularJobs[current].department}</span>
                      <span className="mx-1">•</span>
                      <span>{popularJobs[current].location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{popularJobs[current].type}</span>
                    </div>
                    <p className="text-text-primary text-base mb-6 line-clamp-3">{popularJobs[current].description}</p>
                  </div>
                  <div className="flex gap-3 mt-auto w-full">
                    <Link
                      href={popularJobs[current].applyUrl}
                      className="bg-[#087684] text-white font-semibold px-5 py-2.5 rounded-lg border border-[#087684] hover:bg-[#087684]/90 transition-all duration-200 flex-1 text-center text-base shadow"
                      tabIndex={0}
                      aria-label={`Apply now for ${popularJobs[current].title}`}
                    >
                      Apply Now
                    </Link>
                    <Link
                      href={popularJobs[current].detailsUrl}
                      className="bg-white text-[#222] border border-[#222] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 hover:border-[#444] hover:text-[#444] transition-all duration-200 flex-1 text-center text-base shadow"
                      tabIndex={0}
                      aria-label={`View details for ${popularJobs[current].title}`}
                    >
                      More Details
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Right Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next job"
              className="absolute right-1 sm:right-2 md:-right-12 z-20 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow p-2 md:p-3 hover:bg-[#087684]/10 transition-colors disabled:opacity-40"
              tabIndex={0}
              disabled={total <= 1}
            >
              <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-[#087684] transition-colors" />
            </button>
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {popularJobs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${current === idx ? 'bg-[#087684] border-[#087684]' : 'bg-gray-200 border-gray-300'}`}
                aria-label={`Go to job ${idx + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularJobsSection; 