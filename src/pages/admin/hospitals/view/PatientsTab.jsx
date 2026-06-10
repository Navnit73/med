import { useState } from 'react';
import { Search, Edit, Trash2, UserPlus, Users, UserCheck, UserX, Activity } from 'lucide-react';

const INITIAL_PATIENTS = [
  { id: 'MRN-10000', name: 'Alex Smith',  gender: 'Male',   ward: 'ICU',     doctor: 'Dr. Sarah Johnson', condition: 'Hypertension', status: 'admitted'   },
  { id: 'MRN-10006', name: 'Omar Davis',  gender: 'Male',   ward: 'ICU',     doctor: 'Dr. Priya Patel',   condition: 'Appendicitis', status: 'admitted'   },
  { id: 'MRN-10012', name: 'Alex Lee',    gender: 'Male',   ward: 'ICU',     doctor: 'Dr. Sarah Johnson', condition: 'Migraine',     status: 'admitted'   },
  { id: 'MRN-10018', name: 'Sara Chen',   gender: 'Female', ward: 'General', doctor: 'Dr. Priya Patel',   condition: 'Observation',  status: 'outpatient' },
  { id: 'MRN-10024', name: 'James Okon',  gender: 'Male',   ward: 'Cardio',  doctor: 'Dr. Mark Evans',    condition: 'Arrhythmia',   status: 'discharged' },
];

const STATUS = {
  admitted:   { label: 'Admitted',    dot: 'bg-[#2DB37D]',    badge: 'bg-[#edf9f4] text-[#2DB37D] ring-[#2DB37D]/30' },
  outpatient: { label: 'Outpatient',  dot: 'bg-violet-400',  badge: 'bg-violet-50 text-violet-700 ring-violet-200' },
  discharged: { label: 'Discharged',  dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200' },
  critical:   { label: 'Critical',    dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 ring-red-200' },
};

const WARD_COLOR = {
  ICU:     'bg-red-50 text-red-700',
  General: 'bg-slate-100 text-slate-600',
  Cardio:  'bg-pink-50 text-pink-700',
  Neuro:   'bg-violet-50 text-violet-700',
};

const GENDER_COLOR = {
  Male:   'bg-slate-100 text-slate-700',
  Female: 'bg-slate-100 text-slate-700',
};

function avatar(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = [
  'bg-[#edf9f4] text-[#2DB37D]',
  'bg-teal-100 text-teal-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
];

export default function PatientsTab() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  const handleDelete = (id) => setPatients(p => p.filter(x => x.id !== id));

  const handleAdd = () => {
    const newNum = 10000 + patients.length * 6;
    setPatients(p => [...p, {
      id: `MRN-${newNum}`, name: `New Patient`, gender: 'Female',
      ward: 'General', doctor: 'Dr. Unassigned', condition: 'Observation', status: 'admitted',
    }]);
  };

  const counts = {
    all:        patients.length,
    admitted:   patients.filter(p => p.status === 'admitted').length,
    outpatient: patients.filter(p => p.status === 'outpatient').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
  };

  const filtered = patients.filter(p =>
    (filter === 'all' || p.status === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.id.toLowerCase().includes(search.toLowerCase()) ||
     p.doctor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'all',        label: 'Total Patients', icon: Users,      bg: 'bg-slate-50  border-slate-200',   text: 'text-slate-700'  },
          { key: 'admitted',   label: 'Admitted',       icon: Activity,   bg: 'bg-[#edf9f4] border-[#2DB37D]/20',text: 'text-[#2DB37D]'  },
          { key: 'outpatient', label: 'Outpatients',    icon: UserCheck,  bg: 'bg-violet-50 border-violet-200',  text: 'text-violet-700' },
          { key: 'discharged', label: 'Discharged',     icon: UserX,      bg: 'bg-slate-50  border-slate-200',   text: 'text-slate-500'  },
        ].map(({ key, label, icon: Icon, bg, text }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm border text-left transition-all ${bg} ${
              filter === key ? 'ring-2 ring-offset-1 ring-[#2DB37D]/50' : 'hover:opacity-90'
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${text}`} strokeWidth={1.8} />
            <div>
              <p className={`text-xl font-semibold ${text}`}>{counts[key]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, MRN, doctor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] placeholder-slate-400 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2DB37D] hover:bg-[#24a06e] active:scale-[0.98] text-white text-sm font-medium rounded-sm transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Register Patient
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {['Patient', 'MRN', 'Gender', 'Ward', 'Assigned Doctor', 'Condition', 'Status', ''].map((h, i) => (
                  <th key={i} className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap ${i === 7 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-sm text-slate-400">
                    <Users className="w-7 h-7 mx-auto mb-2 text-slate-200" />
                    No patients match your search.
                  </td>
                </tr>
              ) : filtered.map((p, i) => {
                const cfg = STATUS[p.status] ?? STATUS.admitted;
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group">

                    {/* Patient name + avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {avatar(p.name)}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{p.name}</span>
                      </div>
                    </td>

                    {/* MRN */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">{p.id}</span>
                    </td>

                    {/* Gender */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${GENDER_COLOR[p.gender] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.gender}
                      </span>
                    </td>

                    {/* Ward */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${WARD_COLOR[p.ward] ?? 'bg-slate-100 text-slate-600'}`}>
                        {p.ward}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor}</td>

                    {/* Condition */}
                    <td className="px-5 py-3.5 text-sm text-slate-500">{p.condition}</td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${cfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 flex items-center justify-center rounded-sm text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 flex items-center justify-center rounded-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-600">{filtered.length}</span> of{' '}
            <span className="font-medium text-slate-600">{patients.length}</span> patients
          </span>
        </div>
      </div>
    </div>
  );
}