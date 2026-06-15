/**
 * RegistrationWizard.jsx
 *
 * API Integration Points (axios):
 *   - api/patient.js  → submitPatientDetails(data)
 *   - api/upload.js   → uploadDocument(file, meta) → returns { id, url }
 *   - api/consult.js  → createConsultation(payload) → returns { bookingId }
 *   - api/payment.js  → initiatePayment(amount, bookingId) → returns { razorpayOrderId }
 *
 * All API calls are wrapped in try/catch with a shared `apiCall` helper.
 * Swap `// TODO: API` comments with real axios calls when ready.
 */

import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';  // ← uncomment when integrating
import {
  CheckCircle2, ChevronRight, ChevronLeft, Upload,
  Stethoscope, FileText, CreditCard, Star, CalendarClock,
  X, Sparkles, BrainCircuit, User, Phone,
  ShieldCheck, Mail, Plus, FilePlus, ClipboardCheck,
  AlertCircle, Trash2, ChevronDown
} from 'lucide-react';

/* ─────────────────────────────────────────────
   API HELPER  (swap for real axios calls)
───────────────────────────────────────────── */
// const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

const apiCall = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
};

/* ─────────────────────────────────────────────
   FIELD PRIMITIVES
───────────────────────────────────────────── */
const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">
    {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
  </label>
);

const Input = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
    <input
      {...props}
      className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all ${className}`}
    />
  </div>
);

const Select = ({ icon: Icon, children, ...props }) => (
  <div className="relative">
    {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />}
    <select
      {...props}
      className={`w-full appearance-none ${Icon ? 'pl-10' : 'px-4'} pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all`}
    >
      {children}
    </select>
    <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

const Field = ({ label, required, children, hint }) => (
  <div>
    <Label required={required}>{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{hint}</p>}
  </div>
);

const Row2 = ({ children }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

/* ─────────────────────────────────────────────
   STEP BAR
───────────────────────────────────────────── */
const STEPS = [
  { label: 'You', short: 'You' },
  { label: 'Records', short: 'Docs' },
  { label: 'Service', short: 'Service' },
  { label: 'Doctors', short: 'Doctors' },
  { label: 'Pay', short: 'Pay' },
  { label: 'Done', short: 'Done' },
];

const StepBar = ({ step, total }) => (
  <div className="mb-6">
    {/* Mobile */}
    <div className="sm:hidden flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-sky-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm shadow-sky-200">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-[11px] font-bold mb-1.5">
          <span className="text-sky-700">{STEPS[step - 1]?.label}</span>
          <span className="text-slate-400">{step} of {total}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-sky-600 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (total - 1)) * 100}%` }} />
        </div>
      </div>
    </div>

    {/* Desktop */}
    <div className="hidden sm:flex items-center relative px-2">
      <div className="absolute inset-x-6 top-3.5 h-0.5 bg-slate-100" />
      <div className="absolute left-6 top-3.5 h-0.5 bg-sky-500 transition-all duration-500"
        style={{ width: `calc(${((step - 1) / (total - 1)) * 100}% - 3rem + 24px)` }} />
      {STEPS.map(({ label }, i) => {
        const s = i + 1;
        const active = step === s;
        const done = step > s;
        return (
          <div key={s} className="flex-1 flex flex-col items-center relative z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
              done ? 'bg-sky-600 border-sky-600 text-white' :
              active ? 'bg-white border-sky-600 text-sky-700 shadow-md' :
              'bg-white border-slate-200 text-slate-400'
            }`}>
              {done ? <CheckCircle2 size={13} /> : s}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${active ? 'text-sky-700' : done ? 'text-sky-500' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   NAV BUTTONS
───────────────────────────────────────────── */
const NavButtons = ({ onBack, onNext, nextLabel = 'Continue', nextDisabled = false, showBack = true, loading = false }) => (
  <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 mt-6 flex gap-2">
    {showBack && (
      <button onClick={onBack}
        className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
        <ChevronLeft size={16} /> Back
      </button>
    )}
    <button onClick={onNext} disabled={nextDisabled || loading}
      className="ml-auto flex items-center gap-2 px-6 py-3 bg-sky-700 hover:bg-sky-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm shadow-sky-200">
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Processing…
        </span>
      ) : (
        <>{nextLabel} <ChevronRight size={16} /></>
      )}
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   DOCUMENT TYPES
───────────────────────────────────────────── */
const DOC_TYPES = [
  'Prescription',
  'Blood Report',
  'Radiology Scan',
  'Discharge Summary',
  'Pathology Report',
  'ECG / Echo Report',
  'Other Report',
];

/* ─────────────────────────────────────────────
   SINGLE DOCUMENT CARD (timeline item)
───────────────────────────────────────────── */
const DocCard = ({ doc, index, total, onRemove, uploading }) => {
  const ext = doc.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const extColors = {
    PDF: 'bg-rose-50 text-rose-600',
    JPG: 'bg-sky-50 text-sky-600',
    JPEG: 'bg-sky-50 text-sky-600',
    PNG: 'bg-violet-50 text-violet-600',
  };
  const badge = extColors[ext] || 'bg-slate-100 text-slate-600';

  return (
    <div className="flex gap-3 relative">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${uploading ? 'bg-amber-100 text-amber-600 animate-pulse' : doc.uploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'}`}>
          {uploading ? '↑' : doc.uploaded ? <CheckCircle2 size={14} /> : index + 1}
        </div>
        {index < total - 1 && <div className="w-px flex-1 bg-slate-100 mt-1 mb-1 min-h-[12px]" />}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-3 bg-white border rounded-xl px-4 py-3 shadow-sm flex items-start gap-3 transition-all ${doc.uploaded ? 'border-emerald-100' : 'border-slate-200'}`}>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black shrink-0 mt-0.5 ${badge}`}>{ext}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{doc.title}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{doc.type} · {doc.fileName}</p>
          {doc.uploaded && (
            <p className="text-[10px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={10} /> Uploaded
            </p>
          )}
        </div>
        <button onClick={() => onRemove(doc.id)}
          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-all shrink-0 mt-0.5">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ADD DOCUMENT PANEL (expands inline)
───────────────────────────────────────────── */
const AddDocPanel = ({ onAdd, onCancel }) => {
  const fileRef = useRef(null);
  const [local, setLocal] = useState({ title: '', type: 'Prescription', file: null });
  const [err, setErr] = useState('');

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setErr('File must be under 10 MB'); return; }
    setErr('');
    setLocal(d => ({ ...d, file: f, title: d.title || f.name.replace(/\.[^.]+$/, '') }));
  };

  const submit = () => {
    if (!local.title.trim()) { setErr('Please enter a document title'); return; }
    if (!local.file) { setErr('Please select a file'); return; }
    onAdd(local);
  };

  return (
    <div className="border-2 border-sky-200 border-dashed bg-sky-50/40 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
          <FilePlus size={13} /> New Document
        </span>
        <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-all">
          <X size={13} />
        </button>
      </div>

      <Field label="Document Title" required>
        <Input
          value={local.title}
          onChange={e => setLocal(d => ({ ...d, title: e.target.value }))}
          placeholder="e.g. Blood Test · Nov 2024"
          autoFocus
        />
      </Field>

      <Field label="Type">
        <Select value={local.type} onChange={e => setLocal(d => ({ ...d, type: e.target.value }))}>
          {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
        </Select>
      </Field>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${local.file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-sky-300 bg-white'}`}
      >
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFile} className="hidden" />
        {local.file ? (
          <>
            <CheckCircle2 size={20} className="text-emerald-500" />
            <p className="text-xs font-bold text-emerald-700 truncate max-w-[200px]">{local.file.name}</p>
            <p className="text-[10px] text-slate-400">{(local.file.size / 1024).toFixed(0)} KB · tap to change</p>
          </>
        ) : (
          <>
            <Upload size={18} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-500">Tap to select file</p>
            <p className="text-[10px] text-slate-400">PDF, JPG, PNG, DOC — max 10 MB</p>
          </>
        )}
      </div>

      {err && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5">
          <AlertCircle size={12} /> {err}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all">
          Cancel
        </button>
        <button onClick={submit}
          className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all active:scale-95">
          Add Document
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DOCTORS LIST
───────────────────────────────────────────── */
const DOCTORS = [
  { id: 1, name: 'Dr. Rajesh Kumar',  specialty: 'Oncology',      rating: 4.9, experience: '15 yrs', fee: 1500 },
  { id: 2, name: 'Dr. Priya Sharma',  specialty: 'Cardiology',    rating: 4.8, experience: '12 yrs', fee: 1500 },
  { id: 3, name: 'Dr. Ananya Patel',  specialty: 'Neurology',     rating: 4.9, experience: '10 yrs', fee: 1500 },
  { id: 4, name: 'Dr. Vikram Singh',  specialty: 'Orthopedics',   rating: 4.7, experience: '18 yrs', fee: 1500 },
  { id: 5, name: 'Dr. Meena Reddy',   specialty: 'Endocrinology', rating: 4.8, experience: '14 yrs', fee: 1500 },
];

/* ═══════════════════════════════════════════
   MAIN WIZARD
═══════════════════════════════════════════ */
export default function RegistrationWizard() {
  const { patientData, savePatientData } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 6;

  const [form, setForm] = useState({
    firstName: patientData?.firstName || '',
    lastName:  patientData?.lastName  || '',
    phone:     patientData?.phone     || '',
    email:     patientData?.email     || '',
    documents:        [],
    intent:           '',   // 'expert' | 'caselet'
    consultType:      '',   // 'single' | 'multiple'
    selectedDoctors:  [],
  });

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showAiModal,  setShowAiModal]  = useState(false);
  const [uploadingId,  setUploadingId]  = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handle = e => set(e.target.name, e.target.value);

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  /* ── Document helpers ── */
  const addDoc = async (local) => {
    const newDoc = {
      id: Date.now(),
      title: local.title.trim(),
      type: local.type,
      fileName: local.file.name,
      file: local.file,
      uploaded: false,
    };

    setForm(f => ({ ...f, documents: [...f.documents, newDoc] }));
    setShowAddPanel(false);

    // TODO: API — upload document
    setUploadingId(newDoc.id);
    await apiCall(async () => {
      // const fd = new FormData();
      // fd.append('file', local.file);
      // fd.append('title', local.title);
      // fd.append('type', local.type);
      // const res = await api.post('/documents/upload', fd);
      // return res.data; // { id, url }
      await new Promise(r => setTimeout(r, 1200)); // simulate upload
    });
    setUploadingId(null);
    setForm(f => ({
      ...f,
      documents: f.documents.map(d => d.id === newDoc.id ? { ...d, uploaded: true } : d),
    }));
  };

  const removeDoc = (id) => setForm(f => ({ ...f, documents: f.documents.filter(d => d.id !== id) }));

  /* ── Doctor helpers ── */
  const toggleDoc = (doc) => {
    if (form.consultType === 'single') {
      set('selectedDoctors', [doc]);
    } else {
      const has = form.selectedDoctors.find(d => d.id === doc.id);
      set('selectedDoctors', has
        ? form.selectedDoctors.filter(d => d.id !== doc.id)
        : [...form.selectedDoctors, doc]);
    }
  };

  /* ── Step 1 → submit patient details ── */
  const handleStep1Next = async () => {
    setLoading(true);
    await apiCall(async () => {
      // TODO: API
      // await api.post('/patient/details', { firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email });
      await new Promise(r => setTimeout(r, 600));
    });
    setLoading(false);
    next();
  };

  /* ── Step 5 → pay ── */
  const handlePayment = async () => {
    setLoading(true);
    await apiCall(async () => {
      // TODO: API
      // const bookingRes = await api.post('/consultation/create', { doctors: form.selectedDoctors, documents: form.documents.map(d => d.id), intent: form.intent });
      // const payRes = await api.post('/payment/initiate', { amount: totalAmount, bookingId: bookingRes.data.bookingId });
      // open Razorpay with payRes.data.razorpayOrderId
      await new Promise(r => setTimeout(r, 1000));
      savePatientData(form);
    });
    setLoading(false);
    next();
  };

  const totalAmount = form.selectedDoctors.length * 1500 + 200;

  /* ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-8">
        <StepBar step={step} total={totalSteps} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ══ STEP 1: Patient Details ══ */}
          {step === 1 && (
            <div className="p-5 sm:p-7 space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Tell us about you</h2>
                <p className="text-xs text-slate-400 mt-0.5">Your information is encrypted and never shared without consent</p>
              </div>

              <div className="space-y-3">
                <Row2>
                  <Field label="First Name" required>
                    <Input name="firstName" value={form.firstName} onChange={handle} placeholder="Jane" />
                  </Field>
                  <Field label="Last Name">
                    <Input name="lastName" value={form.lastName} onChange={handle} placeholder="Doe" />
                  </Field>
                </Row2>
                <Field label="Phone Number" required hint="We'll send appointment updates here">
                  <Input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 98765 43210" icon={Phone} inputMode="tel" />
                </Field>
                <Field label="Email Address">
                  <Input name="email" type="email" value={form.email} onChange={handle} placeholder="jane@email.com" icon={Mail} />
                </Field>
              </div>

              <NavButtons
                showBack={false}
                onNext={handleStep1Next}
                nextLabel="Continue"
                nextDisabled={!form.firstName || !form.phone}
                loading={loading}
              />
            </div>
          )}

          {/* ══ STEP 2: Medical Records ══ */}
          {step === 2 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900">Medical Records</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-5">
                Upload prescriptions, reports, or scans. You can add multiple documents.
              </p>

              {/* Timeline of uploaded docs */}
              {form.documents.length > 0 && (
                <div className="mb-4">
                  {form.documents.map((doc, i) => (
                    <DocCard
                      key={doc.id}
                      doc={doc}
                      index={i}
                      total={form.documents.length}
                      onRemove={removeDoc}
                      uploading={uploadingId === doc.id}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {form.documents.length === 0 && !showAddPanel && (
                <div className="py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-slate-400 mb-4">
                  <FileText size={28} className="mb-2 opacity-25" />
                  <p className="text-sm font-semibold text-slate-400">No documents yet</p>
                  <p className="text-xs text-slate-300 mt-0.5">Optional — better records lead to better advice</p>
                </div>
              )}

              {/* Add panel */}
              {showAddPanel ? (
                <AddDocPanel onAdd={addDoc} onCancel={() => setShowAddPanel(false)} />
              ) : (
                <button
                  onClick={() => setShowAddPanel(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-sky-200 hover:border-sky-400 text-sky-600 hover:text-sky-700 text-sm font-bold rounded-xl transition-all hover:bg-sky-50/50 mb-4 active:scale-[0.99]"
                >
                  <Plus size={16} /> Add Document
                </button>
              )}

              {/* AI summary CTA */}
              {form.documents.length >= 2 && !showAddPanel && (
                <button
                  onClick={() => setShowAiModal(true)}
                  className="w-full mb-4 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <BrainCircuit size={16} /> Generate AI Summary <Sparkles size={13} className="text-violet-300" />
                </button>
              )}

              <NavButtons
                onBack={prev}
                onNext={next}
                nextLabel="Continue"
              />
            </div>
          )}

          {/* ══ STEP 3: Choose Service ══ */}
          {step === 3 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900">What do you need?</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-5">Choose the service that fits your situation</p>

              <div className="space-y-3">
                {[
                  {
                    val: 'expert',
                    icon: Stethoscope,
                    title: 'Expert Second Opinion',
                    desc: 'Share your case with experienced specialists. Best for complex or uncertain diagnoses.',
                    badge: 'Most Popular',
                    color: 'sky',
                  },
                  {
                    val: 'caselet',
                    icon: ClipboardCheck,
                    title: 'Create Medical Summary',
                    desc: 'Build a portable, secure summary of your records for personal use or future visits.',
                    badge: null,
                    color: 'violet',
                  },
                ].map(opt => {
                  const Icon = opt.icon;
                  const active = form.intent === opt.val;
                  return (
                    <button
                      key={opt.val}
                      onClick={() => set('intent', opt.val)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                        active
                          ? opt.color === 'sky' ? 'border-sky-500 bg-sky-50/60' : 'border-violet-400 bg-violet-50/50'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        active
                          ? opt.color === 'sky' ? 'bg-sky-600 text-white' : 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold text-slate-900">{opt.title}</span>
                          {opt.badge && (
                            <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">{opt.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        active
                          ? opt.color === 'sky' ? 'border-sky-600 bg-sky-600' : 'border-violet-500 bg-violet-500'
                          : 'border-slate-300'
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <NavButtons
                onBack={prev}
                onNext={() => form.intent === 'caselet' ? setStep(5) : next()}
                nextLabel={form.intent === 'caselet' ? 'Create Summary' : 'Choose Doctors'}
                nextDisabled={!form.intent}
              />
            </div>
          )}

          {/* ══ STEP 4: Doctors ══ */}
          {step === 4 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900">Choose Doctor(s)</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">One specialist or a panel — your call</p>

              {/* Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                {[
                  { val: 'single',   label: 'Single Expert' },
                  { val: 'multiple', label: 'Panel (Multiple)' },
                ].map(({ val, label }) => (
                  <button key={val}
                    onClick={() => setForm(f => ({ ...f, consultType: val, selectedDoctors: [] }))}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      form.consultType === val ? 'bg-white shadow text-sky-800' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {!form.consultType && (
                <p className="text-xs text-center text-slate-400 mb-3">Select single or panel above to get started</p>
              )}

              <div className="space-y-2">
                {DOCTORS.map(doc => {
                  const active = !!form.selectedDoctors.find(d => d.id === doc.id);
                  const initials = doc.name.split(' ').slice(1).map(n => n[0]).join('');
                  return (
                    <button key={doc.id}
                      onClick={() => form.consultType && toggleDoc(doc)}
                      disabled={!form.consultType}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                        !form.consultType ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50' :
                        active ? 'border-sky-500 bg-sky-50/60' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${active ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800'}`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.specialty} · {doc.experience}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star size={11} fill="currentColor" /> {doc.rating}
                        </div>
                        <p className="text-xs font-bold text-sky-700">₹{doc.fee}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ml-1 ${active ? 'border-sky-600 bg-sky-600' : 'border-slate-300'}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {form.selectedDoctors.length > 0 && (
                <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-sky-800 font-semibold">
                    {form.selectedDoctors.length} doctor{form.selectedDoctors.length > 1 ? 's' : ''} selected
                  </span>
                  <span className="text-sm font-extrabold text-sky-800">₹{form.selectedDoctors.length * 1500 + 200}</span>
                </div>
              )}

              <NavButtons
                onBack={prev}
                onNext={next}
                nextLabel="Review & Pay"
                nextDisabled={form.selectedDoctors.length === 0}
              />
            </div>
          )}

          {/* ══ STEP 5: Payment ══ */}
          {step === 5 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900">Review & Pay</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-5">Confirm your booking before payment</p>

              {form.intent === 'caselet' ? (
                /* Caselet confirmation */
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-5 text-center">
                  <ClipboardCheck size={28} className="text-violet-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 mb-1">Medical Summary</p>
                  <p className="text-xs text-slate-500">
                    {form.documents.length} document{form.documents.length !== 1 ? 's' : ''} will be compiled into a secure health record.
                  </p>
                  <p className="text-xs text-violet-600 font-bold mt-2">Free · No payment required</p>
                </div>
              ) : (
                /* Expert opinion bill */
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-4">
                  <div className="p-4 space-y-3">
                    {form.selectedDoctors.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.specialty} Consultation</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900">₹1,500</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-sm text-slate-500">Platform Fee</span>
                      <span className="text-sm font-bold text-slate-900">₹200</span>
                    </div>
                  </div>
                  <div className="bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-sky-700">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
                <ShieldCheck size={14} className="text-sky-600 shrink-0" />
                <span>256-bit SSL secured. Your data is never shared without consent.</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing…
                  </span>
                ) : form.intent === 'caselet' ? (
                  <><ClipboardCheck size={16} /> Create My Summary</>
                ) : (
                  <><CreditCard size={16} /> Pay ₹{totalAmount} Securely</>
                )}
              </button>

              {form.intent !== 'caselet' && (
                <button onClick={prev} className="w-full mt-2 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
                  ← Change doctor selection
                </button>
              )}
            </div>
          )}

          {/* ══ STEP 6: Success ══ */}
          {step === 6 && (
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <CheckCircle2 size={38} className="text-emerald-600" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                {form.intent === 'expert' ? 'Booking Confirmed!' : 'Summary Created!'}
              </h2>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
                {form.intent === 'expert'
                  ? 'Your case has been shared with the selected doctors. Expect details via SMS & email within 2 business days.'
                  : 'Your medical records are securely saved and compiled into your profile.'}
              </p>

              {form.intent === 'expert' && (
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
          )}

        </div>
      </div>

      {/* ── AI Summary Modal ── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
            >
              <X size={14} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                <BrainCircuit size={20} className="text-violet-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">AI Health Summary</h3>
                <p className="text-xs text-slate-400">From {form.documents.length} document{form.documents.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 space-y-2.5">
              <p><span className="font-bold text-slate-800">Key Finding:</span> Elevated lipids noted in recent blood test.</p>
              <p><span className="font-bold text-slate-800">Medication:</span> Statins 10mg per latest prescription.</p>
              <p><span className="font-bold text-slate-800">History:</span> Past cardiac event in discharge summary.</p>
              <p className="text-[11px] text-slate-400 italic pt-1">AI-generated to assist physicians. Not a medical diagnosis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}