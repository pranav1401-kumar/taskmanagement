import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

const BulkUpload = ({ isOpen, onClose, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid CSV or Excel file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const result = await taskAPI.bulkUpload(file);
      
      toast.success(`Successfully imported ${result.imported} tasks`);
      
      if (result.errors && result.errors.length > 0) {
        console.warn('Upload errors:', result.errors);
        toast.error(`${result.errors.length} rows had errors. Check console for details.`);
      }
      
      onUploadComplete();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload file';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,description,effort_days,due_date
Complete Project Report,Write and submit the quarterly project report,3,2024-12-31
Code Review,Review pull requests from team members,1,2024-12-28
Team Meeting,Attend weekly team standup meeting,1,2024-12-27`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'task_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Bulk Upload Tasks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">File Requirements:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• CSV or Excel file format</li>
                  <li>• Required columns: title, effort_days, due_date</li>
                  <li>• Optional column: description</li>
                  <li>• Date format: YYYY-MM-DD</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Template download */}
          <div className="text-center">
            <button
              onClick={downloadTemplate}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Download Sample Template
            </button>
          </div>

          {/* File upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-primary-500 bg-primary-50'
                : file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file ? (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-green-700 font-medium">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-600">
                    Drop your CSV or Excel file here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Upload button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Tasks'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;