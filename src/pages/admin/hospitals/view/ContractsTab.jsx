import React, { useState } from 'react';
import { Search, Download, Edit, Trash2, Plus, FileText, CalendarDays, Clock } from 'lucide-react';

const INITIAL_CONTRACTS = [
  { id: 1000, name: 'Service Agreement 2023', start: '2023-01-15', end: '2025-01-14', status: 'active',   type: 'Service' },
  { id: 1006, name: 'Service Agreement 2023', start: '2023-07-15', end: '2025-07-14', status: 'active',   type: 'Service' },
  { id: 1012, name: 'Maintenance Contract',   start: '2024-01-01', end: '2024-12-31', status: 'expiring', type: 'Maintenance' },
];

const STATUS = {
  active:   { label: 'Active',   dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  expiring: { label: 'Expiring', dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  expired:  { label: 'Expired',  dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 ring-slate-200' },
};

const TYPE_COLOR = {
  Service:     'bg-blue-50 text-blue-700',
  Maintenance: 'bg-violet-50 text-violet-700',
};

function fmt(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysLeft(end) {
  const diff = Math.ceil((new Date(end) - new Date()) / 86400000);
  return diff;
}

export default function ContractsTab() {
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [search, setSearch] = useState('');

  const handleDelete = (id) => setContracts(c => c.filter(x => x.id !== id));

  const handleAdd = () => {
    const newId = Math.max(...contracts.map(c => c.id)) + 1;
    setContracts(c => [...c, {
      id: newId,
      name: `New Agreement`,
      start: new Date().toISOString().split('T')[0],
      end: '2026-12-31',
      status: 'active',
      type: 'Service',
    }]);
  };

  const filtered = contracts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    String(c.id).includes(search)
  );

  const counts = {
    total:    contracts.length,
    active:   contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring').length,
  };

  return (
    <div className="space-y-4">

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Contracts', value: counts.total,    icon: FileText,    color: 'text-slate-700',   bg: 'bg-slate-50  border-slate-200' },
          { label: 'Active',          value: counts.active,   icon: CalendarDays, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Expiring Soon',   value: counts.expiring, icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50  border-amber-200' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${bg}`}>
            <div className={`${color}`}>
              <Icon className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className={`text-xl font-semibold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-200 rounded-xl  overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contracts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
            />
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all "
          >
            <Plus className="w-4 h-4" />
            Add Contract
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {['Contract', 'Type', 'Start Date', 'End Date', 'Duration', 'Status', ''].map((h, i) => (
                  <th key={i} className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${i === 6 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-sm text-slate-400">
                    <FileText className="w-7 h-7 mx-auto mb-2 text-slate-200" />
                    No contracts found.
                  </td>
                </tr>
              ) : filtered.map((c) => {
                const days = daysLeft(c.end);
                const cfg  = STATUS[c.status] ?? STATUS.active;
                return (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group">

                    {/* Contract name + id */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">#{c.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type pill */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLOR[c.type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {c.type}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-3.5 text-sm text-slate-500">{fmt(c.start)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{fmt(c.end)}</td>

                    {/* Days left */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${days < 90 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {days > 0 ? `${days} days left` : 'Ended'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${cfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-0.5  transition-opacity">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
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
            <span className="font-medium text-slate-600">{contracts.length}</span> contracts
          </span>
        </div>
      </div>
    </div>
  );
}