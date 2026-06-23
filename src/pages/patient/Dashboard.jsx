import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Receipt, Stethoscope, ChevronRight, X, Users, Loader2, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { patientApi } from "../../api/patient";
import ProfileSettingsModal from "./ProfileSettingsModal";

export default function PatientDashboard() {
  const { savePatientData } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showDoctorCaseletPdfModal, setShowDoctorCaseletPdfModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileData = await patientApi.getProfile();
      setUserProfile(profileData);
      savePatientData(profileData);
      
      if (!profileData.first_name) {
        setShowProfileSettings(true);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // ----- Conditional Render Views -----

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-sky-600 w-10 h-10" />
      </div>
    );
  }

  // ----- Dashboard View -----

  const firstName = userProfile?.first_name || "Guest";
  
  const actions = [
    {
      id: "caselet",
      label: "New Caselet / Consult",
      desc: "Start a consultation, upload records, connect with experts.",
      icon: Stethoscope,
      color: "teal",
      onClick: () => navigate("/patient/registration"),
      cta: "Get Started"
    },
    {
      id: "doctor_caselet",
      label: "Doctor Caselet",
      desc: "View your doctor caselets.",
      icon: Stethoscope,
      color: "teal",
      onClick: () => setShowDoctorCaseletPdfModal(true),
      cta: "Get Started"
    },
    {
      id: "second_opinion",
      label: "Second Opinion",
      desc: "Request a second opinion from another expert.",
      icon: Users,
      color: "blue",
      onClick: () => navigate("/patient/second_opinion"),
      cta: "Request"
    },
    {
      id: "download",
      label: "Download Caselet",
      desc: "Secure PDF of your submitted medical caselet and history.",
      icon: Download,
      color: "blue",
      onClick: () => setShowPdfModal(true),
      cta: "Download"
    },
    {
      id: "receipts",
      label: "Receipts",
      desc: "View and download invoices for past expert consultations.",
      icon: Receipt,
      color: "violet",
      onClick: () => alert("Opening Receipts..."),
      cta: "View All"
    },
  ];

  const colorMap = {
    teal:   { bg: "bg-sky-600",   ring: "ring-sky-200",   text: "text-sky-700",   light: "bg-sky-50",   hover: "hover:bg-sky-700" },
    blue:   { bg: "bg-blue-500",   ring: "ring-blue-200",   text: "text-blue-600",   light: "bg-blue-50",   hover: "hover:bg-blue-600" },
    violet: { bg: "bg-violet-500", ring: "ring-violet-200", text: "text-violet-600", light: "bg-violet-50", hover: "hover:bg-violet-600" },
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <section>
            <p className="text-xs font-semibold text-sky-700 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Hello, {firstName} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here's a quick overview of your health journey.
            </p>
          </section>
          <button 
            onClick={() => setShowProfileSettings(true)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-colors shadow-sm"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Action Cards */}
        <section className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quick Actions</p>
          {actions.map((action) => {
            const Icon = action.icon;
            const c = colorMap[action.color];
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="w-full bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-sm flex items-center gap-4 text-left group transition-all hover:border-slate-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${c.light} ${c.ring} ring-1`}>
                  <Icon size={22} className={c.text} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{action.label}</p>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{action.desc}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="flex-shrink-0 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            );
          })}
        </section>

        {/* Info strip */}
        <div className="rounded-2xl bg-sky-600 p-4 text-white flex items-center gap-4 shadow-md shadow-sky-200">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold opacity-80 mb-0.5">Need help?</p>
            <p className="text-sm font-bold leading-tight">Talk to our support team anytime</p>
          </div>
          <button className="flex-shrink-0 bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-xl text-xs font-semibold">
            Chat
          </button>
        </div>
      </main>

      {/* Doctor Caselet PDF Modal */}
      {showDoctorCaseletPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-sora">Doctor Caselet Summary</h3>
              <div className="flex items-center gap-2 md:gap-3">
                <a href="/doctor_summary.pdf" download className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-xl flex items-center gap-2 transition-colors text-sm md:text-base">
                  <Download size={16} /> <span className="hidden sm:inline">Download</span>
                </a>
                <button onClick={() => setShowDoctorCaseletPdfModal(false)} className="text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full p-1.5 md:p-2 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <iframe src="/doctor_summary.pdf" className="w-full h-full border-0" title="Doctor Summary PDF" />
            </div>
          </div>
        </div>
      )}

      {/* Caselet PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-sora">Caselet Summary</h3>
              <div className="flex items-center gap-2 md:gap-3">
                <a href="/patient_summary.pdf" download className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-xl flex items-center gap-2 transition-colors text-sm md:text-base">
                  <Download size={16} /> <span className="hidden sm:inline">Download</span>
                </a>
                <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full p-1.5 md:p-2 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <iframe src="/patient_summary.pdf" className="w-full h-full border-0" title="Patient Summary PDF" />
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal 
        isOpen={showProfileSettings} 
        onClose={() => setShowProfileSettings(false)} 
        userProfile={userProfile} 
        onProfileUpdated={(updated) => setUserProfile(updated)} 
      />
    </div>
  );
}