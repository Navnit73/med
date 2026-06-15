import { Activity, Shield } from 'lucide-react';

const Twitter = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Linkedin = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Facebook = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand col */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900">
                Med<span className="text-[#0284c7]">Expert</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
              Trusted second opinions from board-certified specialists. Your health decisions, backed by expertise.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0284c7] hover:text-[#0284c7] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
                { to: '/find-doctors',        label: 'Find Doctors'    },
                { to: '/hospitals',           label: 'Hospitals'       },
                { to: '/signin?role=patient', label: 'Second Opinion'  },
                { to: '/find-doctors',        label: 'Video Consult'   },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {['About us', 'Careers', 'Press', 'Blog', 'Contact'].map(label => (
                <li key={label}>
                  <a href="#" className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors flex items-center gap-1.5">
                  HIPAA Compliance
                  <Shield className="w-3.5 h-3.5 text-[#0284c7]" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-[#0284c7] transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-slate-100">
          {[
            { label: 'HIPAA Compliant',     color: 'text-[#0284c7]', bg: 'bg-[#f0f9ff] border-[#0284c7]/20' },
            { label: 'ISO 27001 Certified', color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-100'        },
            { label: 'SOC 2 Type II',       color: 'text-purple-600',bg: 'bg-purple-50 border-purple-100'    },
          ].map(({ label, color, bg }) => (
            <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${bg} ${color}`}>
              <Shield className="w-3 h-3" /> {label}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>© 2026 MedExpert Inc. All rights reserved.</p>
          <p className="text-center">
            Not a substitute for professional medical advice.{' '}
            <a href="#" className="underline hover:text-[#0284c7] transition-colors">Learn more</a>
          </p>
        </div>
      </div>
    </footer>
  );
}