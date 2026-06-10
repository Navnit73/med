import {
  Upload, FileText, Clock, ChevronRight, ShieldCheck,
  Brain, MessageCircleQuestion, Stethoscope, CheckCircle2,
  ArrowRight, Star, Layers, BookOpen, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-16 font-sans bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[#f0faf5] to-white pt-14 pb-16 px-2">
        <div className="max-w-4xl mx-auto text-center">

          {/* badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf9f4] border border-[#2DB37D]/30 text-[#2DB37D] text-xs font-semibold mb-5">
            <Zap className="w-3 h-3" /> Response in 20 minutes
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Understand your medical<br />
            <span className="text-[#2DB37D]">reports in plain language</span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Upload your reports. Our doctors analyse them and create a <strong className="text-slate-700 font-semibold">Caselet</strong> — a clear summary that helps you understand your condition, ask the right questions, and decide your next treatment step confidently.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signin?role=patient"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2DB37D] hover:bg-[#24a06e] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Get my Caselet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/find-doctors"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:border-[#2DB37D] hover:text-[#2DB37D] text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              <Stethoscope className="w-4 h-4" /> Browse Specialists
            </Link>
          </div>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Sound familiar?</h2>
            <p className="text-slate-500 text-sm">Most patients leave the clinic more confused than when they arrived.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '📄', title: 'Reports full of jargon', desc: 'Lab values, imaging findings, clinical terms — impossible to understand alone.' },
              { emoji: '🤖', title: 'Overwhelmed by AI answers', desc: 'ChatGPT gives you 10 different answers. You don\'t know what to trust.' },
              { emoji: '⏳', title: 'No time with your doctor', desc: 'A 10-minute appointment isn\'t enough to understand a complex diagnosis.' },
            ].map((p, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 text-center">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <p className="text-sm font-bold text-slate-800 mb-1">{p.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is a Caselet ── */}
      <section className="py-16 px-4 bg-[#f0faf5]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">What is a Caselet?</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Not an AI chatbot response. A real doctor reviews your reports and creates two tailored documents — one for you, one for your specialist.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Patient Caselet */}
            <div className="bg-white rounded-2xl border border-[#2DB37D]/20 p-6">
              <div className="w-10 h-10 rounded-xl bg-[#edf9f4] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-[#2DB37D]" strokeWidth={1.8} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2DB37D] mb-1">For You (Patient)</p>
              <h3 className="text-base font-bold text-slate-900 mb-3">Easy-to-understand summary</h3>
              <ul className="space-y-2">
                {[
                  'What your reports actually mean',
                  'Key findings explained simply',
                  'Questions to ask your doctor',
                  'What your options are',
                  'Next steps clearly laid out',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2DB37D] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctor Caselet */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-purple-500" strokeWidth={1.8} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-1">For Your Specialist</p>
              <h3 className="text-base font-bold text-slate-900 mb-3">Clinical insight summary</h3>
              <ul className="space-y-2">
                {[
                  'All reports curated into 1-2 pages',
                  'Clinical findings & differentials',
                  'Relevant history & risk factors',
                  'Surgery-ready case discussion brief',
                  'Evidence-based clinical context',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Multiple scattered reports → one clean 1–2 page document your doctor can act on
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">How it works</h2>
            <p className="text-slate-500 text-sm">From upload to clarity — in under 20 minutes.</p>
          </div>

          <div className="relative">
            {/* Vertical line — desktop only */}
            <div className="hidden sm:block absolute left-7 top-8 bottom-8 w-px border-l-2 border-dashed border-[#2DB37D]/25" />

            <div className="space-y-6">
              {[
                { step: '01', icon: Upload,       title: 'Upload your reports',      desc: 'Share your lab results, scans, discharge summaries — anything your doctors gave you. All securely encrypted.',            color: 'bg-[#edf9f4]', iconColor: 'text-[#2DB37D]', border: 'border-[#2DB37D]/20' },
                { step: '02', icon: Stethoscope,  title: 'Doctor reviews your case', desc: 'A verified specialist reads every document — not an algorithm. They analyse your complete picture.',                      color: 'bg-purple-50',  iconColor: 'text-purple-500', border: 'border-purple-100' },
                { step: '03', icon: FileText,      title: 'Your Caselet is built',    desc: 'Two documents created: a plain-language summary for you, and a clinical brief your specialist can use in consultation.',   color: 'bg-amber-50',   iconColor: 'text-amber-500',  border: 'border-amber-100' },
                { step: '04', icon: MessageCircleQuestion, title: 'Ask the right questions', desc: 'Go into your next appointment knowing exactly what to ask. Use your caselet to guide the conversation.',           color: 'bg-blue-50',    iconColor: 'text-blue-500',   border: 'border-blue-100' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 relative z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${item.color} border ${item.border} flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-[10px] font-bold text-slate-400">{item.step}</span>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-[#2DB37D] py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '20 min', label: 'Avg. caselet delivery' },
              { value: '12K+',  label: 'Verified specialists'  },
              { value: '98%',   label: 'Patient satisfaction'  },
              { value: '1–2 pg',label: 'Clean doctor brief'    },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-green-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why not AI ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Why not just use AI?</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              AI gives generic answers. Your caselet is built by a doctor who reads your specific reports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
              <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wide"></div>
              <div className="p-3 text-center text-xs font-bold text-slate-700 border-l border-slate-100">AI Chatbot</div>
              <div className="p-3 text-center text-xs font-bold text-[#2DB37D] border-l border-slate-100">MedExpert Caselet</div>
            </div>
            {[
              { label: 'Reads YOUR reports',       ai: false, us: true  },
              { label: 'Verified doctor review',   ai: false, us: true  },
              { label: 'Surgery-discussion brief',  ai: false, us: true  },
              { label: 'Questions for your doctor', ai: false, us: true  },
              { label: 'Clinically accurate',      ai: '⚠️',  us: true  },
              { label: 'Ready in 20 minutes',      ai: true,  us: true  },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-3 text-xs text-slate-600 font-medium">{row.label}</div>
                <div className="p-3 border-l border-slate-100 flex items-center justify-center">
                  {row.ai === true  ? <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  : row.ai === false ? <span className="text-slate-300 text-lg">✕</span>
                  :                   <span className="text-sm">{row.ai}</span>}
                </div>
                <div className="p-3 border-l border-slate-100 flex items-center justify-center">
                  {row.us ? <CheckCircle2 className="w-4 h-4 text-[#2DB37D]" /> : <span className="text-slate-300 text-lg">✕</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Built for trust</h2>
            <p className="text-slate-500 text-sm">Your health data is sensitive. We treat it that way.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: 'HIPAA compliant',    desc: 'End-to-end encrypted. Your records are never shared without consent.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Brain,       title: 'Doctor-verified',    desc: 'Every caselet is reviewed by a board-certified specialist — not an algorithm.', color: 'text-[#2DB37D]', bg: 'bg-[#edf9f4]' },
              { icon: Clock,       title: '20-minute delivery', desc: 'From upload to caselet in under 20 minutes. No waiting days for clarity.', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100">
                <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Patients who found clarity</h2>
            <p className="text-slate-500 text-sm">Real stories, real decisions made with confidence.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { text: "I had 6 different reports and had no idea what they meant. My caselet explained everything in 10 minutes. I knew exactly what questions to ask my surgeon.", name: "Priya S.",  title: "Pre-surgery, Mumbai"         },
              { text: "After months of confusion from online searches, one caselet gave me a clear picture. My oncologist said it was the best-prepared patient brief he'd seen.", name: "David K.", title: "Cancer patient, Toronto"       },
              { text: "My mother doesn't speak medical language. Her patient caselet was so simple she could explain her own condition to the family. Life-changing.", name: "Amir R.",  title: "Family caregiver, London"    },
            ].map((t, i) => (
              <div key={i} className="bg-[#f0faf5] p-5 rounded-2xl border border-[#2DB37D]/10 flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#2DB37D] text-[#2DB37D]" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-grow">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-[#2DB37D]/10">
                  <div className="w-8 h-8 rounded-full bg-[#edf9f4] border border-[#2DB37D]/20 flex items-center justify-center text-[#2DB37D] font-bold text-xs">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Caselets across specialties</h2>
              <p className="text-slate-500 text-xs">40+ specialties covered</p>
            </div>
            <Link to="/find-doctors" className="text-[#2DB37D] font-semibold hover:underline flex items-center gap-1 text-xs">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Pediatrics',
              'Dermatology', 'Radiology', 'General Surgery', 'Nephrology', 'Gastroenterology',
              'Endocrinology', 'Pulmonology'].map(s => (
              <Link
                key={s}
                to="/find-doctors"
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#2DB37D] hover:text-[#2DB37D] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Double CTA ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#2DB37D] rounded-3xl p-8 sm:p-12 text-center mb-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-green-100 mb-8 text-sm leading-relaxed max-w-md mx-auto">
              Upload your reports today. A doctor reviews them and delivers your Caselet — a clear, plain-language summary — in under 20 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signin?role=patient"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-[#2DB37D] bg-white hover:bg-green-50 rounded-xl shadow-md transition-all"
              >
                Get my Caselet <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/find-doctors"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white border border-white/30 hover:bg-white/10 rounded-xl transition-all"
              >
                <Stethoscope className="w-4 h-4" /> Browse Specialists
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">
            No subscription needed · Pay per caselet · Results in 20 minutes
          </p>
        </div>
      </section>

    </main>
  );
}