import {
  ShieldCheck, Clock, FileText, Globe, HeartPulse, Brain,
  Bone, Baby, Sun, Microscope, Scissors, ArrowRight,
  CheckCircle2, Activity, Shield, Users, Stethoscope, ChevronRight,
  FileCheck2, Building2, Star, Search, MapPin, Video
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-16 font-sans bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[#f0faf5] to-white pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              Your health, our priority
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
              Find doctors, book appointments and get expert second opinions — all in one place.
            </p>

            {/* Search box Practo-style */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-slate-100 flex flex-col sm:flex-row overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties..."
                  className="text-sm text-slate-700 bg-transparent outline-none w-full placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="text-sm text-slate-700 bg-transparent outline-none w-full placeholder-slate-400"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2DB37D] hover:bg-[#24a06e] text-white text-sm font-semibold transition-colors">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic'].map(s => (
                <Link
                  key={s}
                  to="/find-doctors"
                  className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:border-[#2DB37D] hover:text-[#2DB37D] transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Feature cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { icon: Video,       label: 'Video Consult',    sub: 'Instant appointment',  color: 'bg-purple-50', iconColor: 'text-purple-500' },
              { icon: Building2,   label: 'Find a Hospital',  sub: 'Near you',             color: 'bg-blue-50',   iconColor: 'text-blue-500'   },
              { icon: Stethoscope, label: 'Find a Doctor',    sub: 'All specialities',     color: 'bg-[#edf9f4]', iconColor: 'text-[#2DB37D]'  },
              { icon: FileText,    label: 'Second Opinion',   sub: 'Expert review',        color: 'bg-amber-50',  iconColor: 'text-amber-500'  },
            ].map((f, i) => (
              <Link to="/find-doctors" key={i} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group flex flex-col items-center text-center gap-3 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{f.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-[#2DB37D] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+',  label: 'Partner Hospitals'   },
              { value: '12K+',  label: 'Verified Specialists' },
              { value: '98%',   label: 'Patient Satisfaction' },
              { value: '48h',   label: 'Average Response'     },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl lg:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-green-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Browse by specialty</h2>
              <p className="text-slate-500 text-sm">Our network covers 40+ specialties</p>
            </div>
            <Link to="/find-doctors" className="text-[#2DB37D] font-semibold hover:underline flex items-center gap-1 text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { name: 'Cardiology',      icon: HeartPulse  },
              { name: 'Oncology',        icon: Activity    },
              { name: 'Neurology',       icon: Brain       },
              { name: 'Orthopedics',     icon: Bone        },
              { name: 'Pediatrics',      icon: Baby        },
              { name: 'Dermatology',     icon: Sun         },
              { name: 'Radiology',       icon: Microscope  },
              { name: 'Gen Surgery',     icon: Scissors    },
            ].map((s, i) => (
              <Link to="/find-doctors" key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:border-[#2DB37D] hover:bg-[#f0faf5] cursor-pointer transition-all group text-center">
                <div className="w-11 h-11 rounded-full bg-[#edf9f4] group-hover:bg-[#2DB37D] flex items-center justify-center transition-colors">
                  <s.icon className="w-5 h-5 text-[#2DB37D] group-hover:text-white transition-colors" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 leading-tight">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Why patients choose MedExpert</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">Speed, expertise, and trust — built into every consultation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Stethoscope, title: 'Top Specialists',   desc: 'Board-certified experts across 40+ specialties, vetted by our medical board.',     color: 'text-[#2DB37D]', bg: 'bg-[#edf9f4]' },
              { icon: ShieldCheck,  title: 'HIPAA Secure',      desc: 'End-to-end encrypted records and consultations. Your privacy is non-negotiable.',  color: 'text-blue-600',  bg: 'bg-blue-50'    },
              { icon: Clock,        title: 'Fast Turnaround',   desc: 'Written second opinion delivered within 48 hours of submission.',                  color: 'text-purple-600',bg: 'bg-purple-50'  },
              { icon: FileText,     title: 'Evidence-Based',    desc: 'Every opinion includes citations to current clinical literature and guidelines.',   color: 'text-amber-600', bg: 'bg-amber-50'   },
              { icon: Globe,        title: 'Global Network',    desc: 'Partnered with leading hospitals across North America, Europe, and Asia.',          color: 'text-rose-600',  bg: 'bg-rose-50'    },
              { icon: HeartPulse,   title: 'Care Coordination', desc: 'Dedicated patient advocate to help navigate next steps after your opinion.',       color: 'text-cyan-600',  bg: 'bg-cyan-50'    },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#2DB37D]/30 hover:shadow-sm transition-all group">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">How it works</h2>
            <p className="text-slate-500 text-sm">Three simple steps to a trusted second opinion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px border-t-2 border-dashed border-[#2DB37D]/30" />
            {[
              { step: '01', title: 'Share your case',      desc: 'Upload your medical records, scans, and lab results securely.' },
              { step: '02', title: 'Match a specialist',   desc: 'We match you with the right expert based on your condition.'    },
              { step: '03', title: 'Receive your opinion', desc: 'Get a comprehensive written report and optional video consult.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#edf9f4] border-2 border-[#2DB37D] flex items-center justify-center text-xl font-extrabold text-[#2DB37D] mb-5">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-[#f0faf5] border-y border-[#2DB37D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Patients trust MedExpert</h2>
            <p className="text-slate-500 text-sm">Real stories from people who found clarity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { text: "MedExpert connected me with a leading oncologist within two days. The clarity I received changed my treatment path entirely.", name: "Rachel M.",  title: "Patient, Boston"        },
              { text: "The specialist's report was thorough, referenced, and easy to share with my local physician. Worth every minute.",            name: "David K.",   title: "Patient, Toronto"       },
              { text: "Having a second perspective from a top cardiologist gave my family the confidence to move forward with surgery.",             name: "Priya S.",   title: "Patient, San Francisco" },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#2DB37D]/10 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#2DB37D] text-[#2DB37D]" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#edf9f4] flex items-center justify-center text-[#2DB37D] font-bold text-sm">
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
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-[#2DB37D] rounded-3xl p-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">Ready for clarity?</h2>
            <p className="text-green-100 mb-8 text-sm leading-relaxed">Get matched with a specialist today. Your case, reviewed by an expert, in 48 hours.</p>
            <Link
              to="/signin?role=patient"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-[#2DB37D] bg-white hover:bg-green-50 rounded-xl shadow-md transition-all"
            >
              Request Second Opinion <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}