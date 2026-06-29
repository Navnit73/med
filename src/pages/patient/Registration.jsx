import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { StepBar, apiCall } from './registration/SharedComponents';
import api from '../../api/axios';
import MedicalRecordUpload from './registration/MedicalRecordUpload';
import ServiceSelection from './registration/ServiceSelection';
import DoctorSelection from './registration/DoctorSelection';
import Payment from './registration/Payment';
import Thanks from './registration/Thanks';

const STEPS_MAP = {
  'medical_record_upload': 1,
  'service_selection': 2,
  'doctor_selection': 3,
  'payment': 4,
  'thanks': 5
};

const STEP_URLS = [
  '',
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
  const totalSteps = 5;

  const basePath = location.pathname.startsWith('/patient/second_opinion') 
    ? '/patient/second_opinion' 
    : '/patient/registration';

  useEffect(() => {
    if (!stepId || !STEPS_MAP[stepId]) {
      navigate(`${basePath}/medical_record_upload`, { replace: true });
    }
  }, [stepId, basePath, navigate]);

  useEffect(() => {
    const fetchExistingDocs = async () => {
      try {
        const intentId = localStorage.getItem('current_intent_id');
        if (!intentId) return;
        
        const res = await api.get(`/document/patient/intent?intent_id=${intentId}`);
        if (res.data && Array.isArray(res.data)) {
          const fetchedDocs = res.data.map(d => ({
            id: d.document_id,
            serverId: d.document_id,
            title: d.document_description,
            type: d.document_type,
            fileName: d.file_url?.split('/').pop()?.split('?')[0] || 'document',
            fileUrl: d.file_url,
            uploaded: true
          }));
          setForm(f => ({ ...f, documents: fetchedDocs }));
        }
      } catch (err) {
        console.error('Error fetching existing docs:', err);
      }
    };
    fetchExistingDocs();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (step === 4 && form.intent === 'caselet') {
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
    setError(null);
    try {
      const fd = new FormData();
      const intentId = localStorage.getItem('current_intent_id') || '';
      fd.append('intent_id', intentId);
      fd.append('document_type', local.type);
      fd.append('document_description', local.title);
      fd.append('consent_given', 'true');
      fd.append('file', local.file);

      const res = await api.post('/document/patient/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;

      setForm(f => ({
        ...f,
        documents: f.documents.map(d => d.id === newDoc.id ? { ...d, uploaded: true, serverId: data.document_id, fileUrl: data.file_url } : d),
      }));
    } catch (err) {
      console.error('Document upload failed:', err);
      setError(err.response?.data?.detail || 'Document upload failed. Please try again.');
      setForm(f => ({ ...f, documents: f.documents.filter(d => d.id !== newDoc.id) }));
    } finally {
      setUploadingId(null);
    }
  };

  const removeDoc = async (id) => {
    const doc = form.documents.find(d => d.id === id);
    if (doc?.serverId) {
      try {
        await api.delete(`/document/patient/delete?document_id=${doc.serverId}`);
      } catch (err) {
        console.error('Failed to delete document from server:', err);
      }
    }
    setForm(f => ({ ...f, documents: f.documents.filter(d => d.id !== id) }));
  };

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
    setError(null);
    try {
      const intentIdStr = localStorage.getItem('current_intent_id');
      const intentId = intentIdStr ? parseInt(intentIdStr, 10) : 10;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/flexreport/trigger`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intent_id: intentId })
      });
      const data = await res.json();
      localStorage.setItem('flexreport_response', JSON.stringify(data));
      next();
    } catch (err) {
      console.error('Flexreport API Error:', err);
      setError('Failed to trigger flex report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (selectedIntent) => {
    const finalIntent = typeof selectedIntent === 'string' ? selectedIntent : form.intent;
    if (typeof selectedIntent === 'string') {
      set('intent', finalIntent);
    }

    // Backend intent is already created or managed elsewhere, so we just advance UI.
    finalIntent === 'caselet' ? navigate(`${basePath}/payment`) : next();
  };

  const handleStep3 = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/registration/step-4', {
        patient_id: patientData?.patient_id,
        step_id: 3,
        consult_type: form.consultType,
        selected_doctor_ids: form.selectedDoctors.map(d => d.id)
      });
      next();
    } catch (err) {
      console.error('Step 4 API Error:', err);
      setError(err.response?.data?.detail || 'Failed to save doctor selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/registration/payment', {
        patient_id: patientData?.patient_id,
        step_id: 4,
        amount: totalAmount,
        currency: 'INR',
        intent: form.intent
      });
      next();
    } catch (err) {
      console.error('Payment API Error:', err);
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = form.selectedDoctors.length * 1500 + 200;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center pt-6 pb-20 sm:pt-12 px-4">
      {/* ── Wizard Card ── */}
      <div className="w-full max-w-[500px]">
        {/* Header (close button) */}
        {step < 5 && (
          <div className="flex justify-end mb-4 pr-1">
            <button onClick={() => navigate('/patient')} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Progress / Steps (hide on success) */}
          {step < 5 && (
            <div className="px-5 pt-6 pb-3 sm:px-7 border-b border-slate-50">
              <StepBar step={step} total={totalSteps} />
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">{error}</div>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 1: Records ══ */}
          {step === 1 && (
            <MedicalRecordUpload
              form={form}
              uploadingId={uploadingId}
              addDoc={addDoc}
              removeDoc={removeDoc}
              showAiModal={showAiModal}
              setShowAiModal={setShowAiModal}
              onNext={handleStep1}
              onBack={prev}
              loading={loading}
            />
          )}

          {/* ══ STEP 2: Service Selection ══ */}
          {step === 2 && (
            <ServiceSelection
              intent={form.intent}
              setIntent={(val) => set('intent', val)}
              onNext={handleStep2}
              onBack={prev}
              loading={loading}
            />
          )}

          {/* ══ STEP 3: Doctors ══ */}
          {step === 3 && (
            <DoctorSelection
              consultType={form.consultType}
              setConsultType={(val) => {
                set('consultType', val);
                set('selectedDoctors', []);
              }}
              selectedDoctors={form.selectedDoctors}
              toggleDoctor={toggleDoc}
              onNext={handleStep3}
              onBack={prev}
              loading={loading}
            />
          )}

          {/* ══ STEP 4: Payment ══ */}
          {step === 4 && (
            <Payment
              intent={form.intent}
              selectedDoctors={form.selectedDoctors}
              totalAmount={totalAmount}
              handlePayment={handlePaymentSubmit}
              loading={loading}
              onBack={prev}
            />
          )}

          {/* ══ STEP 5: Success ══ */}
          {step === 5 && (
            <Thanks intent={form.intent} />
          )}

        </div>
      </div>
    </div>
  );
}