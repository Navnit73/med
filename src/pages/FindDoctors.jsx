import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, GraduationCap, ChevronRight, Star } from 'lucide-react';
import { DOCTORS, SPECIALTIES, SPECIALTY_ICONS, DEFAULT_ICON, AVATAR_COLORS } from '../data/mockDoctors';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
      <span className="text-xs font-bold text-amber-700">{rating}</span>
    </div>
  );
}

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

export default function FindDoctors() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = DOCTORS.filter(d =>
    (filter === 'All' || d.specialty === filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.hospital.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-20 md:pt-28 pb-20 min-h-[100dvh] bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-6 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 md:mb-3 tracking-tight">Find a Specialist</h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed mx-auto md:mx-0">
            Connect with top-rated board-certified doctors. Filter by specialty to find the right medical expert for your health needs.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white md:rounded-3xl p-3 md:p-4 mb-6 md:mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-y md:border border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4 items-center sticky top-[60px] md:top-20 z-20 -mx-4 md:mx-0 px-4 md:px-4">
          <div className="relative w-full bg-slate-50 rounded-xl md:rounded-2xl group transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:shadow-md border border-slate-200/50 md:border-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by doctor or hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-sm md:text-base text-slate-900 focus:outline-none focus:ring-0 placeholder-slate-400"
            />
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto scrollbar-hide pb-1 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 bg-transparent md:bg-slate-50 p-1 md:p-1.5 rounded-2xl md:border border-slate-100 min-w-max">
              {SPECIALTIES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    filter === s
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white md:bg-transparent text-slate-600 hover:text-slate-900 border border-slate-200 md:border-none'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-slate-500 mb-4 md:mb-6 font-medium px-1">
          Showing <span className="text-slate-900 font-bold">{filtered.length}</span> verified specialist{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
          {filtered.map((doc, i) => {
            const SpecIcon = SPECIALTY_ICONS[doc.specialty] ?? DEFAULT_ICON;
            const originalIndex = DOCTORS.findIndex(d => d.name === doc.name);
            const avatarClass = AVATAR_COLORS[originalIndex % AVATAR_COLORS.length];

            return (
              <div 
                key={i} 
                onClick={() => navigate(`/find-doctors/${doc.id}`)}
                className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-100/80 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group flex flex-col cursor-pointer active:scale-[0.99]"
              >
                {/* Header */}
                <div className="flex items-start gap-4 md:gap-5 mb-5 md:mb-6">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-lg md:text-xl font-extrabold shrink-0 shadow-sm border border-white ${avatarClass}`}>
                    {initials(doc.name)}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-1">{doc.name}</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 text-[11px] md:text-xs font-semibold rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
                      <SpecIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      {doc.specialty}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 md:mb-8 flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-50">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[13px] md:text-sm font-medium text-slate-700 leading-tight">{doc.hospital}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-[13px] md:text-sm font-medium text-slate-600">{doc.exp} Experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-[13px] md:text-sm font-medium text-slate-600 truncate">{doc.qual}</span>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <Stars rating={doc.rating} />
                  <button className="flex items-center gap-1.5 px-3 md:px-4 py-2 text-[13px] md:text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-3xl border border-slate-100 text-center shadow-sm mx-4 md:mx-0">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No specialists found</h3>
              <p className="text-sm md:text-base text-slate-500 px-4">Try adjusting your search filters to find what you're looking for.</p>
              <button 
                onClick={() => {setSearch(''); setFilter('All');}}
                className="mt-6 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}