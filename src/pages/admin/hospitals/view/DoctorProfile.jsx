import React from 'react';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase, GraduationCap, Clock, Award, Users, Star, UserCircle } from 'lucide-react';

export default function DoctorProfile({ doctor, onBack, onEdit, onDelete }) {
  if (!doctor) return null;

  return (
    <div className="space-y-6">
      {/* Header / Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(doctor)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button 
            onClick={() => onDelete(doctor.id)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center border-b border-slate-100">
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border-4 border-white shadow-md">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{doctor.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                doctor.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {doctor.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-lg text-blue-600 font-medium">{doctor.specialty}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{doctor.degree}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{doctor.exp} Years Experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-slate-700">{doctor.rating}</span>
                <span>Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Left Column: Contact & Stats */}
          <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-700">{doctor.email || 'Not provided'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-700">{doctor.phone || 'Not provided'}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-800">{doctor.patients}</div>
                  <div className="text-xs text-slate-500 font-medium">Patients Treated</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-800">{doctor.exp}+</div>
                  <div className="text-xs text-slate-500 font-medium">Years Experience</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Bio & Schedule */}
          <div className="p-6 sm:p-8 lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">About {doctor.name}</h3>
              <div className="prose prose-sm text-slate-600 max-w-none">
                {doctor.bio ? (
                  <p className="whitespace-pre-line leading-relaxed">{doctor.bio}</p>
                ) : (
                  <p className="italic text-slate-400">No biography provided for this doctor.</p>
                )}
              </div>
            </section>
            
            {/* Can add more sections like "Working Hours" or "Recent Patients" here */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Schedule Details</h3>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 text-center text-sm text-slate-500">
                <Clock className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                Schedule management coming soon.
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
