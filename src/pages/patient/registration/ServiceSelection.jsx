import { Stethoscope, ClipboardCheck } from 'lucide-react';
import { NavButtons } from './SharedComponents';

export default function ServiceSelection({ intent, setIntent, onNext, onBack }) {
  const options = [
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
  ];

  return (
    <div className="p-5 sm:p-7">
      <h2 className="text-xl font-extrabold text-slate-900">What do you need?</h2>
      <p className="text-xs text-slate-400 mt-0.5 mb-5">Choose the service that fits your situation</p>

      <div className="space-y-3">
        {options.map(opt => {
          const Icon = opt.icon;
          const active = intent === opt.val;
          return (
            <button
              key={opt.val}
              onClick={() => setIntent(opt.val)}
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
        onBack={onBack}
        onNext={onNext}
        nextLabel={intent === 'caselet' ? 'Create Summary' : 'Choose Doctors'}
        nextDisabled={!intent}
      />
    </div>
  );
}
