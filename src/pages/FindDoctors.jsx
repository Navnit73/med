import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, GraduationCap, ChevronRight, ThumbsUp, Video, Clock } from 'lucide-react';
import { SPECIALTY_ICONS, DEFAULT_ICON, AVATAR_COLORS } from '../data/mockDoctors';

function initials(name) {
  if (!name) return 'DR';
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function FindDoctors() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filtersData, setFiltersData] = useState({ cities: [], departments: [], hospitals: [] });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch filters
    axios.get(`${API_BASE_URL}/public/doctors/filters`, {
      headers: { 'accept': 'application/json' }
    })
      .then(res => {
        const data = res.data;
        setFiltersData({
          cities: data.cities || [],
          departments: data.departments || [],
          hospitals: data.hospitals || []
        });
      })
      .catch(err => console.error('Error fetching filters:', err));
  }, []);

  useEffect(() => {
    // Fetch doctors
    setLoading(true);
    axios.get(`${API_BASE_URL}/public/doctors`, {
      params: {
        page: 1,
        page_size: 100
      },
      headers: { 'accept': 'application/json' }
    })
      .then(res => {
        const data = res.data;
        setDoctors(data.doctors || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  const filtered = doctors.filter(d => {
    const matchSpecialty = filter === 'All' || d.department_name === filter;
    
    const searchLower = search.toLowerCase();
    const matchSearch = search === '' || 
                        (d.name && d.name.toLowerCase().includes(searchLower)) || 
                        (d.hospital_name && d.hospital_name.toLowerCase().includes(searchLower)) ||
                        (d.department_name && d.department_name.toLowerCase().includes(searchLower)) ||
                        (d.speciality && d.speciality.toLowerCase().includes(searchLower));
                        
    const locLower = locationSearch.toLowerCase();
    const matchLocation = locationSearch === '' || 
                          (d.city && d.city.toLowerCase().includes(locLower)) ||
                          (d.hospital_name && d.hospital_name.toLowerCase().includes(locLower));
    
    return matchSpecialty && matchSearch && matchLocation;
  });

  const displayDepartments = ['All', ...filtersData.departments];

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
                placeholder="Location (City or Hospital)"
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
            {displayDepartments.map((s, idx) => (
              <button
                key={idx}
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
          {loading ? (
            <span>Loading doctors...</span>
          ) : (
            <>
              <span className="text-slate-800 font-bold">{filtered.length}</span> verified specialist{filtered.length !== 1 ? 's' : ''} found
            </>
          )}
        </p>

        {/* Doctor list */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Fetching data...</div>
          ) : filtered.map((doc, i) => {
            const SpecIcon = SPECIALTY_ICONS[doc.department_name] || SPECIALTY_ICONS[doc.speciality] || DEFAULT_ICON;
            const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];

            return (
              <div
                key={doc.doctor_id || i}
                onClick={() => navigate(`/find-doctors/${doc.doctor_id}`)}
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
                        <span className="text-xs font-bold text-[#0284c7]">{doc.average_rating || 0}</span>
                        <span className="text-[10px] text-slate-400">({doc.total_reviews || 0})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-100">
                        <SpecIcon className="w-3 h-3" /> {doc.department_name || doc.speciality || 'General'}
                      </span>
                      {doc.sub_speciality && (
                         <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-100">
                           {doc.sub_speciality}
                         </span>
                      )}
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.experience_years || 0} years experience
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.qualification || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.hospital_name || 'Not specified'} {doc.city ? `, ${doc.city}` : ''}
                      </div>
                    </div>

                    {/* Fee + action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Consult fee</p>
                          <p className="text-sm font-bold text-slate-800">₹{doc.in_person_consultation_fee || doc.online_consultation_fee || 0}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" /> Available today
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.online_consultation_fee > 0 && (
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/find-doctors/${doc.doctor_id}`); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#0284c7] border border-[#0284c7] rounded-lg hover:bg-[#0284c7] hover:text-white transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" /> Video consult
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/find-doctors/${doc.doctor_id}`); }}
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

          {!loading && filtered.length === 0 && (
            <div className="py-16 bg-white rounded-xl border border-slate-100 text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No specialists found</h3>
              <p className="text-sm text-slate-500 mb-5">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(''); setLocationSearch(''); setFilter('All'); }}
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