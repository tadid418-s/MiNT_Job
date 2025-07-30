// components/Payslip.tsx
'use client';
import React from 'react';
import { CreditCard } from 'lucide-react';

export default function Payslip() {
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Payslip
      </h2>
      <p className="text-gray-600">Your payslips will be listed here. (Coming soon...)</p>
    </div>
  );
}