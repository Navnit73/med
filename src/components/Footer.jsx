import React from 'react';
import { Activity, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">MedExpert</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Trusted second opinions from world-class specialists.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/find-doctors" className="text-slate-400 hover:text-white transition-colors">Find Doctors</Link></li>
              <li><Link to="/hospitals" className="text-slate-400 hover:text-white transition-colors">Hospitals</Link></li>
              <li><Link to="/second-opinion" className="text-slate-400 hover:text-white transition-colors">Second Opinion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">HIPAA Compliance <Shield className="w-4 h-4 text-emerald-500" /></a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center md:text-left text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 MedExpert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
