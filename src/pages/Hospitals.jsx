import React, { useState } from 'react';
import { MapPin, Phone, Users, ChevronRight, Building2, Search, ArrowUpRight } from 'lucide-react';

const HOSPITALS = [
  { name: 'Apollo Medical Center',       address: '120 Wellness Blvd, San Francisco', phone: '+1 415 555 0101', staff: 420, doctors: 64, status: 'active'   },
  { name: 'Mercy General Hospital',      address: '88 Lakeshore Dr, Chicago',         phone: '+1 312 555 0144', staff: 312, doctors: 48, status: 'active'   },
  { name: 'Sunrise Specialty Clinic',    address: '55 Sunset Ave, Los Angeles',       phone: '+1 213 555 0177', staff: 145, doctors: 22, status: 'pending'  },
  { name: 'Greenfield Hospital',         address: '200 Beacon St, Boston',            phone: '+1 617 555 0192', staff: 268, doctors: 35, status: 'inactive' },
  { name: 'Cedar Park Medical',          address: '740 Oak Hill, Austin',             phone: '+1 512 555 0166', staff: 510, doctors: 72, status: 'active'   },
  { name: "Northstar Children's Hospital",address:'99 Starlight Way, Seattle',        phone: '+1 206 555 0188', staff: 380, doctors: 55, status: 'active'   },
];

const STATUS = {
  active:   { label: 'Active',   dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  pending:  { label: 'Pending',  dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 ring-amber-200'       },
  inactive: { label: 'Inactive', dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200'      },
};

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-violet-600', 'bg-blue-600',
  'bg-cyan-600',   'bg-teal-600',   'bg-purple-600',
];

function abbr(name) {
  return name.split(' ').filter(w => w.length > 3).slice(0,2).map(w => w[0]).join('').toUpperCase() || name.slice(0,2).toUpperCase();
}

export default function Hospitals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('all');

  const filtered = HOSPITALS.filter(h =>
    (statusFilter === 'all' || h.status === statusFilter) &&
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Partner Hospitals</h1>
          <p className="text-slate-500 max-w-xl">Leading institutions across the country trust MedExpert to coordinate expert second opinions.</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hospitals…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'active', 'pending', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h, i) => {
            const scfg = STATUS[h.status];
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-200 group overflow-hidden flex flex-col">

         

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {abbr(h.name)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">{h.name}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset shrink-0 ml-2 ${scfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                      {scfg.label}
                    </span>
                  </div>

                  {/* Info */}
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

                  {/* Staff stats */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                      { label: 'Total Staff', value: h.staff,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { label: 'Doctors',     value: h.doctors, color: 'text-violet-600', bg: 'bg-violet-50' },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-xl px-3 py-2.5 text-center`}>
                        <p className={`text-lg font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl border border-indigo-100 hover:border-indigo-600 transition-all duration-200 active:scale-[0.98]">
                    Learn more <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-3 text-slate-200" />
              No hospitals match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}