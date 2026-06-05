import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, Plus, Building2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HOSPITALS_DATA = [
  { id: 1, name: 'Apollo Medical Center', staff: 420, contact: '+1 415 555 0101', city: 'San Francisco', status: 'active' },
  { id: 2, name: 'Mercy General Hospital', staff: 312, contact: '+1 312 555 0144', city: 'Chicago', status: 'active' },
  { id: 3, name: 'Sunrise Specialty Clinic', staff: 145, contact: '+1 213 555 0177', city: 'Los Angeles', status: 'pending' },
  { id: 4, name: 'Greenfield Hospital', staff: 268, contact: '+1 617 555 0192', city: 'Boston', status: 'inactive' },
  { id: 5, name: 'Cedar Park Medical', staff: 510, contact: '+1 512 555 0166', city: 'Austin', status: 'active' },
  { id: 6, name: 'Northstar Children\'s Hospital', staff: 198, contact: '+1 206 555 0123', city: 'Seattle', status: 'active' },
];

const STATUS_CONFIG = {
  active:   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  pending:  { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  inactive: { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600 ring-slate-200' },
};

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-indigo-100 text-indigo-700',
];

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function HospitalList() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = HOSPITALS_DATA
    .filter(h =>
      (statusFilter === 'all' || h.status === statusFilter) &&
      (h.name.toLowerCase().includes(search.toLowerCase()) ||
       h.city.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const SortIcon = ({ col }) => (
    <span className="ml-1 inline-flex flex-col gap-px opacity-40">
      <ChevronUp className={`w-2.5 h-2.5 ${sortKey === col && sortDir === 'asc' ? 'opacity-100 text-blue-600' : ''}`} />
      <ChevronDown className={`w-2.5 h-2.5 -mt-1 ${sortKey === col && sortDir === 'desc' ? 'opacity-100 text-blue-600' : ''}`} />
    </span>
  );

  const counts = {
    all: HOSPITALS_DATA.length,
    active: HOSPITALS_DATA.filter(h => h.status === 'active').length,
    pending: HOSPITALS_DATA.filter(h => h.status === 'pending').length,
    inactive: HOSPITALS_DATA.filter(h => h.status === 'inactive').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Hospital Network</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and monitor all registered hospitals.</p>
        </div>
        <Link
          to="/admin/hospitals/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all "
        >
          <Plus className="w-4 h-4" />
          Add Hospital
        </Link>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'pending', 'inactive'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              statusFilter === s
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {s !== 'all' && (
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s]?.dot}`} />
            )}
            <span className="capitalize">{s}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden ">

        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or city…"
              className="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>
          <span className="text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  { key: 'name', label: 'Hospital' },
                  { key: 'city', label: 'City' },
                  { key: 'staff', label: 'Staff' },
                  { key: 'contact', label: 'Contact', noSort: true },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => !col.noSort && toggleSort(col.key)}
                    className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide select-none whitespace-nowrap ${
                      !col.noSort ? 'cursor-pointer hover:text-slate-600' : ''
                    }`}
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {!col.noSort && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-3 text-slate-200" />
                    No hospitals match your search.
                  </td>
                </tr>
              ) : filtered.map((hospital, i) => (
                <tr key={hospital.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors group">

                  {/* Name + avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {initials(hospital.name)}
                      </div>
                      <Link
                        to={`/admin/hospitals/${hospital.id}`}
                        className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        {hospital.name}
                      </Link>
                    </div>
                  </td>

                  {/* City */}
                  <td className="px-5 py-3.5 text-sm text-slate-500">{hospital.city}</td>

                  {/* Staff */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-slate-700">{hospital.staff.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">staff</span>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-3.5 text-sm text-slate-500 font-mono">{hospital.contact}</td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset capitalize ${STATUS_CONFIG[hospital.status]?.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[hospital.status]?.dot}`} />
                      {hospital.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-0.5  transition-opacity">
                      <Link
                        to={`/admin/hospitals/${hospital.id}`}
                        title="View"
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/hospitals/edit/${hospital.id}`}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-600">{filtered.length}</span> of <span className="font-medium text-slate-600">{HOSPITALS_DATA.length}</span> hospitals
          </span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium">1</span>
            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}