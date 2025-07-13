'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ForgotPasswordModal from './ForgotPasswordModal';
import FeedbackModal from './FeedbackModal';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About us' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/hr-team', label: 'HR Team' },
  { href: '/#faqs', label: 'FAQs' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseForgot = () => {
    setIsForgotOpen(false);
  };
  const handleForgotSubmit = () => {
    setIsForgotOpen(false);
    setIsFeedbackOpen(true);
  };
  const handleCloseFeedback = () => {
    setIsFeedbackOpen(false);
  };

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      } else {
        // fallback: navigate to home with hash (for SSR or if not on home page)
        window.location.href = href;
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[99vw] max-w-6xl mx-auto">
      <motion.nav
        className="flex items-center justify-between py-3 px-6 lg:px-10 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-text-primary font-bold text-xl hover:text-[#087684] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2 rounded"
          tabIndex={0}
          aria-label="Go to homepage"
        >
          <span className="relative flex items-center">
            <Image
              src="/mint-logo.png"
              alt="MiNT Logo"
              width={32}
              height={32}
              className="rounded-full object-contain"
              priority
            />
            <span className="ml-2 flex flex-col justify-center leading-none">
              <span>MiNT</span>
              <span className="text-xs font-semibold text-gray-400 mt-0.5 self-end italic dancing-script">Jobs</span>
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-primary text-base font-medium hover:text-[#087684] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2 px-3 py-2 rounded-md"
              tabIndex={0}
              aria-label={link.label}
              onClick={e => handleNavClick(e, link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="bg-white/30 backdrop-blur-md text-[#087684] font-semibold px-6 py-2 rounded-full border border-[#087684] hover:bg-[#087684]/10 hover:text-[#087684] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2"
            tabIndex={0}
            aria-label="Login"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
                        className="md:hidden p-2 rounded-md text-text-primary hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2"
          onClick={toggleMobileMenu}
          tabIndex={0}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>
      </motion.nav>

      {/* Mobile Menu - Positioned outside the nav to avoid clipping */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 w-full mt-2 bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-text-primary text-base font-medium hover:text-[#087684] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2 px-3 py-2 rounded-md"
                  tabIndex={0}
                  aria-label={link.label}
                  onClick={e => handleNavClick(e, link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/20">
                <Link
                  href="/login"
                  className="block bg-white/30 backdrop-blur-md text-[#087684] font-semibold px-6 py-2 rounded-full border border-[#087684] hover:bg-[#087684]/10 hover:text-[#087684] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#087684] focus:ring-offset-2 text-center"
                  tabIndex={0}
                  aria-label="Login"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={handleCloseForgot}
        onSubmit={handleForgotSubmit}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={handleCloseFeedback}
      />
    </div>
  );
};

export default Navbar; 