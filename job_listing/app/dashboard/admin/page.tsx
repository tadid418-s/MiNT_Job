// app/dashboard/admin/page.tsx (or AdminDashboard.tsx if using traditional routing)

'use client'

import React, { useState } from 'react'
import {
  Users,
  Settings,
  FilePlus,
  Mail,
  Upload,
  ShieldCheck,
  Activity,
  Menu,
} from 'lucide-react'

const menuItems = [
  { title: 'User Management', icon: <Users />, content: 'Create and manage user accounts (HR, managers, employees).' },
  { title: 'Assign Roles & Departments', icon: <Settings />, content: 'Set roles and assign departments.' },
  { title: 'Generate Login Credentials', icon: <FilePlus />, content: 'Generate login credentials for employees.' },
  { title: 'Send Credentials via Email', icon: <Mail />, content: 'Send login credentials to employees via email.' },
  { title: 'Bulk Upload Employees (CSV)', icon: <Upload />, content: 'Bulk upload employee data using a CSV file.' },
  { title: 'View System Logs', icon: <Activity />, content: 'View system usage logs and audit trails.' },
  { title: 'Security Settings', icon: <ShieldCheck />, content: 'Control security settings (password policy, access restrictions).' },
]

export default function AdminDashboard() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#087684] text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center space-x-2 px-3 py-2 rounded hover:bg-[#066466] transition ${
              selected === index ? 'bg-[#066466]' : ''
            }`}
            onClick={() => setSelected(index)}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#087684] mb-4">{menuItems[selected].title}</h1>
        <p className="text-lg text-gray-700 mb-6">{menuItems[selected].content}</p>

        {/* You can conditionally render forms/components here */}
        {selected === 0 && (
          <div className="border p-6 rounded bg-white shadow">
            {/* Placeholder for user management form */}
            <p className="text-sm text-gray-600">[Form to create or edit users goes here]</p>
          </div>
        )}

        {selected === 4 && (
          <div className="border p-6 rounded bg-white shadow">
            <input type="file" accept=".csv" className="mb-4" />
            <button className="bg-[#087684] text-white px-4 py-2 rounded hover:bg-[#066466]">
              Upload CSV
            </button>
          </div>
        )}

        {/* Add similar blocks for other sections if needed */}
      </main>
    </div>
  )
}
