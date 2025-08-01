'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  User,
  Building2,
  Download,
  Trash2
} from 'lucide-react';

interface User {
  employeeId: string;
  name: string;
  department: string;
}

interface UploadedReport {
  id: string;
  fileName: string;
  uploadDate: string;
  size: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ReportUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [recentReports] = useState<UploadedReport[]>([
    {
      id: '1',
      fileName: 'Monthly_Report_Nov_2024.pdf',
      uploadDate: '2024-11-15',
      size: '2.3 MB',
      status: 'approved'
    },
    {
      id: '2',
      fileName: 'Weekly_Status_Report.docx',
      uploadDate: '2024-11-10',
      size: '1.1 MB',
      status: 'pending'
    },
    {
      id: '3',
      fileName: 'Project_Summary_Q4.pdf',
      uploadDate: '2024-11-05',
      size: '3.7 MB',
      status: 'approved'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('User not found in localStorage');
        }

        const parsedUser = JSON.parse(storedUser);
        const employeeId = parsedUser?.employeeId;

        if (!employeeId) throw new Error('Employee ID missing');

        const res = await fetch('/api/get-user-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });

        if (!res.ok) throw new Error('Failed to fetch user info');

        const data = await res.json();
        setUser({
          employeeId: data.employeeId,
          name: data.name,
          department: data.department,
        });
      } catch (err) {
        console.error('User load error:', err);
        setMessage('Failed to load user info');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage('Please upload a PDF, DOC, DOCX, or TXT file.');
      setMessageType('error');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage('File size must be less than 10MB.');
      setMessageType('error');
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !user) {
      setMessage('File or user info missing.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('employeeId', user.employeeId);
    formData.append('name', user.name);
    formData.append('department', user.department);

    try {
      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('Report uploaded successfully! It will be reviewed by your manager.');
        setMessageType('success');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage('Failed to upload report. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('An error occurred during upload. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <X size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <p className="text-xl text-red-600">Cannot upload report. User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087684] to-[#066466] rounded-xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Report Upload Center</h1>
            <p className="text-[#B8E6EE]">Submit your reports and track their approval status</p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[#F0F9FF] rounded-full flex items-center justify-center">
            <User size={24} className="text-[#087684]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Information</h2>
            <p className="text-gray-600">Reports will be submitted under your account</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Name</span>
            </div>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Department</span>
            </div>
            <p className="font-semibold text-gray-900">{user.department}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Employee ID</span>
            </div>
            <p className="font-semibold text-gray-900 font-mono">{user.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Report</h2>
        
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
            ${dragOver 
              ? 'border-[#087684] bg-[#F0F9FF]' 
              : 'border-gray-300 hover:border-[#087684] hover:bg-gray-50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              dragOver ? 'bg-[#F0F9FF]' : 'bg-gray-100'
            }`}>
              <UploadCloud size={32} className={dragOver ? 'text-[#087684]' : 'text-gray-600'} />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {dragOver ? 'Drop your file here' : 'Drag & drop your report'}
              </p>
              <p className="text-gray-600 mb-4">
                or <span className="text-[#087684] font-medium">browse files</span>
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
            </div>
          </div>
      <input
            ref={fileInputRef}
        type="file"
            onChange={handleInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        {/* Selected File Preview */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                  <File size={24} className="text-[#087684]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="p-2 hover:bg-[#F0F9FF] rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
      <button
        onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-[#087684] text-white py-4 px-6 rounded-xl hover:bg-[#066466] disabled:bg-[#6B7280] transition-colors font-semibold flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Upload Report
                </>
              )}
      </button>
          </motion.div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : messageType === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {messageType === 'success' && <CheckCircle size={20} />}
            {messageType === 'error' && <AlertCircle size={20} />}
            {messageType === 'info' && <AlertCircle size={20} />}
            <p className="font-medium">{message}</p>
          </motion.div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-[#087684]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{report.fileName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Uploaded: {report.uploadDate}</span>
                    <span>Size: {report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download size={16} className="text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
    </div>
    </motion.div>
  );
};

export default ReportUpload;
