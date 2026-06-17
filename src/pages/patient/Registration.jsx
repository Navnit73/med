import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { StepBar, apiCall } from './registration/SharedComponents';
import api from '../../api/axios';
import PatientDetail from './registration/PatientDetail';
import MedicalRecordUpload from './registration/MedicalRecordUpload';
import ServiceSelection from './registration/ServiceSelection';
import DoctorSelection from './registration/DoctorSelection';
import Payment from './registration/Payment';
import Thanks from './registration/Thanks';

const STEPS_MAP = {
  'patient_details': 1,
  'medical_record_upload': 2,
  'service_selection': 3,
  'doctor_selection': 4,
  'payment': 5,
  'thanks': 6
};

const STEP_URLS = [
  '',
  'patient_details',
  'medical_record_upload',
  'service_selection',
  'doctor_selection',
  'payment',
  'thanks'
];

export default function RegistrationWizard() {
  const { patientData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { '*': currentPath } = useParams();

  const stepId = currentPath || '';
  const step = STEPS_MAP[stepId] || 1;
  const totalSteps = 6;

  const basePath = location.pathname.startsWith('/patient/second_opinion') 
    ? '/patient/second_opinion' 
    : '/patient/registration';

  useEffect(() => {
    if (!stepId || !STEPS_MAP[stepId]) {
      navigate(`${basePath}/patient_details`, { replace: true });
    }
  }, [stepId, basePath, navigate]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: patientData?.first_name || patientData?.firstName || '',
    lastName:  patientData?.last_name || patientData?.lastName  || '',
    phone:     patientData?.phone_number || patientData?.phone     || '',
    email:     patientData?.email     || '',
    documents:        [],
    intent:           '',   // 'expert' | 'caselet'
    consultType:      '',   // 'single' | 'multiple'
    selectedDoctors:  [],
  });

  const [showAiModal, setShowAiModal] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handle = e => set(e.target.name, e.target.value);

  const next = () => navigate(`${basePath}/${STEP_URLS[Math.min(step + 1, totalSteps)]}`);
  const prev = () => {
    if (step === 5 && form.intent === 'caselet') {
      navigate(`${basePath}/service_selection`);
    } else {
      navigate(`${basePath}/${STEP_URLS[Math.max(step - 1, 1)]}`);
    }
  };

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

    setUploadingId(newDoc.id);
    try {
      const fd = new FormData();
      fd.append('patient_id', patientData?.patient_id || '');
      fd.append('step_id', 2);
      fd.append('title', local.title);
      fd.append('type', local.type);
      fd.append('file', local.file);

      await api.post('/registration/document', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.error('Document upload failed:', err);
    } finally {
      setUploadingId(null);
      setForm(f => ({
        ...f,
        documents: f.documents.map(d => d.id === newDoc.id ? { ...d, uploaded: true } : d),
      }));
    }
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
        : [...form.selectedDoctors, doc]
      );
    }
  };

  /* ── API Submission Handlers ── */
  const handleStep1 = async () => {
    setLoading(true);
    try {
      await api.post('/registration/step-1', {
        patient_id: patientData?.patient_id,
        step_id: 1,
        first_name: form.firstName,
        last_name: form.lastName,
        phone_number: form.phone,
        email: form.email
      });
    } catch (err) { console.error('Step 1 API Error:', err); }
    setLoading(false);
    next();
  };

  const handleStep3 = async () => {
    setLoading(true);
    try {
      await api.post('/registration/step-3', {
        patient_id: patientData?.patient_id,
        step_id: 3,
        intent: form.intent
      });
    } catch (err) { console.error('Step 3 API Error:', err); }
    setLoading(false);
    form.intent === 'caselet' ? navigate(`${basePath}/payment`) : next();
  };

  const handleStep4 = async () => {
    setLoading(true);
    try {
      await api.post('/registration/step-4', {
        patient_id: patientData?.patient_id,
        step_id: 4,
        consult_type: form.consultType,
        selected_doctor_ids: form.selectedDoctors.map(d => d.id)
      });
    } catch (err) { console.error('Step 4 API Error:', err); }
    setLoading(false);
    next();
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/registration/payment', {
        patient_id: patientData?.patient_id,
        step_id: 5,
        amount: totalAmount,
        currency: 'INR',
        intent: form.intent
      });
    } catch (err) { console.error('Payment API Error:', err); }
    setLoading(false);
    next();
  };

  const totalAmount = form.selectedDoctors.length * 1500 + 200;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center pt-6 pb-20 sm:pt-12 px-4">
      {/* ── Wizard Card ── */}
      <div className="w-full max-w-[500px]">
        {/* Header (close button) */}
        {step < 6 && (
          <div className="flex justify-end mb-4 pr-1">
            <button onClick={() => navigate('/patient')} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Progress / Steps (hide on success) */}
          {step < 6 && (
            <div className="px-5 pt-6 pb-3 sm:px-7 border-b border-slate-50">
              <StepBar step={step} total={totalSteps} />
            </div>
          )}

          {/* ══ STEP 1: Patient ══ */}
          {step === 1 && (
            <PatientDetail
              form={form}
              handle={handle}
              onNext={handleStep1}
              loading={loading}
            />
          )}

          {/* ══ STEP 2: Records ══ */}
          {step === 2 && (
            <MedicalRecordUpload
              form={form}
              uploadingId={uploadingId}
              addDoc={addDoc}
              removeDoc={removeDoc}
              showAiModal={showAiModal}
              setShowAiModal={setShowAiModal}
              onNext={next}
              onBack={prev}
            />
          )}

          {/* ══ STEP 3: Service Selection ══ */}
          {step === 3 && (
            <ServiceSelection
              intent={form.intent}
              setIntent={(val) => set('intent', val)}
              onNext={handleStep3}
              onBack={prev}
              loading={loading}
            />
          )}

          {/* ══ STEP 4: Doctors ══ */}
          {step === 4 && (
            <DoctorSelection
              consultType={form.consultType}
              setConsultType={(val) => {
                set('consultType', val);
                set('selectedDoctors', []);
              }}
              selectedDoctors={form.selectedDoctors}
              toggleDoctor={toggleDoc}
              onNext={handleStep4}
              onBack={prev}
              loading={loading}
            />
          )}

          {/* ══ STEP 5: Payment ══ */}
          {step === 5 && (
            <Payment
              intent={form.intent}
              selectedDoctors={form.selectedDoctors}
              totalAmount={totalAmount}
              handlePayment={handlePaymentSubmit}
              loading={loading}
              onBack={prev}
            />
          )}

          {/* ══ STEP 6: Success ══ */}
          {step === 6 && (
            <Thanks intent={form.intent} />
          )}

        </div>
      </div>
    </div>
  );
}