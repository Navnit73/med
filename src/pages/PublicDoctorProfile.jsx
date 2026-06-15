import { useParams, useNavigate } from 'react-router-dom';
import { Star, GraduationCap, Clock, Award, Video, Building2, Calendar, ChevronLeft, CheckCircle2, ArrowLeft, ThumbsUp, ChevronRight, Shield } from 'lucide-react';
import { DOCTORS, AVATAR_COLORS } from '../data/mockDoctors';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

export default function PublicDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctorIndex = DOCTORS.findIndex(d => d.id === id);
  const doctor = DOCTORS[doctorIndex];

  if (!doctor) {
    return (
      <div className="pt-24 pb-20 min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Doctor not found</h1>
        <button onClick={() => navigate('/find-doctors')} className="px-6 py-2.5 bg-[#0284c7] text-white rounded-sm font-medium">
          Back to Search
        </button>
      </div>
    );
  }

  const avatarClass = AVATAR_COLORS[doctorIndex % AVATAR_COLORS.length];

  return (
    <div className="min-h-[100dvh] bg-slate-50 pt-16 pb-24 md:pb-10 font-sans">

      {/* Breadcrumb / Back nav */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-12 gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/find-doctors')} className="flex items-center gap-1 hover:text-[#0284c7] transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Doctors
          </button>
          <span>/</span>
          <span>{doctor.specialty}</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate">{doctor.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── Left column ── */}
          <div className="w-full lg:flex-1 space-y-4">

            {/* Profile header card */}
            <div className="bg-white rounded-sm border border-slate-100  overflow-hidden">
            
              <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-sm flex items-center justify-center text-2xl md:text-3xl font-extrabold text-white ${avatarClass}`}>
                    {initials(doctor.name)}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">{doctor.name}</h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0284c7] bg-[#f0f9ff] px-2 py-0.5 rounded border border-[#0284c7]/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-0.5">{doctor.qual}</p>
                  <p className="text-sm text-slate-600 mb-3">{doctor.specialty} · {doctor.exp} experience</p>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 bg-[#f0f9ff] px-3 py-1.5 rounded-lg">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span className="text-sm font-bold text-[#0284c7]">{doctor.rating}%</span>
                      <span className="text-xs text-slate-500">patients recommended</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-800">{doctor.reviews}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-800">{doctor.exp}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Experience</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Award className="w-3.5 h-3.5 text-slate-400" /> Reg. Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs + content */}
            <div className="bg-white rounded-sm border border-slate-100  overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
                {['About', 'Education', 'Services', `Reviews (${doctor.reviews})`].map((tab, i) => (
                  <button key={tab} className={`px-5 py-3.5 text-sm whitespace-nowrap font-semibold transition-colors ${i === 0 ? 'text-[#0284c7] border-b-2 border-[#0284c7]' : 'text-slate-500 hover:text-slate-800'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-5 md:p-6 space-y-7">
                {/* About */}
                <section>
                  <h2 className="text-sm font-bold text-slate-900 mb-2">About {doctor.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {doctor.name} is a renowned {doctor.specialty.toLowerCase()} specialist currently practising at {doctor.hospital}.
                    With over {doctor.exp} of dedicated clinical practice, they have helped numerous patients with complex medical conditions.
                    They hold a {doctor.qual} and are known for their patient-centric approach and accurate diagnoses.
                  </p>
                </section>

                {/* Education */}
                <section>
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Education & training</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#0284c7]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{doctor.qual.split(',')[1]?.trim() || doctor.qual}</p>
                        <p className="text-xs text-slate-500">Top Medical University · 2012</p>
                      </div>
                    </div>
                    {doctor.qual.includes(',') && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{doctor.qual.split(',')[0]?.trim()}</p>
                          <p className="text-xs text-slate-500">National Medical College · 2008</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Services */}
                <section>
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Services offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Consultation', 'Second Opinion', 'Video Consult', 'Medical Reports Review', 'Follow-up Visit'].map(s => (
                      <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">{s}</span>
                    ))}
                  </div>
                </section>

                {/* Reviews */}
                <section>
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Patient reviews</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Anjali K.', stars: 5, text: 'Excellent consultation. Very thorough and explained everything clearly.' },
                      { name: 'Rohan M.', stars: 5, text: 'Highly knowledgeable. The second opinion gave us great confidence.' },
                    ].map((r, i) => (
                      <div key={i} className="border-b border-slate-50 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-[#f0f9ff] flex items-center justify-center text-[#0284c7] text-xs font-bold">{r.name[0]}</div>
                          <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[...Array(r.stars)].map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-[#0284c7] text-[#0284c7]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 ml-9">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="w-full lg:w-[340px] space-y-4">

            {/* Clinic info */}
            <div className="bg-white rounded-sm border border-slate-100  p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Clinic details</h2>

              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{doctor.hospital}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Andheri West, Mumbai</p>
                  <p className="text-xs text-[#0284c7] font-semibold mt-1 cursor-pointer hover:underline">Get directions</p>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Mon – Sat</p>
                  <p className="text-xs text-slate-500">09:00 AM – 05:00 PM</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#f8fffe] rounded-lg p-3 border border-[#0284c7]/15">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Shield className="w-3.5 h-3.5 text-[#0284c7]" /> Consultation fee
                </div>
                <span className="text-sm font-extrabold text-slate-900">₹800</span>
              </div>
            </div>

            {/* Desktop booking widget */}
            <div className="hidden lg:block bg-white rounded-sm border border-slate-100  p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0284c7]" /> Book an appointment
              </h3>

              {/* Date nav */}
              <div className="flex items-center justify-between mb-3 bg-slate-50 rounded-lg px-3 py-2">
                <button className="p-1 rounded hover:bg-slate-200 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </button>
                <span className="text-xs font-bold text-slate-700">Today, 24 Nov</span>
                <button className="p-1 rounded hover:bg-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Time slots */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {TIME_SLOTS.map((slot, i) => (
                  <button
                    key={slot}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${i < 2
                      ? 'bg-[#f0f9ff] text-[#0284c7] border-[#0284c7]/30 hover:bg-[#0284c7] hover:text-white'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#0284c7] hover:text-[#0284c7]'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <button className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-bold rounded-lg transition-colors">
                  Book clinic visit
                </button>
                <button className="w-full py-2.5 border border-[#0284c7] text-[#0284c7] text-sm font-bold rounded-lg hover:bg-[#f0f9ff] transition-colors flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" /> Video consult
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-50 flex items-center gap-3">
        <div className="shrink-0">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Fee</p>
          <p className="text-base font-extrabold text-slate-900">₹800</p>
        </div>
        <button className="flex-1 py-3 border border-[#0284c7] text-[#0284c7] font-bold text-sm rounded-sm flex items-center justify-center gap-2">
          <Video className="w-4 h-4" /> Video
        </button>
        <button className="flex-1 py-3 bg-[#0284c7] text-white font-bold text-sm rounded-sm">
          Book clinic
        </button>
      </div>
    </div>
  );
}