import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, LayoutDashboard, LogOut,
  Building2, ChevronDown, PlusCircle, List, Bell, Search, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [hospitalsMenuOpen, setHospitalsMenuOpen] = useState(
    location.pathname.startsWith('/admin/hospitals')
  );

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/signin');
  };

  const isActive      = (path)   => location.pathname === path;
  const isActiveGroup = (prefix) => location.pathname.startsWith(prefix);

  // Active: white text + indigo-700 bg
  // Inactive: indigo-200 text + hover indigo-700/40 bg
  const navLinkClass = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      active
        ? 'bg-white/15 text-white'
        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
    }`;

  const subLinkClass = (active) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
      active
        ? 'bg-white/15 text-white font-medium'
        : 'text-indigo-300 hover:bg-white/10 hover:text-white font-normal'
    }`;

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const pageTitle =
    location.pathname === '/admin'
      ? 'Dashboard'
      : pathSegments[pathSegments.length - 1]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 antialiased">

      {/* ── Sidebar ── */}
      <aside className={`w-64 bg-indigo-900 flex flex-col fixed h-full z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-indigo-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">MedExpert</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

          {/* Section label */}
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
            Main
          </p>

          <Link to="/admin" className={navLinkClass(isActive('/admin'))}>
            <LayoutDashboard className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            Dashboard
          </Link>

          {/* Hospitals dropdown */}
          <div>
            <button
              onClick={() => setHospitalsMenuOpen(!hospitalsMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActiveGroup('/admin/hospitals')
                  ? 'bg-white/15 text-white'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                Hospitals
              </div>
              <span className={`transition-transform duration-200 ${hospitalsMenuOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4 text-indigo-400" />
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${
              hospitalsMenuOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-3 pl-3.5 border-l border-indigo-700 space-y-0.5 py-1">
                <Link to="/admin/hospitals" className={subLinkClass(isActive('/admin/hospitals'))}>
                  <List className="w-3.5 h-3.5 shrink-0" />
                  Hospital List
                </Link>
                <Link to="/admin/hospitals/add" className={subLinkClass(isActive('/admin/hospitals/add'))}>
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  Add Hospital
                </Link>
              </div>
            </div>
          </div>

         
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-indigo-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 ring-2 ring-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-indigo-400 truncate">admin@medexpert.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-indigo-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150 group"
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

          {/* Left: breadcrumb + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 -ml-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <nav className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
              {pathSegments.map((seg, i, arr) => {
                const path   = '/' + arr.slice(0, i + 1).join('/');
                const isLast = i === arr.length - 1;
                return (
                  <React.Fragment key={path}>
                    {i > 0 && <span className="text-slate-300 select-none">/</span>}
                    {isLast ? (
                      <span className="text-slate-600 font-medium capitalize">{seg.replace(/-/g, ' ')}</span>
                    ) : (
                      <Link to={path} className="hover:text-indigo-600 capitalize transition-colors">
                        {seg.replace(/-/g, ' ')}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">{pageTitle}</h1>
            </div>
          </div>

          {/* Right: search + bell + avatar */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search…"
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 transition"
              />
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>

            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-indigo-700 transition-colors ring-2 ring-indigo-200">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}