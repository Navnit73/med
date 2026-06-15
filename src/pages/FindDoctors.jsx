import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, GraduationCap, ChevronRight, ThumbsUp, Video, Clock } from 'lucide-react';
import { DOCTORS, SPECIALTIES, SPECIALTY_ICONS, DEFAULT_ICON, AVATAR_COLORS } from '../data/mockDoctors';

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function FindDoctors() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const navigate = useNavigate();

  const filtered = DOCTORS.filter(d => {
    const matchSpecialty = filter === 'All' || d.specialty === filter;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                        d.hospital.toLowerCase().includes(search.toLowerCase()) ||
                        d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchLocation = locationSearch === '' || d.hospital.toLowerCase().includes(locationSearch.toLowerCase());
    
    return matchSpecialty && matchSearch && matchLocation;
  });

  return (
    <div className="min-h-[100dvh] bg-slate-50 pt-16 pb-10">

      {/* Top search bar (Practo green header) */}
      <div className="bg-[#0284c7] pt-8 pb-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Find the right specialist</h1>
          <p className="text-sky-100 text-sm mb-6">Search by doctor, specialty or hospital name</p>
          <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden max-w-3xl mx-auto divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="flex items-center gap-2 px-4 flex-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                className="w-full py-3 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 px-4 flex-[2]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search doctors, clinics, hospitals, etc."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-3 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400"
              />
            </div>
            <button className="px-8 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold transition-colors shrink-0">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">

        {/* Specialty filter pill row */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === s
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-[#0284c7] hover:text-[#0284c7]'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-500 mb-4 font-medium px-1">
          <span className="text-slate-800 font-bold">{filtered.length}</span> verified specialist{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Doctor list — Practo uses list cards not grid */}
        <div className="space-y-3">
          {filtered.map((doc, i) => {
            const SpecIcon = SPECIALTY_ICONS[doc.specialty] ?? DEFAULT_ICON;
            const originalIndex = DOCTORS.findIndex(d => d.name === doc.name);
            const avatarBg = AVATAR_COLORS[originalIndex % AVATAR_COLORS.length];

            return (
              <div
                key={i}
                onClick={() => navigate(`/find-doctors/${doc.id}`)}
                className="bg-white rounded-xl border border-slate-100 hover:border-[#0284c7]/40 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">

                  {/* Avatar */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className={`w-20 h-20 rounded-xl ${avatarBg} flex items-center justify-center text-xl font-extrabold text-white border border-white/20`}>
                      {initials(doc.name)}
                    </div>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">{doc.name}</h3>
                      <div className="flex items-center gap-1.5 bg-[#f0f9ff] px-2.5 py-1 rounded-md">
                        <ThumbsUp className="w-3 h-3 text-[#0284c7] fill-[#0284c7]" />
                        <span className="text-xs font-bold text-[#0284c7]">{doc.rating}%</span>
                        <span className="text-[10px] text-slate-400">({doc.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-100">
                        <SpecIcon className="w-3 h-3" /> {doc.specialty}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.exp} experience
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.qual}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.hospital}
                      </div>
                    </div>

                    {/* Fee + action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Consult fee</p>
                          <p className="text-sm font-bold text-slate-800">₹800</p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" /> Available today
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/find-doctors/${doc.id}`); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#0284c7] border border-[#0284c7] rounded-lg hover:bg-[#0284c7] hover:text-white transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" /> Video consult
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/find-doctors/${doc.id}`); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold bg-[#0284c7] text-white rounded-lg hover:bg-[#0369a1] transition-colors"
                        >
                          Book clinic visit <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 bg-white rounded-xl border border-slate-100 text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No specialists found</h3>
              <p className="text-sm text-slate-500 mb-5">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(''); setFilter('All'); }}
                className="px-6 py-2.5 bg-[#0284c7] text-white text-sm font-semibold rounded-lg hover:bg-[#0369a1] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}