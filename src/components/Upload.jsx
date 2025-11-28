"use client";
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Briefcase } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { API_PATH } from '@/utils/apiPaths';
import Inputs from './Inputs';
import { useRouter } from 'next/navigation';

const UploadResumeModal = () => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [title, setTitle] = useState('');
    const fileInputRef = useRef(null);
    const router = useRouter()


    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file.type !== 'application/pdf') {
            toast.error('Please select a PDF file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            toast.error('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        // Auto-generate title from filename if not set
        if (!title) {
            const generatedTitle = file.name.replace('.pdf', '').replace(/_/g, ' ');
            setTitle(generatedTitle);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a PDF file');
            return;
        }

        if (!title.trim()) {
            toast.error('Please enter a resume title');
            return;
        }

        setLoading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('resume', selectedFile);
            uploadData.append('title', title);

            const response = await axiosInstance.post(API_PATH.RESUME.UPLOAD, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data && response?.data?.resume || response?.data?.response?._id) {
                toast.success("Resume parsed and created successfully")
                router.push(`/resume/${response.data?.resume?._id}`)
            }
            // toast.success(response.data.message || 'Resume uploaded successfully!');
            // onSuccess(response.data.resume);
            // handleClose();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setTitle('');
        setDragActive(false);
        onClose();
    };

    return (
        <div className='w-full'>
            {/* Content */}
            <div className="p-6">
                {/* Title Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume Title *
                    </label>
                    <Inputs
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        label="Job Title"
                        placeholder="e.g Software Engineer"
                        type="text"
                    />
                </div>

                {/* File Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                    <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                            {selectedFile ? selectedFile.name : 'Drop your resume here'}
                        </p>
                        <p className="text-sm text-gray-500">
                            or{' '}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                browse files
                            </button>
                        </p>
                        <p className="text-xs text-gray-400">
                            PDF files only, max 10MB
                        </p>
                    </div>

                    {selectedFile && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Pro Tip</p>
                            <p>Upload a PDF resume with selectable text for best results. Scanned images may not work properly.</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 py-6">
                    {/* <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button> */}
                    <button
                        onClick={handleUpload}
                        disabled={loading || !selectedFile || !title.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Upload Resume
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer */}

        </div>

    );
};

export default UploadResumeModal;