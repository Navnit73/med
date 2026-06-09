import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, GraduationCap, Award, Star, ArrowLeft, CheckCircle2, ThumbsUp, ChevronRight, Building2, Clock, Calendar } from 'lucide-react';
import { DOCTORS, SPECIALTY_ICONS, DEFAULT_ICON, AVATAR_COLORS } from '../data/mockDoctors';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

export default function PublicDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const doctorIndex = DOCTORS.findIndex(d => d.id === id);
  const doctor = DOCTORS[doctorIndex];

  if (!doctor) {
    return (
      <div className="pt-24 pb-20 min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Doctor not found</h1>
        <button 
          onClick={() => navigate('/find-doctors')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const SpecIcon = SPECIALTY_ICONS[doctor.specialty] ?? DEFAULT_ICON;
  const avatarClass = AVATAR_COLORS[doctorIndex % AVATAR_COLORS.length];

  return (
    <div className="pt-16 md:pt-24 pb-20 min-h-[100dvh] bg-[#f8f9fa] font-sans">
      
      {/* Top Nav (Mobile & Desktop) */}
      <div className="bg-white border-b border-slate-200 sticky top-[60px] md:top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14">
          <button 
            onClick={() => navigate('/find-doctors')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to doctors
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6 pb-24 md:pb-0">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Left Content */}
          <div className="w-full lg:flex-1 space-y-4 md:space-y-6">
            
            {/* Header Info Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold border border-slate-100 ${avatarClass}`}>
                  {initials(doctor.name)}
                </div>
              </div>

              {/* Basic Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">{doctor.name}</h1>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                
                <p className="text-sm md:text-base text-slate-600 mb-1">{doctor.qual}</p>
                <p className="text-sm md:text-base text-slate-600 mb-3">{doctor.specialty} • {doctor.exp} Experience</p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                  {/* Rating Badge */}
                  <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded">
                    <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-700">{doctor.rating}</span>
                  </div>
                  
                  {/* Verification */}
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Medical Registration Verified
                  </span>
                </div>
                
                {/* Practo-style summary tags */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Reviews</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.reviews} Patients</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Experience</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.exp}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Sections */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
                <button className="px-6 py-3.5 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 whitespace-nowrap">Info</button>
                <button className="px-6 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap">Services</button>
                <button className="px-6 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap">Reviews ({doctor.reviews})</button>
              </div>

              <div className="p-4 md:p-6 space-y-8">
                
                {/* About */}
                <section>
                  <h2 className="text-base font-bold text-slate-900 mb-2">About</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {doctor.name} is a renowned {doctor.specialty.toLowerCase()} specialist currently practicing at {doctor.hospital}. 
                    With over {doctor.exp} of dedicated clinical practice, they have helped numerous patients with complex medical conditions. 
                    They hold a {doctor.qual} and are known for their patient-centric approach and accurate diagnoses.
                  </p>
                </section>

                {/* Education */}
                <section>
                  <h2 className="text-base font-bold text-slate-900 mb-3">Education</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doctor.qual.split(',')[1]?.trim() || doctor.qual}</p>
                        <p className="text-xs text-slate-500">Top Medical University, 2012</p>
                      </div>
                    </div>
                    {doctor.qual.includes(',') && (
                      <div className="flex items-start gap-3">
                        <div className="w-5 flex justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{doctor.qual.split(',')[0]?.trim()}</p>
                          <p className="text-xs text-slate-500">National Medical College, 2008</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

              </div>
            </div>

          </div>

          {/* Right Column (Clinic & Booking Widget) */}
          <div className="w-full lg:w-[360px] space-y-4 md:space-y-6">
            
            {/* Clinic Details */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex justify-between items-center">
                Clinic Details
              </h2>
              
              <div className="flex gap-3 mb-4">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{doctor.hospital}</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Andheri West, Mumbai</p>
                  <p className="text-xs text-indigo-600 font-medium mt-1 cursor-pointer">Get Directions</p>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm text-slate-800 font-medium">Mon - Sat</p>
                  <p className="text-sm text-slate-600">09:00 AM - 05:00 PM</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100">
                <span className="text-sm text-slate-600">Consultation Fee</span>
                <span className="text-sm font-bold text-slate-900">₹800</span>
              </div>
            </div>

            {/* Desktop Booking Widget */}
            <div className="hidden lg:block bg-white rounded-lg border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Book Appointment
              </h3>
              
              <div className="border border-slate-200 rounded-md p-1 mb-4">
                <div className="flex justify-between items-center mb-2 px-2 pt-2">
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ArrowLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold text-slate-800">Today, 24 Nov</span>
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2">
                  <button className="py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 rounded">10:00 AM</button>
                  <button className="py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 rounded">10:30 AM</button>
                  <button className="py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50">11:00 AM</button>
                  <button className="py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50">11:30 AM</button>
                  <button className="py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50">02:00 PM</button>
                  <button className="py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50">02:30 PM</button>
                </div>
              </div>

              <button className="w-full py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded hover:bg-indigo-700 transition-colors">
                Book Clinic Visit
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Sticky Mobile Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgb(0,0,0,0.05)] z-50 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">Consultation Fee</p>
          <p className="text-base font-bold text-slate-900">₹800</p>
        </div>
        <button className="flex-1 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-lg active:scale-[0.98] transition-transform">
          Book Appointment
        </button>
      </div>

    </div>
  );
}
