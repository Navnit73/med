import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'patient' ? 'patient' : 'admin';
  
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');

  useEffect(() => {
    const r = searchParams.get('role') === 'patient' ? 'patient' : 'admin';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(r);
    setPhoneNumber('');
    setOtpSent(false);
    setOtp('');
    setError('');
  }, [searchParams]);

  const handleGetOtp = () => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length > 10) {
      setError('');
      setOtpSent(true);
    } else if (digitsOnly.length < 10) {
      setError('Please enter at least 10 digits');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp.trim())) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    login(role);
    if (role === 'patient') {
      navigate('/patient');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">MedExpert</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h1>
          <p className="text-slate-500 mb-6">Use your phone number to sign in securely.</p>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => { setRole('patient'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'patient' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ''))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+91 7355087072"
                required
                disabled={otpSent}
              />
            </div>
            
            {otpSent && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Enter OTP</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                  />
                  <button type="button" onClick={() => setOtp('123456')} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-2">
                    Resend
                  </button>
                </div>
                <p className="text-xs text-emerald-600 mt-2">OTP sent successfully to your phone.</p>
              </div>
            )}

            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleGetOtp}
                className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Get OTP
              </button>
            ) : (
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Sign in
              </button>
            )}
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 items-center justify-center p-24 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-blue-500/50 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] bg-indigo-500/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-xl relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-10 border border-white/20">
            <Activity className="w-8 h-8 text-white" />
          </div>
          
          <blockquote className="text-4xl font-bold text-white leading-tight mb-8">
            "MedExpert gave us confidence at the most critical moment."
          </blockquote>
          
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-lg">
            Join 50,000+ patients who turned to MedExpert for clear, expert-backed medical answers.
          </p>
        </div>
      </div>
    </div>
  );
}
