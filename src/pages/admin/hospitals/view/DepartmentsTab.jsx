import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, UserCircle, HeartPulse, Brain, Bone, Eye, Baby, FlaskConical, Stethoscope, Users, Activity } from 'lucide-react';
import DepartmentForm from './DepartmentForm';

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
  { id: 1, name: 'Cardiology',  head: 'Dr. Sarah Johnson', doctors: ['Dr. Sarah Johnson', 'Dr. John Doe', 'Dr. Alice Smith'], patients: 145, status: 'active' },
  { id: 2, name: 'Neurology',   head: 'Dr. Michael Chen',  doctors: ['Dr. Michael Chen', 'Dr. Bob Williams'], patients: 87, status: 'active' },
  { id: 3, name: 'Orthopedics', head: 'Dr. Priya Patel',   doctors: ['Dr. Priya Patel', 'Dr. Emily Clark', 'Dr. David Jones'], patients: 112, status: 'active' },
  { id: 4, name: 'Pediatrics',  head: 'Dr. Mark Evans',    doctors: ['Dr. Mark Evans', 'Dr. Emma Watson', 'Dr. James Lee'], patients: 189, status: 'active' },
  { id: 5, name: 'Pathology',   head: 'TBD',               doctors: [], patients: 0, status: 'inactive' },
];

const STATUS = {
  active:   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  inactive: { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200'      },
};

export default function DepartmentsTab() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [view, setView] = useState('list');
  const [selectedDept, setSelectedDept] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this speciality?")) {
      setDepartments(d => d.filter(x => x.id !== id));
    }
  };

  const handleSave = (deptData) => {
    if (selectedDept && selectedDept.id === deptData.id) {
      setDepartments(d => d.map(x => x.id === deptData.id ? deptData : x));
    } else {
      setDepartments(d => [...d, deptData]);
    }
    setView('list');
    setSelectedDept(null);
  };

  const openAddForm = () => {
    setSelectedDept(null);
    setView('form');
  };

  const openEditForm = (dept) => {
    setSelectedDept(dept);
    setView('form');
  };

  const filtered = departments.filter(d =>
    (statusFilter === 'all' || d.status === statusFilter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = {
    doctors: departments.reduce((s, d) => s + (d.doctors ? d.doctors.length : 0), 0),
    patients: departments.reduce((s, d) => s + d.patients, 0),
  };

  if (view === 'form') {
    return (
      <DepartmentForm 
        department={selectedDept}
        onSave={handleSave}
        onCancel={() => { setView('list'); setSelectedDept(null); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Specialities', value: departments.length, sub: `${departments.filter(d=>d.status==='active').length} active` },
          { label: 'Assigned Doctors',   value: total.doctors, sub: `across all specialities` },
          { label: 'Total Patients',     value: total.patients,  sub: 'currently treated' },
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
              placeholder="Search specialities…"
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
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all "
        >
          <Plus className="w-4 h-4" />
          Add Speciality
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400 bg-white border border-slate-200 rounded-xl">
          <Stethoscope className="w-8 h-8 mx-auto mb-3 text-slate-200" />
          No specialities found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept) => {
            const cfg    = DEPT_ICONS[dept.name] ?? DEFAULT_ICON;
            const DeptIcon = cfg.icon;
            const scfg   = STATUS[dept.status] ?? STATUS.inactive;

            return (
              <div
                key={dept.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all group relative flex flex-col gap-4"
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
                      <button onClick={() => openEditForm(dept)} className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
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

                {/* Assigned Doctors List */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Assigned Doctors
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {dept.doctors ? dept.doctors.length : 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.doctors && dept.doctors.length > 0 ? (
                      dept.doctors.map((doc, i) => (
                        <span key={i} className="text-[11px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {doc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No doctors assigned</span>
                    )}
                  </div>
                </div>

                {/* Stats / Patients */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-blue-900">Total Patients</span>
                  </div>
                  <span className="text-lg font-bold text-blue-700">{dept.patients}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}