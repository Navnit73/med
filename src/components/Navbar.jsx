import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Menu, X, ChevronDown, Video, Stethoscope, Building2, FileText } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Med<span className="text-[#0284c7]">Expert</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors">
              Home
            </Link>

            {/* Find Doctors dropdown trigger */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors">
                Find Doctors <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-slate-100 shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <Link to="/find-doctors" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#e0f2fe] transition-colors group/item">
                  <Stethoscope className="w-4 h-4 text-[#0284c7]" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover/item:text-[#0284c7]">All Specialists</p>
                    <p className="text-[11px] text-slate-400">Browse by specialty</p>
                  </div>
                </Link>
                <Link to="/find-doctors" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#e0f2fe] transition-colors group/item">
                  <Video className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover/item:text-[#0284c7]">Video Consult</p>
                    <p className="text-[11px] text-slate-400">Consult online now</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link to="/hospitals" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Hospitals
            </Link>

            <Link to="/signin?role=patient" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Second Opinion
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin?role=admin"
              className="text-sm font-semibold text-slate-600 hover:text-[#0284c7] transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/signin?role=patient"
              className="px-5 py-2 text-sm font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-lg transition-colors shadow-sm"
            >
              Login / Sign up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-[#0284c7] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {[
              { to: '/',                   label: 'Home'           },
              { to: '/find-doctors',       label: 'Find Doctors'   },
              { to: '/find-doctors',       label: 'Video Consult'  },
              { to: '/hospitals',          label: 'Hospitals'      },
              { to: '/signin?role=patient',label: 'Second Opinion' },
            ].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/signin?role=patient"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-lg transition-colors"
            >
              Login / Sign up
            </Link>
            <Link
              to="/signin?role=admin"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-600 border border-slate-200 hover:border-[#0284c7] hover:text-[#0284c7] rounded-lg transition-colors"
            >
              Admin Sign in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}