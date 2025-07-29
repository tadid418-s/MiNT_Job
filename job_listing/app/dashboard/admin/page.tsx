'use client'

import React, { useEffect, useState } from 'react'
import {
  Users,
  Settings,
  FilePlus,
  Mail,
  Upload,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import SignupPage from '@/app/signup/page'

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
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch users when User Management tab is selected
  useEffect(() => {
    if (selected !== 0) return

    async function fetchUsers() {
      setLoading(true)
      try {
        const res = await fetch('/api/users')
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`HTTP ${res.status}: ${errorText}`)
        }
        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        console.error('fetchUsers error:', err)
        alert(`Failed to fetch users: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [selected])

  // Delete user handler
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errorText}`)
      }
      setUsers(users.filter(user => user._id !== id))
    } catch (err: any) {
      console.error('deleteUser error:', err)
      alert(`Failed to delete user: ${err.message}`)
    }
  }

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

        {/* User Management */}
        {selected === 0 && (
          <div className="border p-6 rounded bg-white shadow">
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Employee ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Department</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{user.employeeId}</td>
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.department}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2 space-x-2">
                          <button className="text-blue-600 hover:underline" disabled>
                            Edit (Coming Soon)
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Other tabs */}
        {selected === 1 && <SignupPage />}
        {selected === 4 && (
          <div className="border p-6 rounded bg-white shadow">
            <input type="file" accept=".csv" className="mb-4" />
            <button className="bg-[#087684] text-white px-4 py-2 rounded hover:bg-[#066466]">
              Upload CSV
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
