// components/Settings.tsx
'use client';
import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsComponent() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Settings
      </h2>
      <p className="text-gray-600">Settings content goes here.</p>
    </div>
  );
}