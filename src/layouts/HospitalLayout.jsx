import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, LayoutDashboard, LogOut,
  Menu, Bell, Search, Users, Stethoscope, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HospitalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/signin');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${
      active
        ? 'bg-[#f0f9ff] text-[#0284c7] font-bold'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
    }`;

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const pageTitle = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 antialiased">
      {/* ── Sidebar ── */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0284c7] rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg text-slate-900">
              Med<span className="text-[#0284c7]">Expert</span> Hospital
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Main
          </p>

        

          <Link to="/hospital/profile" className={navLinkClass(isActive('/hospital/profile'))}>
            <Building2 className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            Profile
          </Link>
          <Link to="/hospital/departments" className={navLinkClass(isActive('/hospital/departments'))}>
            <Stethoscope className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            Departments
          </Link>

        

        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
          >
            <LogOut className="w-4 h-4 shrink-0 transition-colors" strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 -ml-2 rounded-sm text-slate-500 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <nav className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                {pathSegments.map((seg, i, arr) => {
                  const path = '/' + arr.slice(0, i + 1).join('/');
                  const isLast = i === arr.length - 1;
                  return (
                    <React.Fragment key={path}>
                      {i > 0 && <span className="text-slate-300 select-none">/</span>}
                      {isLast ? (
                        <span className="text-slate-600 font-medium capitalize">{seg.replace(/-/g, ' ')}</span>
                      ) : (
                        <Link to={path} className="hover:text-[#0284c7] capitalize transition-colors">
                          {seg.replace(/-/g, ' ')}
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
              <h1 className="text-base font-bold text-slate-900 leading-tight">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search…"
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7] placeholder-slate-400 transition"
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-sm text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0284c7] rounded-full border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#f0f9ff] flex items-center justify-center text-[#0284c7] text-xs font-bold cursor-pointer hover:bg-[#bae6fd] transition-colors ring-2 ring-[#0284c7]/20">
              H
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
