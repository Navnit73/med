import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import api from '../../api/axios';

export default function CaseletReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const intentId = localStorage.getItem('current_intent_id') || 0;
      try {
        setLoading(true);
        const res = await api.get(`/flexreport/patient/report?intent_id=${intentId}`);
        if (res.data) {
          if (res.data.detail) {
            // It might return something like {"detail": "AI report is not ready yet..."}
            setError(res.data.detail);
          } else {
            const url = res.data.report_url || res.data.file_url || res.data.url || (typeof res.data === 'string' ? res.data : null);
            if (url) {
              setReportUrl(url);
            } else {
              setError("Report URL not found in response.");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.detail || "Failed to fetch report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-4 z-10">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Caselet Report</span>
          </div>
          <div className="w-5"></div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-sky-600 w-10 h-10 mb-4" />
            <p className="text-slate-500 font-medium">Fetching your report...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm px-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Report Not Available</h2>
            <p className="text-slate-500 mb-6 text-sm">{error}</p>
            <button 
              onClick={() => navigate('/patient')}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 shadow-sm transition-colors w-full"
            >
              Back to Dashboard
            </button>
          </div>
        ) : reportUrl ? (
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-sky-600" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Your Report</h3>
                  <p className="text-xs text-slate-500">Secure PDF Document</p>
                </div>
              </div>
              <a 
                href={reportUrl} 
                download 
                className="px-3 py-1.5 bg-white border border-slate-200 text-sky-700 hover:bg-sky-50 font-bold rounded-lg text-xs shadow-sm transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
            </div>
            <div className="min-h-[500px] bg-slate-100 relative">
              <iframe src={reportUrl} className="absolute inset-0 w-full h-full border-0" title="Patient Summary PDF" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100">
            No report available.
          </div>
        )}
      </main>
    </div>
  );
}
