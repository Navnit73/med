import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, FileText, Globe, HeartPulse, Brain, 
  Bone, Baby, Sun, Microscope, Scissors, ArrowRight, Menu, X,
  CheckCircle2, Activity, Shield, Users, Stethoscope, ChevronRight,
  FileCheck2, Building2, UserCircle
} from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">MedExpert</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Find Doctors</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Hospitals</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Second Opinion</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</button>
              <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 active:scale-95">
                Get started
              </button>
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-white to-white"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
                <Users className="w-4 h-4" />
                Trusted by 50,000+ patients worldwide
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                A second opinion from a <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">world-class specialist</span>,<br className="hidden lg:block"/> in 48 hours.
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed">
                MedExpert connects you with leading hospitals and board-certified specialists to deliver an evidence-based second opinion you can trust.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                  Request a Second Opinion <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                  Browse Specialists
                </button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> No insurance needed</div>
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> HIPAA-compliant</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Cancel anytime</div>
              </div>
            </div>

            {/* Hero Widget */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:ml-auto perspective-1000 mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-1">Case #MX-20451</div>
                    <div className="text-xl font-bold text-slate-900">Cardiology consultation</div>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    In review
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        MC
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-500 mb-0.5">Specialist matched</div>
                        <div className="font-bold text-slate-900">Dr. M. Chen, MD</div>
                        <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <Building2 className="w-3.5 h-3.5" /> Cedar Park Medical
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <FileCheck2 className="w-5 h-5 text-blue-500 mb-2" />
                      <div className="text-sm font-medium text-slate-500">Documents</div>
                      <div className="font-bold text-slate-900">12 files uploaded</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <Clock className="w-5 h-5 text-indigo-500 mb-2" />
                      <div className="text-sm font-medium text-slate-500">Expected report</div>
                      <div className="font-bold text-slate-900">Within 36 hours</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-3">Progress</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Records</span>
                        <span className="font-medium text-slate-900">Reviewed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Imaging</span>
                        <span className="font-medium text-slate-900">Reviewed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div> Labs</span>
                        <span className="font-medium text-amber-600">In review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-slate-200/50">
            {[
              { label: 'Partner Hospitals', value: '500+' },
              { label: 'Specialists', value: '12K+' },
              { label: 'Patient Satisfaction', value: '98%' },
              { label: 'Average Response', value: '48h' },
            ].map((stat, i) => (
              <div key={i} className={`text-center ${i % 2 === 0 ? '' : 'pl-4 lg:pl-8'} ${i >= 2 ? 'pt-8 lg:pt-0' : ''}`}>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why patients choose MedExpert</h2>
            <p className="text-xl text-slate-600">A complete platform built around speed, expertise, and trust.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Top Specialists', desc: 'Board-certified experts across 40+ specialties, vetted by our medical board.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: ShieldCheck, title: 'HIPAA Secure', desc: 'End-to-end encrypted records and consultations. Your privacy is non-negotiable.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Clock, title: 'Fast Turnaround', desc: 'Written second opinion delivered within 48 hours of submission.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: FileText, title: 'Evidence-Based', desc: 'Every opinion includes citations to current clinical literature and guidelines.', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Globe, title: 'Global Network', desc: 'Partnered with leading hospitals across North America, Europe, and Asia.', color: 'text-rose-600', bg: 'bg-rose-50' },
              { icon: HeartPulse, title: 'Care Coordination', desc: 'Dedicated patient advocate to help navigate next steps after your opinion.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map((feat, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-slate-300">Three simple steps to a second opinion you can trust.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>

            {[
              { step: '1', title: 'Share your case', desc: 'Upload your medical records, scans, and lab results securely.' },
              { step: '2', title: 'Match a specialist', desc: 'We match you with the right expert based on your condition.' },
              { step: '3', title: 'Receive your opinion', desc: 'Get a comprehensive written report and optional video consult.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center pt-4">
                <div className="w-24 h-24 mx-auto bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-blue-400 mb-8 shadow-xl relative z-10">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Covering 40+ specialties</h2>
              <p className="text-xl text-slate-600">From oncology to cardiology, our specialist network spans the full scope of modern medicine.</p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors">
              View all specialists <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Cardiology', icon: HeartPulse },
              { name: 'Oncology', icon: Activity },
              { name: 'Neurology', icon: Brain },
              { name: 'Orthopedics', icon: Bone },
              { name: 'Pediatrics', icon: Baby },
              { name: 'Dermatology', icon: Sun },
              { name: 'Radiology', icon: Microscope },
              { name: 'General Surgery', icon: Scissors },
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors shrink-0">
                  <spec.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-slate-900 truncate">{spec.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Patients trust MedExpert</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "MedExpert connected me with a leading oncologist within two days. The clarity I received changed my treatment path entirely.", name: "Rachel M.", title: "Patient, Boston" },
              { text: "The specialist's report was thorough, referenced, and easy to share with my local physician. Worth every minute.", name: "David K.", title: "Patient, Toronto" },
              { text: "Having a second perspective from a top cardiologist gave my family the confidence to move forward with surgery.", name: "Priya S.", title: "Patient, San Francisco" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
                <div className="text-blue-500 mb-6 flex">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-lg mb-8 flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-indigo-700"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready for clarity?</h2>
          <p className="text-xl text-blue-100 mb-10">Get matched with a specialist today. Your case, reviewed by an expert, in 48 hours.</p>
          <button className="px-8 py-4 text-lg font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            Request Second Opinion
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">MedExpert</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Trusted second opinions from world-class specialists.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Find Doctors</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Hospitals</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Second Opinion</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">HIPAA Compliance <Shield className="w-4 h-4 text-emerald-500" /></a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center md:text-left text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 MedExpert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
