'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  Users,
  Settings,
  FilePlus,
  Mail,
  Upload,
  ShieldCheck,
  Activity,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Bell,
  User,
  LogOut,
  Download,
  Calendar,
  Lock,
  Key,
  Building,
  UserCheck,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import SignupPage from '@/app/signup/page'
import AdminSettings from './AdminSettings'

// Spotlight Card Component
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(8, 118, 132, 0.2)" }: { children: React.ReactNode, className?: string, spotlightColor?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
      divRef.current.style.setProperty("--spotlight-color", spotlightColor);
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spotlight-color': spotlightColor
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

const menuItems = [
  { title: 'User Management', icon: <Users size={20} />, content: 'Create and manage user accounts (HR, managers, employees).' },
  { title: 'Assign Roles & Departments', icon: <Settings size={20} />, content: 'Set roles and assign departments.' },
  { title: 'Generate Login Credentials', icon: <FilePlus size={20} />, content: 'Generate login credentials for employees.' },
  { title: 'Send Credentials via Email', icon: <Mail size={20} />, content: 'Send login credentials to employees via email.' },
  { title: 'Bulk Upload Employees (CSV)', icon: <Upload size={20} />, content: 'Bulk upload employee data using a CSV file.' },
  { title: 'View System Logs', icon: <Activity size={20} />, content: 'View system usage logs and audit trails.' },
  { title: 'Settings', icon: <ShieldCheck size={20} />, content: 'Configure system settings, security policies, and administrative preferences.' },
]

export default function AdminDashboard() {
  const [selected, setSelected] = useState(0)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-[#F5F7F8] font-['Inter']">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#0A1D1A] text-white flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-[#1A2F2A]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#087684] rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-[#9CA3AF]">System Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                selected === index 
                  ? 'bg-[#087684] text-white shadow-md' 
                  : 'text-[#D1D5DB] hover:bg-[#1A2F2A] hover:text-white'
            }`}
            onClick={() => setSelected(index)}
          >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-sm">{item.title}</span>
          </button>
        ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1A2F2A]">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A2F2A]">
            <div className="w-8 h-8 bg-[#087684] rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-[#9CA3AF] truncate">admin@mint.gov.et</p>
            </div>
            <button className="text-[#9CA3AF] hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#1C1C1E]">
              {menuItems[selected].title}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
              <span>•</span>
              <span>{menuItems[selected].content}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
        {/* User Management */}
        {selected === 0 && (
            <div className="space-y-6">
              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                      <input
                        type="text"
                    placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087684] focus:border-transparent"
                      />
                    </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <Filter size={16} className="text-[#6B7280]" />
                    <span className="text-[#6B7280]">Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-[#087684] text-white px-4 py-2 rounded-lg hover:bg-[#066060] transition-colors shadow-sm">
                    <Plus size={16} />
                    <span>Add User</span>
                    </button>
                  </div>
                </div>
                
              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
                  <h4 className="text-lg font-semibold text-[#1C1C1E]">User Accounts</h4>
                  <p className="text-sm text-[#6B7280] mt-1">Manage system user accounts and permissions</p>
                </div>
                <div className="overflow-x-auto">
            {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#087684]"></div>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-[#F8FAFB] border-b border-[#E5E7EB]">
                        <tr>
                          <th className="text-left py-3 px-6 text-xs font-medium text-[#6B7280] uppercase tracking-wider">User</th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Role</th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Department</th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                          <th className="text-right py-3 px-6 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-[#F0F9FF] rounded-full flex items-center justify-center">
                                  <User size={16} className="text-[#087684]" />
                                  </div>
                                  <div>
                                  <div className="font-medium text-[#1C1C1E]">{user.name}</div>
                                  <div className="text-sm text-[#6B7280]">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                            <td className="py-4 px-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F9FF] text-[#087684]">
                                {user.role}
                                </span>
                              </td>
                            <td className="py-4 px-6 text-[#6B7280]">{user.department || 'Not assigned'}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                <button className="p-1 text-[#6B7280] hover:text-[#087684] transition-colors">
                                    <Eye size={16} />
                                  </button>
                                <button className="p-1 text-[#6B7280] hover:text-[#087684] transition-colors">
                                    <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                                  className="p-1 text-[#6B7280] hover:text-red-600 transition-colors"
                          >
                                    <Trash2 size={16} />
                          </button>
                                </div>
                        </td>
                      </tr>
                        ))}
                </tbody>
              </table>
            )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">Total Users</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{users.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                      <Users size={24} className="text-[#087684]" />
              </div>
            </div>
                </SpotlightCard>

                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">Active Sessions</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">24</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                      <Activity size={24} className="text-[#087684]" />
                    </div>
                  </div>
                </SpotlightCard>
                
                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">System Health</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">Good</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* Assign Roles & Departments */}
          {selected === 1 && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Create New User & Assign Roles</h2>
                <p className="text-[#6B7280]">Add new users to the system and assign appropriate roles and departments</p>
              </div>

              {/* Quick Stats - Moved to top */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">Total Roles</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">4</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                      <UserCheck size={24} className="text-[#087684]" />
                    </div>
                  </div>
                </SpotlightCard>
                
                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">Total Departments</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">5</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                      <Building size={24} className="text-[#087684]" />
                    </div>
                  </div>
                </SpotlightCard>
                
                <SpotlightCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B7280]">Total Users</p>
                      <p className="text-2xl font-bold text-[#1C1C1E] mt-1">{users.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-[#087684]" />
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              {/* New User Creation Form - Notion Style */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-[#087684] to-[#066466]">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <UserCheck size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Add New Team Member</h3>
                      <p className="text-white/80 text-sm">Create a new user account with role and department assignment</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-[#1C1C1E] mb-6">Personal Information</h4>
                        
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Full Name</label>
                          <input
                            type="text"
                              placeholder="Enter full name"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Email Address</label>
                          <input
                              type="email"
                              placeholder="name@company.com"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                            />
                      </div>

                      <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
                        <input
                              type="tel"
                              placeholder="+251 911 123456"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                        />
                      </div>

                      <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Employee ID</label>
                        <input
                              type="text"
                              placeholder="EMP-2024-001"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Role & Department Assignment */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-[#1C1C1E] mb-6">Role & Department</h4>
                        
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Role</label>
                            <select className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200 appearance-none cursor-pointer">
                              <option value="">Select a role</option>
                              <option value="admin">Admin</option>
                              <option value="hr-manager">HR Manager</option>
                              <option value="department-head">Department Head</option>
                              <option value="employee">Employee</option>
                          </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Department</label>
                            <select className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200 appearance-none cursor-pointer">
                              <option value="">Select a department</option>
                              <option value="engineering">Engineering</option>
                              <option value="marketing">Marketing</option>
                              <option value="sales">Sales</option>
                              <option value="hr">Human Resources</option>
                              <option value="finance">Finance</option>
                          </select>
                      </div>

                      <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Start Date</label>
                        <input
                              type="date"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">Temporary Password</label>
                        <input
                          type="password"
                              placeholder="Auto-generated password"
                              className="w-full px-4 py-3 bg-[#FAFBFC] rounded-xl text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#087684]/20 transition-all duration-200"
                        />
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>

                  {/* Permissions Section */}
                  <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
                    <h4 className="text-lg font-medium text-[#1C1C1E] mb-4">Access Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: 'Dashboard Access', description: 'View dashboard and analytics' },
                        { name: 'User Management', description: 'Create and edit user accounts' },
                        { name: 'Reports Access', description: 'Generate and download reports' },
                        { name: 'System Settings', description: 'Modify system configurations' },
                        { name: 'Leave Management', description: 'Approve/reject leave requests' },
                        { name: 'Audit Logs', description: 'View system audit trails' }
                      ].map((permission, index) => (
                        <label key={index} className="flex items-start space-x-3 p-4 bg-[#FAFBFC] rounded-xl hover:bg-[#F5F7FA] transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                            className="mt-1 w-4 h-4 text-[#087684] bg-white rounded focus:ring-[#087684] focus:ring-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-[#1C1C1E]">{permission.name}</div>
                            <div className="text-xs text-[#6B7280]">{permission.description}</div>
                          </div>
                        </label>
                      ))}
                      </div>
                    </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F1F5F9]">
                    <button className="px-6 py-3 text-[#6B7280] bg-[#F8F9FA] hover:bg-[#E9ECEF] rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      Cancel
                    </button>
                    <div className="flex space-x-3">
                      <button className="px-6 py-3 text-[#087684] bg-[#F0F9FF] hover:bg-[#E0F2FE] rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                        Save as Draft
                      </button>
                      <button className="px-8 py-3 bg-gradient-to-r from-[#087684] to-[#066466] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                        Create User
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* Generate Login Credentials */}
          {selected === 2 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <FilePlus size={32} className="text-[#087684]" />
              </div>
              <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">Generate Login Credentials</h4>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Generate login credentials for existing users
              </p>
            </div>
          )}

          {/* Send Credentials via Email */}
          {selected === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-[#087684]" />
              </div>
              <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">Email Credentials</h4>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Send login credentials to employees via email
              </p>
          </div>
        )}

          {/* Bulk Upload Employees */}
        {selected === 4 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-[#087684]" />
              </div>
              <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">Bulk Upload</h4>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Upload employee data using CSV files
              </p>
            </div>
          )}

          {/* View System Logs */}
          {selected === 5 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity size={32} className="text-[#087684]" />
              </div>
              <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">View System Logs</h4>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Monitor system activity and security logs
              </p>
            </div>
          )}

          {/* Admin Settings */}
          {selected === 6 && <AdminSettings />}
        </div>
      </main>
    </div>
  )
}