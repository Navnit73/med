import React, { useState } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, HeartPulse, Brain, Activity, Bone, Baby, Sun, Microscope, Scissors, Stethoscope, SlidersHorizontal } from 'lucide-react';

const SPECIALTY_ICONS = { Cardiology: HeartPulse, Neurology: Brain, Oncology: Activity, Orthopedics: Bone, Pediatrics: Baby, Dermatology: Sun, Radiology: Microscope, 'General Surgery': Scissors };
const DEFAULT_ICON = Stethoscope;

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700', 'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',     'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',   'bg-cyan-100 text-cyan-700',
];

const DOCTORS = [
  { name: 'Dr. Sarah Johnson',  specialty: 'Cardiology',     hospital: 'Apollo Medical Center',       exp: '4 years', qual: 'MBBS, MD',  rating: 4.9 },
  { name: 'Dr. Michael Chen',   specialty: 'Neurology',      hospital: 'Mercy General Hospital',      exp: '5 years', qual: 'MBBS, MS',  rating: 4.8 },
  { name: 'Dr. Priya Patel',    specialty: 'Oncology',       hospital: 'Sunrise Specialty Clinic',    exp: '6 years', qual: 'MBBS, DM',  rating: 4.9 },
  { name: 'Dr. James Wilson',   specialty: 'Orthopedics',    hospital: 'Greenfield Hospital',         exp: '7 years', qual: 'MBBS, MCh', rating: 4.7 },
  { name: 'Dr. Emily Rodriguez',specialty: 'Pediatrics',     hospital: 'Cedar Park Medical',          exp: '8 years', qual: 'MBBS, DNB', rating: 4.8 },
  { name: 'Dr. David Kim',      specialty: 'Dermatology',    hospital: "Northstar Children's Hospital",exp: '9 years', qual: 'MBBS, MD',  rating: 4.6 },
  { name: 'Dr. Aisha Khan',     specialty: 'Radiology',      hospital: 'Apollo Medical Center',       exp: '10 years',qual: 'MBBS, MS',  rating: 4.9 },
  { name: 'Dr. Robert Garcia',  specialty: 'General Surgery',hospital: 'Mercy General Hospital',      exp: '11 years',qual: 'MBBS, DM',  rating: 4.7 },
  { name: 'Dr. Linda Thompson', specialty: 'Cardiology',     hospital: 'Sunrise Specialty Clinic',    exp: '12 years',qual: 'MBBS, MCh', rating: 4.8 },
];

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Radiology'];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-600">{rating}</span>
    </div>
  );
}

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

export default function FindDoctors() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = DOCTORS.filter(d =>
    (filter === 'All' || d.specialty === filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.hospital.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Find a specialist</h1>
          <p className="text-slate-500 max-w-xl">Search across board-certified specialists. Filter by specialty to find the right expert for your case.</p>
        </div>

        {/* Search bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === s
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-400 mb-5 font-medium">
          Showing <span className="text-slate-600 font-semibold">{filtered.length}</span> specialist{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc, i) => {
            const SpecIcon = SPECIALTY_ICONS[doc.specialty] ?? DEFAULT_ICON;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-200 group flex flex-col">

                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    {initials(doc.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">{doc.name}</h3>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-md">
                      <SpecIcon className="w-3 h-3" strokeWidth={2} />
                      {doc.specialty}
                    </span>
                  </div>
                  <Stars rating={doc.rating} />
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6 flex-1">
                  {[
                    { icon: MapPin,        text: doc.hospital },
                    { icon: Briefcase,     text: `${doc.exp} experience` },
                    { icon: GraduationCap, text: doc.qual },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.8} />
                      {text}
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl border border-indigo-100 hover:border-indigo-600 transition-all duration-200 active:scale-[0.98]">
                  Request consultation
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Stethoscope className="w-8 h-8 mx-auto mb-3 text-slate-200" />
              No specialists match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}