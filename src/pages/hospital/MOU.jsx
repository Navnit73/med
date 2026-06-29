import React, { useState, useEffect, useRef } from 'react';
import { hospitalApi } from '../../api/hospital';
import { Loader2, FileText, Upload, Trash2, ExternalLink } from 'lucide-react';

export default function HospitalMOU() {
  const [mou, setMou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMOU = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await hospitalApi.getMOU();
      if (data.mou_url) {
        setMou(data);
      } else {
        setMou(null);
      }
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.detail === "No MOU document found for this hospital.") {
        setMou(null);
      } else {
        setError(err.response?.data?.detail || 'Failed to load MOU');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMOU();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF document.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      
      const formData = new FormData();
      formData.append('file', file);
      
      await hospitalApi.uploadMOU(formData);
      setSuccess('MOU uploaded successfully');
      fetchMOU();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload MOU');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this MOU?')) return;
    
    try {
      setDeleting(true);
      setError('');
      setSuccess('');
      
      await hospitalApi.deleteMOU();
      setSuccess('MOU deleted successfully');
      setMou(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete MOU');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0284c7]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">MOU Document</h1>
        <p className="text-slate-500 text-sm">Manage your Memorandum of Understanding</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        {mou ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#0284c7]" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">MOU Uploaded</h3>
              <p className="text-sm text-slate-500 mt-1">Your current MOU is active and available to view.</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <a 
                href={mou.mou_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] text-white rounded-lg font-medium hover:bg-[#0369a1] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View MOU
              </a>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center max-w-sm mx-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload MOU</h3>
              <p className="text-sm text-slate-500 mb-6">
                Please upload your signed Memorandum of Understanding (PDF format only).
              </p>
              
              <input 
                type="file" 
                accept="application/pdf"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0284c7] text-white rounded-lg font-medium hover:bg-[#0369a1] transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? 'Uploading...' : 'Select PDF File'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
