'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';

const ForgotPasswordPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e6f6f8] via-[#f0f9fa] to-[#e6f6f8]">
      <div className="flex-grow flex flex-col items-center justify-center pt-20 px-4 mb-32">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10 flex flex-col items-center border border-[#e0f2f1]">
          <div className="w-12 h-12 bg-[#e0f7fa] rounded-full flex items-center justify-center mb-2">
            <svg className="w-7 h-7 text-[#087684]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 12a2 2 0 1 0-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 12v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Forgot Password</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Enter your Employee ID and we'll send you instructions to reset your password.</p>
          {submitted ? (
            <div className="text-center mt-6">
              <div className="w-12 h-12 bg-[#e0f7fa] rounded-full flex items-center justify-center mx-auto mb-2">
                <button type="button" tabIndex={-1} aria-hidden="true" className="w-7 h-7 text-[#087684] flex items-center justify-center bg-transparent border-none p-0 cursor-default" disabled>
                  <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" />
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Check your email</h2>
              <p className="text-text-primary text-sm">If an account with that Employee ID exists, instructions to reset your password have been sent to your email.</p>
              <button
                className="mt-6 px-6 py-2 rounded-lg bg-[#087684] hover:bg-[#065a5e] text-white font-semibold shadow focus:ring-2 focus:ring-[#087684] focus:outline-none"
                onClick={() => router.push('/login')}
                aria-label="Back to login"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-text-primary mb-1">Employee ID<span className="text-red-500">*</span></label>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087684] focus:outline-none bg-gray-50"
                  placeholder="Enter your Employee ID"
                  aria-label="Employee ID"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#087684] hover:bg-[#065a5e] text-white font-semibold shadow focus:ring-2 focus:ring-[#087684] focus:outline-none mt-2"
                aria-label="Send reset instructions"
              >
                Send Reset Instructions
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage; 