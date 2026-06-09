import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, ChevronRight, ChevronLeft, Upload,
  Stethoscope, FileText, CreditCard, Star, CalendarClock,
  X, File, Sparkles, BrainCircuit, User, Phone, MapPin,
  Building2, ClipboardList, Heart, AlertCircle, Pill,
  ShieldCheck, Calendar, Mail
} from 'lucide-react';

/* ─── Field primitives ─── */
const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
    {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
  </label>
);

const Input = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
    <input
      {...props}
      className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all ${className}`}
    />
  </div>
);

const Select = ({ icon: Icon, children, ...props }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />}
    <select
      {...props}
      className={`w-full appearance-none ${Icon ? 'pl-10' : 'px-4'} pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all`}
    >
      {children}
    </select>
    <ChevronRight size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
  </div>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none transition-all"
  />
);

const Field = ({ label, required, children, hint }) => (
  <div>
    <Label required={required}>{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const Row2 = ({ children }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

/* ─── Section divider ─── */
const Section = ({ icon: Icon, title, color = 'teal', children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pt-2">
      <div className={`w-6 h-6 rounded-md bg-${color}-50 flex items-center justify-center shrink-0`}>
        <Icon size={13} className={`text-${color}-600`} />
      </div>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
    {children}
  </div>
);

/* ─── Step progress ─── */
const STEPS = ['Patient', 'Intent', 'Records', 'Doctors', 'Payment', 'Done'];

const StepBar = ({ step, total }) => (
  <div className="mb-4">
    {/* Mobile pill */}
    <div className="sm:hidden flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="w-8 h-8 rounded-full bg-teal-500 text-white text-xs font-black flex items-center justify-center shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-[11px] font-bold mb-1">
          <span className="text-teal-700">{STEPS[step - 1]}</span>
          <span className="text-slate-400">Step {step} of {total}</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (total - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>

    {/* Desktop dots */}
    <div className="hidden sm:flex items-center relative px-2">
      <div className="absolute inset-x-6 top-3.5 h-0.5 bg-slate-100" />
      <div
        className="absolute left-6 top-3.5 h-0.5 bg-teal-400 transition-all duration-500"
        style={{ width: `calc(${((step - 1) / (total - 1)) * 100}% - 3rem + 24px)` }}
      />
      {STEPS.map((label, i) => {
        const s = i + 1;
        const active = step === s;
        const done = step > s;
        return (
          <div key={s} className="flex-1 flex flex-col items-center relative z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
              done ? 'bg-teal-500 border-teal-500 text-white' :
              active ? 'bg-white border-teal-500 text-teal-600 shadow-md' :
              'bg-white border-slate-200 text-slate-400'
            }`}>
              {done ? <CheckCircle2 size={13} /> : s}
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${active ? 'text-teal-600' : done ? 'text-teal-400' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Sticky nav ─── */
const NavButtons = ({ onBack, onNext, nextLabel = 'Continue', nextDisabled = false, showBack = true }) => (
  <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 mt-6 flex gap-2">
    {showBack && (
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
      >
        <ChevronLeft size={16} /> Back
      </button>
    )}
    <button
      onClick={onNext}
      disabled={nextDisabled}
      className="ml-auto flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm shadow-teal-200"
    >
      {nextLabel} <ChevronRight size={16} />
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
export default function RegistrationWizard() {
  const { patientData, savePatientData } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    firstName: patientData?.firstName || '',
    lastName: patientData?.lastName || '',
    phone: patientData?.phone || '',
    email: patientData?.email || '',
    dob: patientData?.dob || '',
    gender: patientData?.gender || '',
    city: patientData?.city || '',
    state: patientData?.state || '',
    pincode: patientData?.pincode || '',
    department: '',
    chiefComplaint: '',
    symptomDuration: '',
    severity: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    surgicalHistory: '',
    familyHistory: '',
    earlierOpinion: '',
    intent: '',
    consultType: '',
    documents: [],
    selectedDoctors: [],
  });

  const [docInput, setDocInput] = useState({ title: '', type: 'Prescription', file: null });
  const [showAiModal, setShowAiModal] = useState(false);

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const handle = e => set(e.target.name, e.target.value);

  const indianDoctors = [
    { id: 1, name: 'Dr. Rajesh Kumar',  specialty: 'Oncology',      rating: 4.9, experience: '15 yrs', fee: 1500 },
    { id: 2, name: 'Dr. Priya Sharma',  specialty: 'Cardiology',    rating: 4.8, experience: '12 yrs', fee: 1500 },
    { id: 3, name: 'Dr. Ananya Patel',  specialty: 'Neurology',     rating: 4.9, experience: '10 yrs', fee: 1500 },
    { id: 4, name: 'Dr. Vikram Singh',  specialty: 'Orthopedics',   rating: 4.7, experience: '18 yrs', fee: 1500 },
    { id: 5, name: 'Dr. Meena Reddy',   specialty: 'Endocrinology', rating: 4.8, experience: '14 yrs', fee: 1500 },
  ];

  const toggleDoc = doc => {
    if (formData.consultType === 'single') {
      set('selectedDoctors', [doc]);
    } else {
      const has = formData.selectedDoctors.find(d => d.id === doc.id);
      set('selectedDoctors', has
        ? formData.selectedDoctors.filter(d => d.id !== doc.id)
        : [...formData.selectedDoctors, doc]);
    }
  };

  const addDocument = () => {
    if (!docInput.title || !docInput.file) return alert('Please enter a title and select a file.');
    set('documents', [...formData.documents, {
      id: Date.now(), title: docInput.title, type: docInput.type, fileName: docInput.file.name
    }]);
    setDocInput({ title: '', type: 'Prescription', file: null });
  };

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
        <StepBar step={step} total={totalSteps} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ── STEP 1: Patient Details ── */}
          {step === 1 && (
            <div className="p-5 sm:p-7 space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-0.5">About You</h2>
                <p className="text-xs text-slate-400">We'll use this to personalise your consultation</p>
              </div>

              <Section icon={User} title="Basic Info">
                <Row2>
                  <Field label="First Name" required>
                    <Input name="firstName" value={formData.firstName} onChange={handle} placeholder="Jane" />
                  </Field>
                  <Field label="Last Name" required>
                    <Input name="lastName" value={formData.lastName} onChange={handle} placeholder="Doe" />
                  </Field>
                </Row2>
                <Field label="Phone Number" required>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handle} placeholder="+91 98765 43210" icon={Phone} inputMode="tel" />
                </Field>
                <Field label="Email Address">
                  <Input name="email" type="email" value={formData.email} onChange={handle} placeholder="jane@email.com" icon={Mail} />
                </Field>
                <Row2>
                  <Field label="Date of Birth">
                    <Input name="dob" type="date" value={formData.dob} onChange={handle} icon={Calendar} />
                  </Field>
                  <Field label="Gender">
                    <Select name="gender" value={formData.gender} onChange={handle}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </Select>
                  </Field>
                </Row2>
              </Section>

              <Section icon={MapPin} title="Location">
                <Field label="City" required>
                  <Input name="city" value={formData.city} onChange={handle} placeholder="Mumbai" icon={MapPin} />
                </Field>
                <Row2>
                  <Field label="State">
                    <Select name="state" value={formData.state} onChange={handle}>
                      <option value="">Select State</option>
                      {['Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Gujarat','Rajasthan','Uttar Pradesh','Telangana','Kerala'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Pincode">
                    <Input name="pincode" value={formData.pincode} onChange={handle} placeholder="400001" inputMode="numeric" maxLength={6} />
                  </Field>
                </Row2>
              </Section>

              <Section icon={Building2} title="Speciality Needed">
                <Field label="Department" required>
                  <Select name="department" value={formData.department} onChange={handle} icon={Building2}>
                    <option value="">Choose Department</option>
                    <option>Cardiology</option><option>Oncology</option>
                    <option>Neurology</option><option>Orthopedics</option>
                    <option>Endocrinology</option><option>Nephrology</option>
                    <option>Pulmonology</option><option>Gastroenterology</option>
                  </Select>
                </Field>
              </Section>

              <Section icon={ClipboardList} title="Medical History">
                <Field label="Main Symptom / Chief Complaint" required>
                  <Textarea name="chiefComplaint" value={formData.chiefComplaint} onChange={handle} rows={3} placeholder="What's bothering you most? Describe briefly..." />
                </Field>
                <Row2>
                  <Field label="How Long?">
                    <Select name="symptomDuration" value={formData.symptomDuration} onChange={handle}>
                      <option value="">Duration</option>
                      <option>Under 1 week</option><option>1–4 weeks</option>
                      <option>1–3 months</option><option>3–6 months</option>
                      <option>Over 6 months</option>
                    </Select>
                  </Field>
                  <Field label="Severity">
                    <Select name="severity" value={formData.severity} onChange={handle}>
                      <option value="">Level</option>
                      <option>Mild</option><option>Moderate</option><option>Severe</option>
                    </Select>
                  </Field>
                </Row2>
                <Field label="Allergies" hint="e.g. Penicillin, Shellfish, Dust">
                  <Input name="allergies" value={formData.allergies} onChange={handle} placeholder="List any known allergies" icon={AlertCircle} />
                </Field>
                <Field label="Current Medications" hint="Name and dosage if known">
                  <Input name="currentMedications" value={formData.currentMedications} onChange={handle} placeholder="e.g. Metformin 500mg" icon={Pill} />
                </Field>
                <Field label="Ongoing Conditions">
                  <Input name="chronicConditions" value={formData.chronicConditions} onChange={handle} placeholder="e.g. Diabetes, Hypertension" icon={Heart} />
                </Field>
                <Field label="Past Surgeries">
                  <Input name="surgicalHistory" value={formData.surgicalHistory} onChange={handle} placeholder="e.g. Appendectomy 2015" />
                </Field>
                <Field label="Family Medical History">
                  <Input name="familyHistory" value={formData.familyHistory} onChange={handle} placeholder="e.g. Father – Cardiac, Mother – Diabetes" />
                </Field>
                <Field label="Previous Consultations">
                  <Textarea name="earlierOpinion" value={formData.earlierOpinion} onChange={handle} rows={2} placeholder="Any prior diagnosis or specialist visits?" />
                </Field>
              </Section>

              <NavButtons
                showBack={false}
                onNext={next}
                nextLabel="Next Step"
                nextDisabled={!formData.firstName || !formData.phone || !formData.department || !formData.chiefComplaint}
              />
            </div>
          )}

          {/* ── STEP 2: Intent ── */}
          {step === 2 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900 mb-0.5">What do you need?</h2>
              <p className="text-xs text-slate-400 mb-5">Pick the service that suits your situation</p>

              <div className="space-y-3">
                {[
                  {
                    val: 'expert',
                    icon: Stethoscope,
                    title: 'Expert Second Opinion',
                    desc: 'Share your case with experienced specialists. Best for complex or uncertain diagnoses.',
                    badge: 'Most Popular',
                  },
                  {
                    val: 'caselet',
                    icon: FileText,
                    title: 'Create Medical Summary',
                    desc: 'Build a portable, secure summary of your records for personal use or future visits.',
                  },
                ].map(opt => {
                  const Icon = opt.icon;
                  const active = formData.intent === opt.val;
                  return (
                    <button
                      key={opt.val}
                      onClick={() => set('intent', opt.val)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                        active ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold text-slate-900">{opt.title}</span>
                          {opt.badge && (
                            <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{opt.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${active ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <NavButtons onBack={prev} onNext={next} nextDisabled={!formData.intent} />
            </div>
          )}

          {/* ── STEP 3: Uploads ── */}
          {step === 3 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900 mb-0.5">Medical Records</h2>
              <p className="text-xs text-slate-400 mb-4">Upload prescriptions, reports, or scan copies</p>

              {/* Add form */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 mb-4">
                <Field label="Document Title">
                  <Input
                    value={docInput.title}
                    onChange={e => setDocInput(d => ({ ...d, title: e.target.value }))}
                    placeholder="e.g. Blood Test Nov 2024"
                  />
                </Field>
                <Field label="Document Type">
                  <Select value={docInput.type} onChange={e => setDocInput(d => ({ ...d, type: e.target.value }))}>
                    <option>Prescription</option>
                    <option>Discharge Summary</option>
                    <option>Blood Report</option>
                    <option>Radiology Scan</option>
                    <option>Pathology Report</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="File">
                  <input
                    type="file"
                    onChange={e => setDocInput(d => ({ ...d, file: e.target.files[0] }))}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer bg-white border border-slate-200 rounded-xl p-2"
                  />
                </Field>
                <button
                  onClick={addDocument}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                >
                  <Upload size={15} /> Add Document
                </button>
              </div>

              {/* Uploaded list */}
              {formData.documents.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {formData.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-3 shadow-sm">
                      <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                        <File size={15} className="text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{doc.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{doc.type} · {doc.fileName}</p>
                      </div>
                      <button
                        onClick={() => set('documents', formData.documents.filter(d => d.id !== doc.id))}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowAiModal(true)}
                    className="w-full mt-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <BrainCircuit size={16} /> Generate AI Summary <Sparkles size={13} className="text-violet-300" />
                  </button>
                </div>
              ) : (
                <div className="py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-slate-400 mb-4">
                  <FileText size={30} className="mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-slate-400">No documents added yet</p>
                  <p className="text-xs text-slate-300 mt-0.5">Optional — add reports for better consultations</p>
                </div>
              )}

              <NavButtons
                onBack={prev}
                onNext={() => formData.intent === 'caselet' ? setStep(6) : next()}
                nextLabel={formData.intent === 'caselet' ? 'Submit' : 'Continue'}
              />

              {/* AI Modal */}
              {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                    <button
                      onClick={() => setShowAiModal(false)}
                      className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center"
                    >
                      <X size={14} className="text-slate-600" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                        <BrainCircuit size={20} className="text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900">AI Health Summary</h3>
                        <p className="text-xs text-slate-400">From {formData.documents.length} document{formData.documents.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 space-y-2">
                      <p><strong>Key Finding:</strong> Elevated lipids noted in recent blood test.</p>
                      <p><strong>Medication:</strong> Statins 10mg per latest prescription.</p>
                      <p><strong>History:</strong> Past cardiac event in discharge summary.</p>
                      <p className="text-[11px] text-slate-400 italic pt-1">AI-generated to assist physicians. Not a diagnosis.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: Doctors ── */}
          {step === 4 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900 mb-0.5">Choose Doctor(s)</h2>
              <p className="text-xs text-slate-400 mb-4">One specialist or a panel — you decide</p>

              {/* Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                {[
                  { val: 'single', label: 'Single Expert' },
                  { val: 'multiple', label: 'Panel (Multiple)' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setFormData(f => ({ ...f, consultType: val, selectedDoctors: [] }))}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${formData.consultType === val ? 'bg-white shadow text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!formData.consultType && (
                <p className="text-xs text-center text-slate-400 mb-3">Select single or panel to enable doctor selection</p>
              )}

              <div className="space-y-2">
                {indianDoctors.map(doc => {
                  const active = !!formData.selectedDoctors.find(d => d.id === doc.id);
                  const initials = doc.name.split(' ').slice(1).map(n => n[0]).join('');
                  return (
                    <button
                      key={doc.id}
                      onClick={() => formData.consultType && toggleDoc(doc)}
                      disabled={!formData.consultType}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                        !formData.consultType ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50' :
                        active ? 'border-teal-500 bg-teal-50/60' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${active ? 'bg-teal-500 text-white' : 'bg-teal-50 text-teal-700'}`}>
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
                        <p className="text-xs font-bold text-teal-600">₹{doc.fee}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ml-1 ${active ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {formData.selectedDoctors.length > 0 && (
                <div className="mt-3 bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs text-teal-700 font-semibold">{formData.selectedDoctors.length} doctor{formData.selectedDoctors.length > 1 ? 's' : ''} selected</span>
                  <span className="text-sm font-extrabold text-teal-700">₹{formData.selectedDoctors.length * 1500 + 200}</span>
                </div>
              )}

              <NavButtons
                onBack={prev}
                onNext={next}
                nextLabel="Proceed to Payment"
                nextDisabled={formData.selectedDoctors.length === 0}
              />
            </div>
          )}

          {/* ── STEP 5: Payment ── */}
          {step === 5 && (
            <div className="p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-slate-900 mb-0.5">Review & Pay</h2>
              <p className="text-xs text-slate-400 mb-5">Confirm your booking details</p>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-4">
                <div className="p-4 space-y-3">
                  {formData.selectedDoctors.map(doc => (
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
                  <span className="text-2xl font-extrabold text-teal-600">₹{formData.selectedDoctors.length * 1500 + 200}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
                <ShieldCheck size={14} className="text-teal-500 shrink-0" />
                <span>Secured by 256-bit SSL. Your data is never shared without consent.</span>
              </div>

              <button
                onClick={() => { savePatientData(formData); next(); }}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <CreditCard size={16} /> Pay ₹{formData.selectedDoctors.length * 1500 + 200} Securely
              </button>

              <button onClick={prev} className="w-full mt-2 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
                ← Change doctor selection
              </button>
            </div>
          )}

          {/* ── STEP 6: Success ── */}
          {step === 6 && (
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 size={38} className="text-emerald-600" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                {formData.intent === 'expert' ? 'Booking Confirmed!' : 'Summary Created!'}
              </h2>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
                {formData.intent === 'expert'
                  ? "Your case has been shared with the selected doctors. Expect appointment details via SMS & email within 2 business days."
                  : "Your medical records are securely saved to your profile."}
              </p>

              {formData.intent === 'expert' && (
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 text-xs text-teal-700 font-semibold mb-6">
                  <CalendarClock size={14} className="shrink-0" /> You'll be notified via SMS & Email
                </div>
              )}

              <button
                onClick={() => navigate('/patient')}
                className="w-full max-w-xs py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}