'use client';

import React, { useEffect, useState } from 'react';
import { 
  UploadCloud, 
  Download, 
  Eye, 
  FileText, 
  Users, 
  User, 
  Building2,
  Calendar,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface User {
  employeeId: string;
  name: string;
  department: string;
}

interface Report {
  _id: string;
  employeeId: string;
  name: string;
  department: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy?: string;
  uploadedByName?: string;
  reportTitle?: string;
  targetType?: 'employee' | 'department';
  targetEmployeeId?: string;
  targetDepartment?: string;
}

interface Staff {
  _id: string;
  name: string;
  employeeId: string;
  department: string;
  email?: string;
  role?: string;
  status?: string;
}

const ReportUpload: React.FC = () => {
  const [manager, setManager] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'employee' | 'manager'>('all');
  const [error, setError] = useState<string>('');
  
  // Upload form states
  const [file, setFile] = useState<File | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [targetType, setTargetType] = useState<'employee' | 'department'>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = localStorage.getItem('employee_id');
        
        if (!employeeId) {
          setError('No employee ID found. Please log in again.');
          setLoading(false);
          return;
        }

        // Get manager's data
        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch manager data');
        }

        const { user } = await res.json();
        
        if (user) {
          setManager({
            employeeId: user.employeeId,
            name: user.name,
            department: user.department,
          });

          // Fetch staff in same department
          const staffRes = await fetch('/api/get-staff-by-department', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ department: user.department }),
          });

          if (staffRes.ok) {
            const staffData = await staffRes.json();
            setStaffList(staffData.employees || []);
          }

          // Fetch all reports
          const reportsRes = await fetch('/api/reports');
          if (reportsRes.ok) {
            const reportsData = await reportsRes.json();
            setReports(reportsData.reports || []);
            setFilteredReports(reportsData.reports || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType === 'employee') {
      filtered = filtered.filter(report => !report.uploadedBy);
    } else if (filterType === 'manager') {
      filtered = filtered.filter(report => report.uploadedBy);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, filterType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file || !manager) {
      setUploadMessage('File or manager info missing.');
      return;
    }

    if (targetType === 'employee' && !selectedEmployee) {
      setUploadMessage('Please select an employee.');
      return;
    }

    if (targetType === 'department' && !selectedDepartment) {
      setUploadMessage('Please select a department.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('managerId', manager.employeeId);
    formData.append('managerName', manager.name);
    formData.append('managerDepartment', manager.department);
    formData.append('reportTitle', reportTitle);

    if (targetType === 'employee') {
      formData.append('targetEmployeeId', selectedEmployee);
    } else {
      formData.append('targetDepartment', selectedDepartment);
    }

    try {
      const res = await fetch('/api/reports/manager-upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadMessage('Report uploaded successfully!');
        setFile(null);
        setReportTitle('');
        setSelectedEmployee('');
        setSelectedDepartment('');
        
        // Refresh reports list
        const reportsRes = await fetch('/api/reports');
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      } else {
        setUploadMessage('Failed to upload report.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadMessage('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReport = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#087684]"></div>
        <p className="ml-3 text-[#6B7280]">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Reports</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="text-center py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <User size={48} className="mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Manager Not Found</h3>
          <p className="text-yellow-600">Please make sure you're logged in as a manager.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
        <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Reports Management</h2>
        <p className="text-[#6B7280]">View employee reports and upload reports to your team</p>
        <div className="mt-2 text-sm text-[#6B7280]">
          Manager: {manager.name} | Department: {manager.department}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: View Employee Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-[#087684]" />
                <h3 className="text-lg font-semibold text-[#1C1C1E]">Employee Reports</h3>
              </div>
              <span className="text-sm text-[#6B7280]">{filteredReports.length} reports</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'employee' | 'manager')}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="employee">Employee Reports</option>
                <option value="manager">Manager Reports</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-[#9CA3AF] mb-4" />
                <h4 className="text-lg font-medium text-[#1C1C1E] mb-2">No Reports Found</h4>
                <p className="text-[#6B7280]">No reports match your current filters.</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredReports.map((report) => (
                  <div key={report._id} className="p-4 bg-[#FAFBFC] rounded-lg hover:bg-[#F5F7FA] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText size={16} className="text-[#087684]" />
                          <h4 className="font-medium text-[#1C1C1E]">
                            {report.reportTitle || report.fileName}
                          </h4>
                          {report.uploadedBy && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Manager Upload
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#6B7280] space-y-1">
                          <p><strong>Uploaded by:</strong> {report.uploadedByName || report.name}</p>
                          <p><strong>Department:</strong> {report.department}</p>
                          <p><strong>Date:</strong> {formatDate(report.uploadedAt)}</p>
                          {report.targetEmployeeId && (
                            <p><strong>Target Employee:</strong> {report.targetEmployeeId}</p>
                          )}
                          {report.targetDepartment && (
                            <p><strong>Target Department:</strong> {report.targetDepartment}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => downloadReport(report.filePath, report.fileName)}
                          className="p-2 text-[#6B7280] hover:text-[#087684] hover:bg-[#F0F9FF] rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => window.open(report.filePath, '_blank')}
                          className="p-2 text-[#6B7280] hover:text-[#087684] hover:bg-[#F0F9FF] rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Upload Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
            <div className="flex items-center space-x-2">
              <UploadCloud size={20} className="text-[#087684]" />
              <h3 className="text-lg font-semibold text-[#1C1C1E]">Upload Reports</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Report Title */}
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title or description"
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-transparent"
              />
            </div>

            {/* Target Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-2">
                Target Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="employee"
                    checked={targetType === 'employee'}
                    onChange={(e) => setTargetType(e.target.value as 'employee' | 'department')}
                    className="text-[#087684] focus:ring-[#087684]"
                  />
                  <User size={16} />
                  <span>Specific Employee</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="department"
                    checked={targetType === 'department'}
                    onChange={(e) => setTargetType(e.target.value as 'employee' | 'department')}
                    className="text-[#087684] focus:ring-[#087684]"
                  />
                  <Building2 size={16} />
                  <span>Department</span>
                </label>
              </div>
            </div>

            {/* Target Selection */}
            {targetType === 'employee' ? (
              <div>
                <label className="block text-sm font-medium text-[#1C1C1E] mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-transparent"
                >
                  <option value="">Choose an employee...</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff.employeeId}>
                      {staff.name} ({staff.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[#1C1C1E] mb-2">
                  Select Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#087684] focus:border-transparent"
                >
                  <option value="">Choose a department...</option>
                  <option value={manager.department}>{manager.department}</option>
                  <option value="all">All Departments</option>
                </select>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1C1C1E] mb-2">
                Select File
              </label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#087684] transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <UploadCloud size={32} className="mx-auto text-[#9CA3AF] mb-2" />
                  <p className="text-[#6B7280]">
                    {file ? file.name : 'Click to select a file or drag and drop'}
                  </p>
                  <p className="text-sm text-[#9CA3AF] mt-1">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
                </label>
              </div>
              {file && (
                <div className="mt-2 flex items-center justify-between p-2 bg-[#F0F9FF] rounded-lg">
                  <span className="text-sm text-[#087684]">{file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-[#9CA3AF] hover:text-[#087684]"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full bg-[#087684] text-white py-3 px-4 rounded-lg hover:bg-[#066466] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  <span>Upload Report</span>
                </>
              )}
            </button>

            {/* Message */}
            {uploadMessage && (
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                uploadMessage.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {uploadMessage.includes('successfully') ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span className="text-sm">{uploadMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;
