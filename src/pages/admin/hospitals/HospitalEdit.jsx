import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Users, Phone, MapPin, Activity, CheckCircle } from 'lucide-react';

const STATUS_CONFIG = {
  active:   { label: 'Active',   dot: 'bg-emerald-500', ring: 'ring-emerald-200 bg-emerald-50 text-emerald-700' },
  pending:  { label: 'Pending',  dot: 'bg-amber-400',   ring: 'ring-amber-200 bg-amber-50 text-amber-700' },
  inactive: { label: 'Inactive', dot: 'bg-slate-400',   ring: 'ring-slate-200 bg-slate-100 text-slate-600' },
};

function Field({ label, icon: Icon, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function HospitalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name:    isEdit ? 'Apollo Medical Center' : '',
    staff:   isEdit ? '420' : '',
    contact: isEdit ? '+1 415 555 0101' : '',
    city:    isEdit ? 'San Francisco' : '',
    status:  isEdit ? 'active' : 'pending',
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Hospital name is required.';
    if (!formData.city.trim())    e.city    = 'City is required.';
    if (formData.staff && isNaN(Number(formData.staff))) e.staff = 'Must be a number.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => navigate('/admin/hospitals'), 1200);
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm border rounded-sm bg-white text-slate-900 placeholder-slate-300
     focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      errors[field]
        ? 'border-red-300 focus:ring-red-400'
        : 'border-slate-200 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] hover:border-slate-300'
    }`;

  return (
    <div className=" mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/hospitals"
          className="w-9 h-9 flex items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Hospital' : 'Add Hospital'}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isEdit ? 'Update details for this hospital.' : 'Register a new hospital in your network.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white border border-slate-200 rounded-sm  overflow-hidden">

          {/* Section: Basic Info */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Basic Information</h2>
          </div>

          <div className="p-6 space-y-5">
            <Field label="Hospital Name" icon={Building2} error={errors.name}>
              <input
                type="text"
                value={formData.name}
                onChange={set('name')}
                placeholder="e.g. Apollo Medical Center"
                className={inputClass('name')}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="City" icon={MapPin} error={errors.city}>
                <input
                  type="text"
                  value={formData.city}
                  onChange={set('city')}
                  placeholder="e.g. San Francisco"
                  className={inputClass('city')}
                />
              </Field>

              <Field label="Staff Count" icon={Users} hint="Total number of employed staff." error={errors.staff}>
                <input
                  type="number"
                  value={formData.staff}
                  onChange={set('staff')}
                  placeholder="e.g. 420"
                  min="0"
                  className={inputClass('staff')}
                />
              </Field>
            </div>

            <Field label="Contact Number" icon={Phone}>
              <input
                type="text"
                value={formData.contact}
                onChange={set('contact')}
                placeholder="e.g. +1 415 555 0101"
                className={inputClass('contact')}
              />
            </Field>
          </div>

          {/* Section: Status */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</h2>
          </div>

          <div className="p-6">
            <Field label="Operational Status" icon={Activity} hint="Controls how this hospital appears across the platform.">
              <div className="grid grid-cols-3 gap-3 mt-1">
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                  <label
                    key={val}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-sm border cursor-pointer transition-all ${
                      formData.status === val
                        ? 'border-[#2DB37D] bg-[#edf9f4] ring-2 ring-[#2DB37D]/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={val}
                      checked={formData.status === val}
                      onChange={set('status')}
                      className="sr-only"
                    />
                    <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                    <span className={`text-sm font-medium ${formData.status === val ? 'text-[#2DB37D]' : 'text-slate-600'}`}>
                      {cfg.label}
                    </span>
                    {formData.status === val && (
                      <CheckCircle className="w-3.5 h-3.5 text-[#2DB37D] ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {isEdit ? 'Changes are saved immediately after submission.' : 'Hospital will be added to your network.'}
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/hospitals"
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saved}
                className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-sm transition-all shadow-sm active:scale-[0.98] ${
                  saved
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-[#2DB37D] hover:bg-[#24a06e] text-white'
                }`}
              >
                {saved ? (
                  <><CheckCircle className="w-4 h-4" /> Saved!</>
                ) : (
                  <><Save className="w-4 h-4" />{isEdit ? 'Save Changes' : 'Add Hospital'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}