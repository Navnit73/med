import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Trash2, AlertTriangle } from 'lucide-react';
import { patientApi } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileSettingsModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onProfileUpdated 
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHardDeleting, setIsHardDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  // Mandatory profile completion check
  const isMandatory = !userProfile?.first_name;

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await patientApi.updateProfile(formData);
      onProfileUpdated(updated);
      if (!isMandatory) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You can reactivate by logging in again.')) return;
    setIsDeleting(true);
    try {
      await patientApi.deleteProfile();
      logout();
      navigate('/signin');
    } catch (err) {
      console.error(err);
      setError('Failed to delete account.');
      setIsDeleting(false);
    }
  };

  const handleHardDelete = async () => {
    if (!window.confirm('WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you sure?')) return;
    setIsHardDeleting(true);
    try {
      await patientApi.hardDeleteProfile();
      logout();
      navigate('/signin');
    } catch (err) {
      console.error(err);
      setError('Failed to permanently delete account.');
      setIsHardDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {!isMandatory && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isMandatory ? 'Complete Your Profile' : 'Account Settings'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isMandatory 
              ? 'Please provide your details to continue using Med Experts.' 
              : 'Manage your primary account details.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold mb-4 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Phone Number</label>
            <input 
              type="text" 
              disabled 
              value={`${userProfile?.country_code || '+91'} ${userProfile?.phone_number || ''}`} 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed text-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">First Name</label>
              <input 
                required 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" 
                placeholder="John" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Last Name</label>
              <input 
                required 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" 
                placeholder="Doe" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" 
              placeholder="john@example.com" 
            />
          </div>

          <button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full py-3 bg-sky-600 disabled:bg-sky-400 text-white font-bold rounded-xl mt-6 hover:bg-sky-700 shadow-sm transition-colors flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
          </button>
        </form>

        {!isMandatory && (
          <>
            <hr className="my-6 border-slate-200" />
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Danger Zone</h3>
              <button 
                type="button"
                disabled={isDeleting || isHardDeleting}
                onClick={handleSoftDelete}
                className="w-full py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 text-sm"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deactivate Account"}
              </button>
              
              <button 
                type="button"
                disabled={isDeleting || isHardDeleting}
                onClick={handleHardDelete}
                className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 text-sm"
              >
                {isHardDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 size={16} /> Permanently Delete Account</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
