import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle, FileText, Download } from 'lucide-react';
import api from '../../api/axios';

export default function CaseletReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/flexreport/patient/all-reports`);
        if (res.data) {
          if (res.data.detail) {
            setError(res.data.detail);
          } else if (Array.isArray(res.data)) {
            setReports(res.data);
          } else {
            // fallback if it's a single object
            setReports([res.data]);
          }
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.detail || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);



  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-4 z-10">
          <button onClick={() => navigate('/patient')} className="text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">My Reports</span>
          </div>
          <div className="w-5"></div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-sky-600 w-10 h-10 mb-4" />
            <p className="text-slate-500 font-medium">Fetching your reports...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm px-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Reports Not Available</h2>
            <p className="text-slate-500 mb-6 text-sm">{error}</p>
            <button 
              onClick={() => navigate('/patient')}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 shadow-sm transition-colors w-full"
            >
              Back to Dashboard
            </button>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report) => {
              const hasUrl = !!report.patient_summary_url;
              const CardWrapper = hasUrl ? 'a' : 'div';
              const wrapperProps = hasUrl ? {
                href: report.patient_summary_url,
                download: true,
                target: "_blank",
                rel: "noreferrer"
              } : {};

              return (
                <CardWrapper 
                  key={report.caselet_id} 
                  {...wrapperProps}
                  className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 ${hasUrl ? 'hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group' : ''}`}
                >
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 border border-sky-100">
                    <FileText className="text-sky-600" size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 mb-0.5">Report #{report.caselet_id}</p>
                    {report.patient_summary_url ? (
                       <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">Ready to download</p>
                    ) : report.flexreport_error ? (
                       <p className="text-xs text-red-500 font-semibold line-clamp-1">{report.flexreport_error}</p>
                    ) : (
                       <p className="text-xs text-amber-500 font-semibold">Processing...</p>
                    )}
                  </div>
                  {report.patient_summary_url && (
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Download size={16} strokeWidth={2.5} />
                    </div>
                  )}
                </CardWrapper>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">No Reports Yet</h2>
            <p className="text-slate-500 text-sm">You haven't generated any reports.</p>
          </div>
        )}
      </main>
    </div>
  );
}
