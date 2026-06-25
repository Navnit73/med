import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalApi } from '../../api/hospital';
import { Save, User, MapPin, Link as LinkIcon, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HospitalProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const data = await hospitalApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { name, email, address, city, state, mou_url } = profile;

      const updateData = {
        name,
        email,
        address,
        city,
        state,
        mou_url
      };

      await hospitalApi.updateProfile(updateData);
      setSuccess('Hospital profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      return;
    }
    setDeleting(true);
    try {
      await hospitalApi.hardDeleteProfile();
      logout();
      navigate('/signin/hospital');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete profile');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0284c7]" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-red-500">Failed to load profile data.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Profile</h1>
          <p className="text-slate-500 text-sm">Manage your hospital's information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteProfile}
            disabled={deleting || saving}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-70"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? 'Deleting...' : 'Delete Profile'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || deleting}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] text-white rounded-lg font-medium hover:bg-[#0369a1] transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-lg font-bold">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Hospital Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
              <input
                type="text"
                value={`${profile.country_code || ''} ${profile.phone_number || ''}`}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-lg font-bold">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={profile.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">State</label>
              <input
                type="text"
                name="state"
                value={profile.state || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800 pb-2 border-b border-slate-100">
            <LinkIcon className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-lg font-bold">Additional Information</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">MOU URL</label>
              <input
                type="text"
                name="mou_url"
                value={profile.mou_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Profile</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action is a hard-delete and will permanently remove your hospital account.
                Please type <strong className="select-none pointer-events-none">DELETE</strong> to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 mb-6"
                autoFocus
                autoComplete="off"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteConfirmText.toLowerCase() !== 'delete' || deleting}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
