import { useState, useEffect, useMemo } from 'react';
import { MapPin, Building2, Search, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const AVATAR_COLORS = [
  'bg-[#0284c7]', 'bg-indigo-500', 'bg-blue-500',
  'bg-violet-500', 'bg-teal-500',  'bg-cyan-600',
];

function abbr(name) {
  if (!name) return '';
  return name.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchHospitals(controller.signal);
    return () => controller.abort();
  }, [selectedCity, page, pageSize]);

  const fetchCities = async () => {
    try {
      const response = await api.get('/public/hospitals/filters');
      const data = response.data;
      if (data.cities) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchHospitals = async (signal) => {
    setLoading(true);
    try {
      let url = `/public/hospitals?page=${page}&page_size=${pageSize}`;
      if (selectedCity && selectedCity !== 'all') {
        url += `&city=${encodeURIComponent(selectedCity)}`;
      }
      
      const response = await api.get(url, { signal });
      const data = response.data;
      setHospitals(data.hospitals || []);
      setTotal(data.total || 0);
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Error fetching hospitals:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return hospitals;
    const lower = search.toLowerCase();
    return hospitals.filter(h => h.name?.toLowerCase().includes(lower));
  }, [hospitals, search]);

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-12 font-sans">

      {/* Green header */}
      <div className="bg-[#0284c7] pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Partner Hospitals</h1>
          <p className="text-sky-100 text-sm">Leading institutions that trust MedExpert for expert second opinions.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">

        {/* Search + filter toolbar */}
        <div className="bg-white rounded-sm border border-slate-100 p-4 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hospitals…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/40 focus:border-[#0284c7] placeholder-slate-400 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setPage(1); // Reset page on filter change
              }}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/40 focus:border-[#0284c7] text-slate-600 transition min-w-[150px]"
            >
              <option value="all">All Cities</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-500 mb-4 px-1">
          <span className="font-bold text-slate-800">{total}</span> hospital{total !== 1 ? 's' : ''} found
        </p>

        {/* Cards */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0284c7]"></div>
           </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((h, i) => {
                return (
                  <div key={h.hospital_id || i} className="bg-white rounded-sm border border-slate-100 hover:shadow-sm hover:border-[#0284c7]/30 transition-all duration-200 group overflow-hidden flex flex-col">

                    <div className="p-5 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {abbr(h.name)}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug">{h.name}</h3>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-2 mb-5 flex-1">
                        <div className="flex items-start gap-2 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" strokeWidth={1.8} />
                          {h.address || `${h.city}, ${h.state}`}
                        </div>
                      </div>

                      {/* Departments */}
                      {h.departments && h.departments.length > 0 && (
                        <div className="mb-4">
                           <p className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Departments</p>
                           <div className="flex flex-wrap gap-1.5">
                             {h.departments.slice(0, 3).map((dept, idx) => (
                               <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 font-medium">
                                 {dept}
                               </span>
                             ))}
                             {h.departments.length > 3 && (
                               <span className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 font-medium">
                                 +{h.departments.length - 3} more
                               </span>
                             )}
                           </div>
                        </div>
                      )}

                      {/* CTA */}
                      <button className="w-full mt-auto flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-[#0284c7] bg-[#f0f9ff] hover:bg-[#0284c7] hover:text-white rounded-lg border border-[#0284c7]/20 hover:border-[#0284c7] transition-all duration-200 active:scale-[0.98]">
                        View hospital <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-sm border border-slate-100">
                  <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  <p className="text-sm font-semibold text-slate-600">No hospitals match your search</p>
                  <button
                    onClick={() => { setSearch(''); setSelectedCity('all'); setPage(1); }}
                    className="mt-4 px-5 py-2 bg-[#0284c7] text-white text-sm font-semibold rounded-lg hover:bg-[#0369a1] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600 font-medium px-4">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}