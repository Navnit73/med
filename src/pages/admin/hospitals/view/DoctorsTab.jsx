import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, UserCircle, Stethoscope, GraduationCap, Clock, HeartPulse, Brain, Scan, Baby, Bone, FlaskConical } from 'lucide-react';

const SPECIALTY_CONFIG = {
  Cardiology:    { bg: 'bg-red-100',    text: 'text-red-700',    icon: HeartPulse,    avatar: 'bg-red-100 text-red-700'    },
  Neurology:     { bg: 'bg-violet-100', text: 'text-violet-700', icon: Brain,         avatar: 'bg-violet-100 text-violet-700' },
  Radiology:     { bg: 'bg-cyan-100',   text: 'text-cyan-700',   icon: Scan,          avatar: 'bg-cyan-100 text-cyan-700'  },
  Pediatrics:    { bg: 'bg-pink-100',   text: 'text-pink-700',   icon: Baby,          avatar: 'bg-pink-100 text-pink-700'  },
  Orthopedics:   { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: Bone,          avatar: 'bg-amber-100 text-amber-700'},
  Pathology:     { bg: 'bg-teal-100',   text: 'text-teal-700',   icon: FlaskConical,  avatar: 'bg-teal-100 text-teal-700'  },
  General:       { bg: 'bg-slate-100',  text: 'text-slate-600',  icon: Stethoscope,   avatar: 'bg-slate-100 text-slate-600'},
};
const DEFAULT_SPEC = { bg: 'bg-slate-100', text: 'text-slate-600', icon: Stethoscope, avatar: 'bg-slate-100 text-slate-600' };

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology',  exp: 4,  degree: 'MBBS, MD', status: 'active',   patients: 28, rating: 4.8 },
  { id: 2, name: 'Dr. Aisha Khan',    specialty: 'Radiology',   exp: 10, degree: 'MBBS, MS', status: 'active',   patients: 41, rating: 4.9 },
  { id: 3, name: 'Dr. Michael Chen',  specialty: 'Neurology',   exp: 7,  degree: 'MBBS, DM', status: 'inactive', patients: 0,  rating: 4.6 },
  { id: 4, name: 'Dr. Priya Patel',   specialty: 'Pediatrics',  exp: 5,  degree: 'MBBS, MD', status: 'active',   patients: 33, rating: 4.7 },
];

const SPECIALTIES = ['All', ...Array.from(new Set(INITIAL_DOCTORS.map(d => d.specialty)))];

const STATUS = {
  active:   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  inactive: { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200'      },
};

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-slate-600">{rating}</span>
    </div>
  );
}

export default function DoctorsTab() {
  const [doctors, setDoctors]           = useState(INITIAL_DOCTORS);
  const [search, setSearch]             = useState('');
  const [specialtyFilter, setSpecialty] = useState('All');
  const [statusFilter, setStatus]       = useState('all');

  const handleDelete = (id) => setDoctors(d => d.filter(x => x.id !== id));

  const handleAdd = () => {
    const newId = Math.max(...doctors.map(d => d.id)) + 1;
    setDoctors(d => [...d, {
      id: newId, name: `Dr. New Doctor`, specialty: 'General',
      exp: 0, degree: 'MBBS', status: 'active', patients: 0, rating: 0,
    }]);
  };

  const filtered = doctors.filter(d =>
    (specialtyFilter === 'All' || d.specialty === specialtyFilter) &&
    (statusFilter === 'all' || d.status === statusFilter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total:    doctors.length,
    active:   doctors.filter(d => d.status === 'active').length,
    inactive: doctors.filter(d => d.status === 'inactive').length,
  };

  return (
    <div className="space-y-5">

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Doctors',    value: counts.total,    sub: 'on record'       },
          { label: 'Active',           value: counts.active,   sub: 'currently active' },
          { label: 'On Leave',         value: counts.inactive, sub: 'unavailable'     },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl px-5 py-4 ">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>

          {/* Specialty select */}
          <select
            value={specialtyFilter}
            onChange={e => setSpecialty(e.target.value)}
            className="py-1.5 pl-3 pr-8 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 transition appearance-none"
          >
            {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Status toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {['all', 'active', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  statusFilter === s ? 'bg-white text-slate-800 ' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all  shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">
          <UserCircle className="w-8 h-8 mx-auto mb-3 text-slate-200" />
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => {
            const spec  = SPECIALTY_CONFIG[doc.specialty] ?? DEFAULT_SPEC;
            const SpecIcon = spec.icon;
            const scfg  = STATUS[doc.status] ?? STATUS.active;

            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-5  hover:shadow-md hover:border-slate-300 transition-all group"
              >
                {/* Top row */}
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${spec.avatar}`}>
                    {initials(doc.name)}
                  </div>

                  {/* Name + specialty */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset capitalize ${scfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                        {doc.status}
                      </span>
                    </div>

                    {/* Specialty pill */}
                    <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${spec.bg} ${spec.text}`}>
                      <SpecIcon className="w-3 h-3" strokeWidth={2} />
                      {doc.specialty}
                    </span>
                  </div>

                  {/* Action buttons — always visible but subtle */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-4" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: GraduationCap, label: 'Qualification', value: doc.degree  },
                    { icon: Clock,         label: 'Experience',    value: `${doc.exp} yrs` },
                    { icon: UserCircle,    label: 'Patients',      value: doc.patients  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3 text-slate-400" strokeWidth={1.8} />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Rating + edit button */}
                <div className="flex items-center justify-between">
                  <Stars rating={doc.rating} />
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <Edit className="w-3 h-3" />
                    Edit Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}