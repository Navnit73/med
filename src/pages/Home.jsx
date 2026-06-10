
import {
  ShieldCheck, Clock, FileText, Globe, HeartPulse, Brain,
  Bone, Baby, Sun, Microscope, Scissors, ArrowRight,
  CheckCircle2, Activity, Shield, Users, Stethoscope, ChevronRight,
  FileCheck2, Building2, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-20 font-sans">

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-24 lg:pt-28 lg:pb-36 overflow-hidden bg-white">
        {/* bg blobs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-indigo-100/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
                <Users className="w-4 h-4" />
                Trusted by 50,000+ patients worldwide
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                A second opinion from a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-indigo-900">
                  world-class specialist
                </span>
                , in 48 hours.
              </h1>

              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                MedExpert connects you with leading hospitals and board-certified specialists to deliver an evidence-based second opinion you can trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/signin?role=patient" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-200 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
                  Request a Second Opinion <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/find-doctors" className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all duration-200">
                  Browse Specialists
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                {[
                  { icon: CheckCircle2, label: 'No insurance needed' },
                  { icon: Shield,       label: 'HIPAA-compliant'     },
                  { icon: CheckCircle2, label: 'Cancel anytime'      },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — case card */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto mt-10 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl blur-2xl opacity-15" />
              <div className="relative bg-white border border-slate-100 shadow-2xl rounded-3xl p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-3xl" />

                <div className="flex justify-between items-start mb-7">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Case #MX-20451</p>
                    <p className="text-lg font-bold text-slate-900">Cardiology consultation</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    In review
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">MC</div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Specialist matched</p>
                        <p className="text-sm font-bold text-slate-900">Dr. M. Chen, MD</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> Cedar Park Medical
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <FileCheck2 className="w-4 h-4 text-indigo-500 mb-2" />
                      <p className="text-xs text-slate-500">Documents</p>
                      <p className="text-sm font-bold text-slate-900">12 files</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <Clock className="w-4 h-4 text-violet-500 mb-2" />
                      <p className="text-xs text-slate-500">Expected</p>
                      <p className="text-sm font-bold text-slate-900">36 hrs</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { label: 'Records',  done: true  },
                      { label: 'Imaging',  done: true  },
                      { label: 'Lab work', done: false },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                          {done
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                          }
                          {label}
                        </span>
                        <span className={`text-xs font-medium ${done ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {done ? 'Reviewed' : 'In review'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Partner Hospitals',   value: '500+' },
              { label: 'Specialists',          value: '12K+' },
              { label: 'Patient Satisfaction', value: '98%'  },
              { label: 'Average Response',     value: '48h'  },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-sm text-indigo-300 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why patients choose MedExpert</h2>
            <p className="text-lg text-slate-500">A complete platform built around speed, expertise, and trust.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Stethoscope, title: 'Top Specialists',   desc: 'Board-certified experts across 40+ specialties, vetted by our medical board.',        color: 'text-indigo-600', bg: 'bg-indigo-50'  },
              { icon: ShieldCheck,  title: 'HIPAA Secure',      desc: 'End-to-end encrypted records and consultations. Your privacy is non-negotiable.',    color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Clock,        title: 'Fast Turnaround',   desc: 'Written second opinion delivered within 48 hours of submission.',                    color: 'text-violet-600', bg: 'bg-violet-50'  },
              { icon: FileText,     title: 'Evidence-Based',    desc: 'Every opinion includes citations to current clinical literature and guidelines.',     color: 'text-amber-600',  bg: 'bg-amber-50'   },
              { icon: Globe,        title: 'Global Network',    desc: 'Partnered with leading hospitals across North America, Europe, and Asia.',            color: 'text-rose-600',   bg: 'bg-rose-50'    },
              { icon: HeartPulse,   title: 'Care Coordination', desc: 'Dedicated patient advocate to help navigate next steps after your opinion.',         color: 'text-cyan-600',   bg: 'bg-cyan-50'    },
            ].map((f, i) => (
              <div key={i} className="group p-7 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-700/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-700/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-lg text-indigo-300">Three simple steps to a second opinion you can trust.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-500/0 via-indigo-400/60 to-indigo-500/0" />

            {[
              { step: '01', title: 'Share your case',       desc: 'Upload your medical records, scans, and lab results securely.' },
              { step: '02', title: 'Match a specialist',    desc: 'We match you with the right expert based on your condition.'    },
              { step: '03', title: 'Receive your opinion',  desc: 'Get a comprehensive written report and optional video consult.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-800 border border-indigo-600 flex items-center justify-center text-2xl font-extrabold text-indigo-300 mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-indigo-300 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Covering 40+ specialties</h2>
              <p className="text-lg text-slate-500 max-w-xl">From oncology to cardiology, our network spans modern medicine.</p>
            </div>
            <Link to="/find-doctors" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1.5 transition-colors whitespace-nowrap text-sm">
              View all specialists <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Cardiology',     icon: HeartPulse  },
              { name: 'Oncology',       icon: Activity    },
              { name: 'Neurology',      icon: Brain       },
              { name: 'Orthopedics',    icon: Bone        },
              { name: 'Pediatrics',     icon: Baby        },
              { name: 'Dermatology',    icon: Sun         },
              { name: 'Radiology',      icon: Microscope  },
              { name: 'General Surgery',icon: Scissors    },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                  <s.icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Patients trust MedExpert</h2>
            <p className="text-lg text-slate-500">Real stories from people who found clarity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "MedExpert connected me with a leading oncologist within two days. The clarity I received changed my treatment path entirely.", name: "Rachel M.",  title: "Patient, Boston"        },
              { text: "The specialist's report was thorough, referenced, and easy to share with my local physician. Worth every minute.",            name: "David K.",   title: "Patient, Toronto"       },
              { text: "Having a second perspective from a top cardiologist gave my family the confidence to move forward with surgery.",             name: "Priya S.",   title: "Patient, San Francisco" },
            ].map((t, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-7 flex-grow">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.indigo.800),theme(colors.indigo.950))]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5">Ready for clarity?</h2>
          <p className="text-lg text-indigo-300 mb-10">Get matched with a specialist today. Your case, reviewed by an expert, in 48 hours.</p>
          <Link to="/signin?role=patient" className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            Request Second Opinion <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}