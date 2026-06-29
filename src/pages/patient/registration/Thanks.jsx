 import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, CalendarClock, Download } from 'lucide-react';

export default function Thanks({ intent }) {
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    try {
      const statusStr = localStorage.getItem('flexreport_status');
      if (statusStr) {
        const parsed = JSON.parse(statusStr);
        if (parsed.patient_summary_url || parsed.doctor_summary_url) {
          setReports(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="p-8 sm:p-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
        <CheckCircle2 size={38} className="text-emerald-600" strokeWidth={2} />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
        {intent === 'expert' ? 'Booking Confirmed!' : 'Summary Created!'}
      </h2>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
        {intent === 'expert'
          ? 'Your case has been shared with the selected doctors. Expect details via SMS & email within 2 business days.'
          : 'Your medical records are securely saved and compiled into your profile.'}
      </p>

      {reports && (
        <div className="flex flex-col gap-2 w-full max-w-xs mb-6">
          {reports.patient_summary_url && (
            <a 
              href={reports.patient_summary_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 hover:border-violet-300 bg-white hover:bg-violet-50 text-violet-700 font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              <Download size={16} /> Download Patient Summary
            </a>
          )}
          {reports.doctor_summary_url && (
            <a 
              href={reports.doctor_summary_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              <Download size={16} /> Download Doctor Summary
            </a>
          )}
        </div>
      )}

      {intent === 'expert' && (
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 text-xs text-sky-800 font-semibold mb-6">
          <CalendarClock size={14} className="shrink-0" /> You'll be notified via SMS & Email
        </div>
      )}

      <button
        onClick={() => navigate('/patient')}
        className="w-full max-w-xs py-3.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all active:scale-95"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
