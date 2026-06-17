import { CheckCircle2, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';

export const apiCall = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
};

export const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">
    {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
  </label>
);

export const Input = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
    <input
      {...props}
      className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all ${className}`}
    />
  </div>
);

export const Select = ({ icon: Icon, children, ...props }) => (
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

export const Field = ({ label, required, children, hint }) => (
  <div>
    <Label required={required}>{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{hint}</p>}
  </div>
);

export const Row2 = ({ children }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

const STEPS = [
  { label: 'You', short: 'You' },
  { label: 'Records', short: 'Docs' },
  { label: 'Service', short: 'Service' },
  { label: 'Doctors', short: 'Doctors' },
  { label: 'Pay', short: 'Pay' },
  { label: 'Done', short: 'Done' },
];

export const StepBar = ({ step, total }) => (
  <div className="mb-6">
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

export const NavButtons = ({ onBack, onNext, nextLabel = 'Continue', nextDisabled = false, showBack = true, loading = false }) => (
  <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 mt-6 flex gap-2 z-20">
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
