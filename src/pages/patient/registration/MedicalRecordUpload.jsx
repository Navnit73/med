import { useState, useRef, useEffect } from 'react';
import { FileText, Plus, BrainCircuit, Sparkles, X, CheckCircle2, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { Field, Input, Select, NavButtons } from './SharedComponents';
import api from '../../../api/axios';

const DocCard = ({ doc, index, total, onRemove, uploading }) => {
  const ext = doc.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const extColors = {
    PDF: 'bg-rose-50 text-rose-600',
    JPG: 'bg-sky-50 text-sky-600',
    JPEG: 'bg-sky-50 text-sky-600',
    PNG: 'bg-violet-50 text-violet-600',
  };
  const badge = extColors[ext] || 'bg-slate-100 text-slate-600';

  const trimName = (name) => {
    if (!name || name.length <= 25) return name;
    return name.substring(0, 15) + '...' + name.slice(-8);
  };

  return (
    <div className="flex gap-2 sm:gap-3 relative">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 z-10 ${uploading ? 'bg-amber-100 text-amber-600 animate-pulse' : doc.uploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'}`}>
          {uploading ? '↑' : doc.uploaded ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : index + 1}
        </div>
        {index < total - 1 && <div className="w-px flex-1 bg-slate-100 mt-1 mb-1 min-h-[12px]" />}
      </div>

      <div className={`flex-1 mb-3 bg-white border rounded-xl p-3 sm:px-4 sm:py-3 shadow-sm flex items-start gap-2.5 sm:gap-3 transition-all ${doc.uploaded ? 'border-emerald-100' : 'border-slate-200'}`}>
        <div className={`px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-black shrink-0 mt-0.5 ${badge}`}>{ext}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{doc.title}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">{doc.type} · {trimName(doc.fileName)}</p>
          {doc.uploaded && (
            <p className="text-[9px] sm:text-[10px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
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

const AddDocPanel = ({ docTypes, onAdd, onCancel }) => {
  const fileRef = useRef(null);
  const [local, setLocal] = useState({ title: '', type: docTypes[0] || 'Other', file: null, consent: false });
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
    if (!local.consent) { setErr('Please check the consent box to upload this document'); return; }
    onAdd(local);
  };

  return (
    <div className="border-2 border-sky-200 border-dashed bg-sky-50/40 rounded-2xl p-3 sm:p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] sm:text-xs font-bold text-sky-700 flex items-center gap-1.5">
          <Plus size={13} /> New Document
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
          {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </Field>

      <div
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${local.file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-sky-300 bg-white'}`}
      >
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFile} className="hidden" />
        {local.file ? (
          <>
            <CheckCircle2 size={20} className="text-emerald-500" />
            <p className="text-[11px] sm:text-xs font-bold text-emerald-700 truncate max-w-[200px]">{local.file.name}</p>
            <p className="text-[10px] text-slate-400">{(local.file.size / 1024).toFixed(0)} KB · tap to change</p>
          </>
        ) : (
          <>
            <Upload size={18} className="text-slate-400" />
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500">Tap to select file</p>
            <p className="text-[9px] sm:text-[10px] text-slate-400">PDF, JPG, PNG, DOC — max 10 MB</p>
          </>
        )}
      </div>

      <label className="flex items-start gap-2 cursor-pointer pt-1 px-1">
        <input 
          type="checkbox" 
          checked={local.consent}
          onChange={e => setLocal(d => ({ ...d, consent: e.target.checked }))}
          className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-[11px] sm:text-xs text-slate-600 leading-tight">
          I consent to upload this document to be used for my medical evaluation and shared with the selected specialists.
        </span>
      </label>

      {err && (
        <p className="text-[11px] sm:text-xs text-rose-500 flex items-center gap-1.5">
          <AlertCircle size={12} /> {err}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all">
          Cancel
        </button>
        <button onClick={submit}
          className="flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all active:scale-95">
          Add Document
        </button>
      </div>
    </div>
  );
};

export default function MedicalRecordUpload({ form, uploadingId, addDoc, removeDoc, showAiModal, setShowAiModal, onNext, onBack, loading }) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [docTypes, setDocTypes] = useState(['Other']);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/document/types');
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setDocTypes(data);
        }
      } catch (err) {
        console.error('Failed to fetch doc types', err);
      }
    };
    fetchTypes();
  }, []);

  const handleAdd = (local) => {
    addDoc(local);
    setShowAddPanel(false);
  };

  return (
    <div className="p-5 sm:p-7">
      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Medical Records</h2>
      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 mb-4 sm:mb-5">
        Upload prescriptions, reports, or scans. You can add multiple documents.
      </p>

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

      {form.documents.length === 0 && !showAddPanel && (
        <div className="py-8 sm:py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-slate-400 mb-4">
          <FileText size={28} className="mb-2 opacity-25" />
          <p className="text-xs sm:text-sm font-semibold text-slate-400">No documents yet</p>
          <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 text-center px-4">Required — please upload at least one document to proceed</p>
        </div>
      )}

      {showAddPanel ? (
        <AddDocPanel docTypes={docTypes} onAdd={handleAdd} onCancel={() => setShowAddPanel(false)} />
      ) : (
        <button
          onClick={() => setShowAddPanel(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 border-2 border-dashed border-sky-200 hover:border-sky-400 text-sky-600 hover:text-sky-700 text-[13px] sm:text-sm font-bold rounded-xl transition-all hover:bg-sky-50/50 mb-4 active:scale-[0.99]"
        >
          <Plus size={16} /> Add Document
        </button>
      )}

      {form.documents.length >= 2 && !showAddPanel && (
        <button
          onClick={() => setShowAiModal(true)}
          className="w-full mb-4 py-3 sm:py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-[13px] sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <BrainCircuit size={16} /> Generate AI Summary <Sparkles size={13} className="text-violet-300" />
        </button>
      )}

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel={form.intent === 'caselet' ? "Generate Caselet & Pay" : "Continue"}
        nextDisabled={form.documents.length === 0}
        loading={loading}
      />

      {/* ── AI Summary Modal ── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm shadow-2xl relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in duration-200">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
            >
              <X size={14} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                <BrainCircuit size={20} className="text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">AI Health Summary</h3>
                <p className="text-[11px] sm:text-xs text-slate-400">From {form.documents.length} document{form.documents.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 text-[13px] sm:text-sm text-slate-700 space-y-2.5">
              <p><span className="font-bold text-slate-800">Key Finding:</span> Elevated lipids noted in recent blood test.</p>
              <p><span className="font-bold text-slate-800">Medication:</span> Statins 10mg per latest prescription.</p>
              <p><span className="font-bold text-slate-800">History:</span> Past cardiac event in discharge summary.</p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 italic pt-1">AI-generated to assist physicians. Not a medical diagnosis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
