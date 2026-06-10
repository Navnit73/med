import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">MedExpert</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/find-doctors" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Find Doctors</Link>
            <Link to="/hospitals" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Hospitals</Link>
            
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signin?role=patient" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Patient Login</Link>
            <Link to="/signin?role=admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Admin Sign in</Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <Link to="/" className="block text-base font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/find-doctors" className="block text-base font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Find Doctors</Link>
          <Link to="/hospitals" className="block text-base font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Hospitals</Link>
          <Link to="/second-opinion" className="block text-base font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Second Opinion</Link>
          <Link to="/signin?role=patient" className="block text-base font-medium text-indigo-600 hover:text-indigo-800 pt-2 border-t border-slate-100" onClick={() => setIsMenuOpen(false)}>Patient Login</Link>
          <Link to="/signin?role=admin" className="block text-base font-medium text-slate-600 hover:text-slate-900" onClick={() => setIsMenuOpen(false)}>Admin Sign in</Link>
        </div>
      )}
    </nav>
  );
}
