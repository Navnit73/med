
import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, LayoutDashboard, FileText, Users, Building2, UserCircle, ChevronRight } from 'lucide-react';

export default function HospitalViewLayout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard',   path: `/admin/hospitals/${id}/dashboard`,   icon: LayoutDashboard },
    { name: 'Contracts',   path: `/admin/hospitals/${id}/contracts`,   icon: FileText },
    { name: 'Patients',    path: `/admin/hospitals/${id}/patients`,    icon: Users },
    { name: 'Speciality', path: `/admin/hospitals/${id}/departments`, icon: Building2 },
    { name: 'Doctors',     path: `/admin/hospitals/${id}/doctors`,     icon: UserCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Breadcrumb back */}
      <button
        onClick={() => navigate('/admin/hospitals')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        All Hospitals
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-600">Apollo Medical Center</span>
      </button>

      {/* Hospital header card */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">

        {/* Top band: avatar + name + meta */}
        <div className="px-7 pt-6 pb-5 flex items-start gap-5">

          {/* Avatar */}
          <div className="w-14 h-14 rounded-sm bg-[#0284c7] flex items-center justify-center shrink-0 shadow-sm shadow-[#0284c7]/20">
            <span className="text-white text-lg font-bold tracking-tight">AM</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-semibold text-slate-900 leading-tight">Apollo Medical Center</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ring-emerald-200 bg-emerald-50 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {[
                { icon: Phone,  label: '+1 415 555 0101' },
                { icon: Mail,   label: 'info@apollomed.com' },
                { icon: MapPin, label: '120 Wellness Blvd, San Francisco' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.8} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Quick stat pills */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {[
              { label: 'Staff',       value: '420' },
              { label: 'Departments', value: '12'  },
              { label: 'Doctors',     value: '87'  },
            ].map(({ label, value }) => (
              <div key={label} className="text-center px-4 py-2.5 rounded-sm bg-slate-50 border border-slate-100">
                <p className="text-base font-semibold text-slate-800">{value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-7 border-t border-slate-100 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.path);
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`relative flex items-center gap-2 px-3.5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#0284c7]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                {tab.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284c7] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <Outlet />
    </div>
  );
}