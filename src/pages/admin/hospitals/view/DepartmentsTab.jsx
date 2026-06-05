import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, UserCircle, HeartPulse, Brain, Bone, Eye, Baby, FlaskConical, Stethoscope } from 'lucide-react';

const DEPT_ICONS = {
  Cardiology:    { icon: HeartPulse, bg: 'bg-red-100',    icon_color: 'text-red-500'    },
  Neurology:     { icon: Brain,      bg: 'bg-violet-100', icon_color: 'text-violet-500' },
  Orthopedics:   { icon: Bone,       bg: 'bg-amber-100',  icon_color: 'text-amber-500'  },
  Ophthalmology: { icon: Eye,        bg: 'bg-cyan-100',   icon_color: 'text-cyan-500'   },
  Pediatrics:    { icon: Baby,       bg: 'bg-pink-100',   icon_color: 'text-pink-500'   },
  Pathology:     { icon: FlaskConical,bg:'bg-teal-100',   icon_color: 'text-teal-500'   },
};
const DEFAULT_ICON = { icon: Stethoscope, bg: 'bg-slate-100', icon_color: 'text-slate-500' };

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Cardiology',  head: 'Dr. Sarah Johnson', doctors: 4, nurses: 8,  beds: 24, status: 'active'   },
  { id: 2, name: 'Neurology',   head: 'Dr. Michael Chen',  doctors: 5, nurses: 9,  beds: 18, status: 'active'   },
  { id: 3, name: 'Orthopedics', head: 'Dr. Priya Patel',   doctors: 3, nurses: 6,  beds: 20, status: 'active'   },
  { id: 4, name: 'Pediatrics',  head: 'Dr. Mark Evans',    doctors: 6, nurses: 12, beds: 30, status: 'active'   },
  { id: 5, name: 'Pathology',   head: 'TBD',               doctors: 2, nurses: 4,  beds: 0,  status: 'inactive' },
];

const STATUS = {
  active:   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  inactive: { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200'      },
};

export default function DepartmentsTab() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDelete = (id) => setDepartments(d => d.filter(x => x.id !== id));

  const handleAdd = () => {
    const newId = Math.max(...departments.map(d => d.id)) + 1;
    setDepartments(d => [...d, {
      id: newId, name: `New Department`, head: 'TBD',
      doctors: 0, nurses: 0, beds: 0, status: 'inactive',
    }]);
  };

  const filtered = departments.filter(d =>
    (statusFilter === 'all' || d.status === statusFilter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = {
    doctors: departments.reduce((s, d) => s + d.doctors, 0),
    nurses:  departments.reduce((s, d) => s + d.nurses,  0),
    beds:    departments.reduce((s, d) => s + d.beds,    0),
  };

  return (
    <div className="space-y-5">

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Departments', value: departments.length, sub: `${departments.filter(d=>d.status==='active').length} active` },
          { label: 'Total Staff',       value: total.doctors + total.nurses, sub: `${total.doctors} doctors · ${total.nurses} nurses` },
          { label: 'Total Beds',        value: total.beds,  sub: 'across all departments' },
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search departments…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>

          {/* Status toggle pills */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {['all', 'active', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-white text-slate-800 '
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all "
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">
          <Stethoscope className="w-8 h-8 mx-auto mb-3 text-slate-200" />
          No departments found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept) => {
            const cfg    = DEPT_ICONS[dept.name] ?? DEFAULT_ICON;
            const DeptIcon = cfg.icon;
            const scfg   = STATUS[dept.status] ?? STATUS.inactive;
            const totalStaff = dept.doctors + dept.nurses;

            return (
              <div
                key={dept.id}
                className="bg-white border border-slate-200 rounded-xl p-5  hover:shadow-md hover:border-slate-300 transition-all group relative flex flex-col gap-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <DeptIcon className={`w-5 h-5 ${cfg.icon_color}`} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight">{dept.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <UserCircle className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">{dept.head}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset capitalize ${scfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                      {dept.status}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(dept.id)} className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Doctors', value: dept.doctors, color: 'text-blue-600',   bg: 'bg-blue-50'   },
                    { label: 'Nurses',  value: dept.nurses,  color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'Beds',    value: dept.beds,    color: 'text-teal-600',   bg: 'bg-teal-50'   },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`${bg} rounded-lg px-3 py-2.5 text-center`}>
                      <p className={`text-base font-semibold ${color}`}>{value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Staff progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-400">Staff breakdown</span>
                    <span className="text-[11px] font-medium text-slate-600">{totalStaff} total</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    {totalStaff > 0 ? (
                      <div className="h-full flex rounded-full overflow-hidden">
                        <div
                          className="bg-blue-400 transition-all"
                          style={{ width: `${(dept.doctors / totalStaff) * 100}%` }}
                        />
                        <div
                          className="bg-violet-300 transition-all"
                          style={{ width: `${(dept.nurses / totalStaff) * 100}%` }}
                        />
                      </div>
                    ) : (
                      <div className="h-full bg-slate-200 rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Doctors
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-violet-300 inline-block" /> Nurses
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}