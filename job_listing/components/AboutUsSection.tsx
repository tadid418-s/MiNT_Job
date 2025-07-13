'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';
import CountUp from './CountUp';

const stats = [
  { value: 15, suffix: '+', label: 'Years Driving\nNational Innovation' },
  { value: 98, suffix: '%', label: 'Stakeholder\nSatisfaction Rate' },
  { value: 200, suffix: '+', label: 'Research Projects\nCoordinated Nationwide' },
  { value: 10000, suffix: '+', label: 'Beneficiaries of Digital\nCapacity Programs' },
];



const AboutUsSection: FC = () => {
  return (
    <section id="about" className="relative w-full py-20 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gray-100/60 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: About Us label, heading, description */}
          <div className="flex-1 w-full max-w-xl mb-12 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-text-primary text-xs rounded-full font-medium">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                About Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
              Ministry of Innovation and Technology
            </h2>
            <p className="text-base md:text-lg text-text-primary max-w-lg">
              The government merged the former Ministry of Science and Technology and the Ministry of Communication and Information Technology to form the Ministry of Innovation and Technology in 2019.
            </p>
          </div>
          {/* Right: Evenly spaced stats, no boxes */}
          <div className="flex-1 w-full flex flex-row flex-wrap justify-center items-center gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center text-center min-w-[120px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#087684] mb-2">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-text-primary text-sm sm:text-base md:text-lg whitespace-pre-line leading-snug font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection; 