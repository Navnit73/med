import { useState } from 'react';
import { MapPin, Phone, Building2, Search, ArrowUpRight, Users, Stethoscope, CheckCircle2 } from 'lucide-react';

const HOSPITALS = [
  { name: 'Apollo Medical Center',         address: '120 Wellness Blvd, San Francisco', phone: '+1 415 555 0101', staff: 420, doctors: 64, status: 'active'   },
  { name: 'Mercy General Hospital',        address: '88 Lakeshore Dr, Chicago',         phone: '+1 312 555 0144', staff: 312, doctors: 48, status: 'active'   },
  { name: 'Sunrise Specialty Clinic',      address: '55 Sunset Ave, Los Angeles',       phone: '+1 213 555 0177', staff: 145, doctors: 22, status: 'pending'  },
  { name: 'Greenfield Hospital',           address: '200 Beacon St, Boston',            phone: '+1 617 555 0192', staff: 268, doctors: 35, status: 'inactive' },
  { name: 'Cedar Park Medical',            address: '740 Oak Hill, Austin',             phone: '+1 512 555 0166', staff: 510, doctors: 72, status: 'active'   },
  { name: "Northstar Children's Hospital", address: '99 Starlight Way, Seattle',        phone: '+1 206 555 0188', staff: 380, doctors: 55, status: 'active'   },
];

const STATUS = {
  active:   { label: 'Active',   dotColor: 'bg-[#2DB37D]', badge: 'bg-[#edf9f4] text-[#1a8a5e] ring-[#2DB37D]/20' },
  pending:  { label: 'Pending',  dotColor: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 ring-amber-200'       },
  inactive: { label: 'Inactive', dotColor: 'bg-slate-300', badge: 'bg-slate-100 text-slate-500 ring-slate-200'      },
};

const AVATAR_COLORS = [
  'bg-[#2DB37D]', 'bg-indigo-500', 'bg-blue-500',
  'bg-violet-500', 'bg-teal-500',  'bg-cyan-600',
];

function abbr(name) {
  return name.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
}

export default function Hospitals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('all');

  const filtered = HOSPITALS.filter(h =>
    (statusFilter === 'all' || h.status === statusFilter) &&
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    all: HOSPITALS.length,
    active: HOSPITALS.filter(h => h.status === 'active').length,
    pending: HOSPITALS.filter(h => h.status === 'pending').length,
    inactive: HOSPITALS.filter(h => h.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-12 font-sans">

      {/* Green header */}
      <div className="bg-[#2DB37D] pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Partner Hospitals</h1>
          <p className="text-green-100 text-sm">Leading institutions that trust MedExpert for expert second opinions.</p>
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/40 focus:border-[#2DB37D] placeholder-slate-400 transition"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'active', 'pending', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-[#2DB37D] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-[#edf9f4] hover:text-[#2DB37D]'
                }`}
              >
                {s === 'all' ? 'All' : s}
                <span className={`text-[10px] px-1 py-0.5 rounded ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-500 mb-4 px-1">
          <span className="font-bold text-slate-800">{filtered.length}</span> hospital{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h, i) => {
            const scfg = STATUS[h.status];
            return (
              <div key={i} className="bg-white rounded-sm border border-slate-100 hover:shadow-sm hover:border-[#2DB37D]/30 transition-all duration-200 group overflow-hidden flex flex-col">

             

                <div className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {abbr(h.name)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2DB37D] transition-colors leading-snug">{h.name}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ring-inset shrink-0 ml-2 ${scfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${scfg.dotColor}`} />
                      {scfg.label}
                    </span>
                  </div>

                  {/* Address + phone */}
                  <div className="space-y-2 mb-5 flex-1">
                    {[
                      { icon: MapPin, text: h.address },
                      { icon: Phone,  text: h.phone   },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-start gap-2 text-xs text-slate-500">
                        <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" strokeWidth={1.8} />
                        {text}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-[#f0faf5] rounded-lg px-3 py-2.5 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#2DB37D] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#1a8a5e]">{h.staff}</p>
                        <p className="text-[10px] text-slate-500">Total Staff</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-indigo-700">{h.doctors}</p>
                        <p className="text-[10px] text-slate-500">Doctors</p>
                      </div>
                    </div>
                  </div>

                  {/* Accreditations */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {['NABH', 'ISO', 'JCI'].slice(0, h.status === 'active' ? 3 : 1).map(acc => (
                      <span key={acc} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#2DB37D]" /> {acc}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-[#2DB37D] bg-[#edf9f4] hover:bg-[#2DB37D] hover:text-white rounded-lg border border-[#2DB37D]/20 hover:border-[#2DB37D] transition-all duration-200 active:scale-[0.98]">
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
                onClick={() => { setSearch(''); setStatus('all'); }}
                className="mt-4 px-5 py-2 bg-[#2DB37D] text-white text-sm font-semibold rounded-lg hover:bg-[#24a06e] transition-colors"
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