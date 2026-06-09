import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, Briefcase, GraduationCap, Award, Stethoscope, Hash, AlignLeft } from 'lucide-react';

const SPECIALTIES = ['Cardiology', 'Neurology', 'Radiology', 'Pediatrics', 'Orthopedics', 'Pathology', 'General'];

export default function DoctorForm({ doctor, onSave, onCancel }) {
  const isEdit = Boolean(doctor);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'General',
    degree: '',
    exp: 0,
    patients: 0,
    rating: 0,
    status: 'active',
    bio: '',
    image: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialty: doctor.specialty || 'General',
        degree: doctor.degree || '',
        exp: doctor.exp || 0,
        patients: doctor.patients || 0,
        rating: doctor.rating || 0,
        status: doctor.status || 'active',
        bio: doctor.bio || '',
        image: doctor.image || '',
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: isEdit ? doctor.id : Date.now() });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Profile Image Section */}
        <div className="mb-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {formData.image ? (
              <img src={formData.image} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Profile Photo</h3>
            <p className="text-xs text-slate-500 mb-3">Upload a professional headshot. Recommended size 256x256px.</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <span>Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {formData.image && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive / On Leave</option>
              </select>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-2">Professional Details</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="specialty" required
                  value={formData.specialty} onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
                >
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degrees / Qualifications</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" name="degree" required
                  value={formData.degree} onChange={handleChange}
                  placeholder="e.g. MBBS, MD"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" name="exp" min="0" required
                    value={formData.exp} onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patients</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" name="patients" min="0"
                    value={formData.patients} onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Rating (0 - 5)</label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" name="rating" min="0" max="5" step="0.1"
                  value={formData.rating} onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>
          </div>
          
          {/* Biography */}
          <div className="md:col-span-2 mt-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Biography / Notes</label>
              <div className="relative">
                <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea 
                  name="bio" rows="4"
                  value={formData.bio} onChange={handleChange}
                  placeholder="Enter detailed biography, areas of interest, or additional notes..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                />
              </div>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
}
