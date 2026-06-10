import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Activity, ArrowLeft, CheckCircle2, Shield, Clock, Star, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
  { code: 'IN', name: 'India',          dial: '+91',  flag: '🇮🇳', maxLen: 10 },
  { code: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸', maxLen: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧', maxLen: 10 },
  { code: 'AE', name: 'UAE',            dial: '+971', flag: '🇦🇪', maxLen: 9  },
  { code: 'SG', name: 'Singapore',      dial: '+65',  flag: '🇸🇬', maxLen: 8  },
  { code: 'AU', name: 'Australia',      dial: '+61',  flag: '🇦🇺', maxLen: 9  },
  { code: 'CA', name: 'Canada',         dial: '+1',   flag: '🇨🇦', maxLen: 10 },
  { code: 'DE', name: 'Germany',        dial: '+49',  flag: '🇩🇪', maxLen: 11 },
  { code: 'FR', name: 'France',         dial: '+33',  flag: '🇫🇷', maxLen: 9  },
  { code: 'JP', name: 'Japan',          dial: '+81',  flag: '🇯🇵', maxLen: 10 },
  { code: 'CN', name: 'China',          dial: '+86',  flag: '🇨🇳', maxLen: 11 },
  { code: 'BR', name: 'Brazil',         dial: '+55',  flag: '🇧🇷', maxLen: 11 },
  { code: 'ZA', name: 'South Africa',   dial: '+27',  flag: '🇿🇦', maxLen: 9  },
  { code: 'NG', name: 'Nigeria',        dial: '+234', flag: '🇳🇬', maxLen: 10 },
  { code: 'PK', name: 'Pakistan',       dial: '+92',  flag: '🇵🇰', maxLen: 10 },
  { code: 'BD', name: 'Bangladesh',     dial: '+880', flag: '🇧🇩', maxLen: 10 },
  { code: 'NZ', name: 'New Zealand',    dial: '+64',  flag: '🇳🇿', maxLen: 9  },
  { code: 'IT', name: 'Italy',          dial: '+39',  flag: '🇮🇹', maxLen: 10 },
  { code: 'ES', name: 'Spain',          dial: '+34',  flag: '🇪🇸', maxLen: 9  },
  { code: 'MX', name: 'Mexico',         dial: '+52',  flag: '🇲🇽', maxLen: 10 },
];

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

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dial.includes(countrySearch)
  );

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setCountrySearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const r = searchParams.get('role') === 'patient' ? 'patient' : 'admin';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(r);
    setPhoneNumber('');
    setOtpSent(false);
    setOtp('');
    setError('');
  }, [searchParams]);

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length <= selectedCountry.maxLen) {
      setPhoneNumber(digits);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    setDropdownOpen(false);
    setCountrySearch('');
    setOtpSent(false);
    setError('');
  };

  const handleGetOtp = () => {
    if (phoneNumber.length < selectedCountry.maxLen) {
      setError(`Please enter a valid ${selectedCountry.maxLen}-digit number for ${selectedCountry.name}`);
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    login(role);
    navigate(role === 'patient' ? '/patient' : '/admin');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Left: form ── */}
      <div className="w-full lg:w-[480px] xl:w-[520px] bg-white flex flex-col shrink-0 shadow-[1px_0_0_#f1f5f9]">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2DB37D] rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">
              Med<span className="text-[#2DB37D]">Expert</span>
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#2DB37D] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>

        {/* Form body */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-12">
          <div className="max-w-sm mx-auto w-full">

            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
              {role === 'patient' ? 'Sign in / Register' : 'Admin sign in'}
            </h1>
            <p className="text-sm text-slate-500 mb-7">
              {role === 'patient'
                ? 'Your health journey starts here. Enter your phone number to continue.'
                : 'Enter your credentials to access the admin panel.'}
            </p>

            {/* Role toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-7">
              {['patient', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setOtpSent(false); setError(''); setPhoneNumber(''); setOtp(''); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                    role === r
                      ? 'bg-white text-[#2DB37D] shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r === 'patient' ? 'Patient' : 'Admin'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              {error && (
                <div className="p-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {error}
                </div>
              )}

              {/* Phone field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Mobile number
                </label>
                <div className="flex gap-2">

                  {/* Country selector */}
                  <div ref={dropdownRef} className="relative shrink-0">
                    <button
                      type="button"
                      disabled={otpSent}
                      onClick={() => { if (!otpSent) setDropdownOpen(v => !v); }}
                      className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#2DB37D] hover:bg-[#f0faf5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[90px]"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <span className="text-xs font-mono">{selectedCountry.dial}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              placeholder="Search country or dial code…"
                              value={countrySearch}
                              onChange={e => setCountrySearch(e.target.value)}
                              className="text-xs bg-transparent outline-none w-full text-slate-700 placeholder-slate-400"
                              autoFocus
                            />
                          </div>
                        </div>
                        <ul className="max-h-60 overflow-y-auto py-1">
                          {filteredCountries.length > 0 ? filteredCountries.map(c => (
                            <li key={c.code}>
                              <button
                                type="button"
                                onClick={() => handleCountrySelect(c)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0faf5] transition-colors ${
                                  selectedCountry.code === c.code ? 'bg-[#edf9f4]' : ''
                                }`}
                              >
                                <span className="text-base leading-none shrink-0">{c.flag}</span>
                                <span className="text-sm text-slate-700 flex-1 font-medium text-left">{c.name}</span>
                                <span className="text-xs text-slate-400 font-mono shrink-0">{c.dial}</span>
                                {selectedCountry.code === c.code && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DB37D] shrink-0" />
                                )}
                              </button>
                            </li>
                          )) : (
                            <li className="px-4 py-5 text-xs text-slate-400 text-center">No countries found</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Number input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 pr-16 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-all placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                      placeholder={`${selectedCountry.maxLen}-digit number`}
                      required
                      disabled={otpSent}
                      maxLength={selectedCountry.maxLen}
                      inputMode="numeric"
                    />
                    {phoneNumber.length > 0 && !otpSent && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold tabular-nums pointer-events-none ${
                        phoneNumber.length === selectedCountry.maxLen ? 'text-[#2DB37D]' : 'text-slate-400'
                      }`}>
                        {phoneNumber.length}/{selectedCountry.maxLen}
                      </span>
                    )}
                  </div>
                </div>

                {!otpSent && (
                  <p className="text-[11px] text-slate-400 mt-1.5 ml-0.5">
                    {selectedCountry.name} · {selectedCountry.maxLen}-digit mobile number required
                  </p>
                )}
              </div>

              {/* OTP field */}
              {otpSent && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Enter OTP</label>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                      className="text-xs font-semibold text-[#2DB37D] hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-all tracking-[0.4em] placeholder-slate-400"
                      placeholder="• • • • • •"
                      required
                      maxLength={6}
                      inputMode="numeric"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2DB37D] hover:text-[#24a06e] bg-white px-2 py-1 rounded"
                    >
                      Resend
                    </button>
                  </div>
                  <p className="text-xs text-[#2DB37D] mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    OTP sent to {selectedCountry.dial} {phoneNumber}
                  </p>
                </div>
              )}

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={phoneNumber.length < selectedCountry.maxLen}
                  className="w-full py-3 bg-[#2DB37D] hover:bg-[#24a06e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  Send OTP
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2DB37D] hover:bg-[#24a06e] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  Verify & Sign in
                </button>
              )}
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-[#2DB37D] hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-[#2DB37D] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Trust strip */}
        <div className="px-8 md:px-14 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 pt-5 border-t border-slate-100">
            {[
              { icon: Shield,       label: 'HIPAA Secure'     },
              { icon: CheckCircle2, label: 'Verified Doctors' },
              { icon: Clock,        label: '48h Response'     },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Icon className="w-3.5 h-3.5 text-[#2DB37D]" /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: info panel ── */}
      <div className="hidden lg:flex flex-1 bg-[#f0faf5] items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2DB37D]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2DB37D]/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-md relative z-10">
          <div className="w-14 h-14 bg-[#2DB37D] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#2DB37D]/25">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-snug mb-4">
            A second opinion from a world-class specialist — in 48 hours.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-10">
            Join 50,000+ patients who turned to MedExpert for clear, expert-backed answers when it mattered most.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { value: '12K+', label: 'Specialists'  },
              { value: '98%',  label: 'Satisfaction' },
              { value: '500+', label: 'Hospitals'    },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-[#2DB37D]/15 text-center shadow-sm">
                <p className="text-xl font-extrabold text-[#2DB37D]">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2DB37D]/15 shadow-sm">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#2DB37D] text-[#2DB37D]" />
              ))}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4 italic">
              "MedExpert connected me with a leading oncologist within two days. The clarity I received changed my treatment path entirely."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#edf9f4] flex items-center justify-center text-[#2DB37D] text-xs font-bold">R</div>
              <div>
                <p className="text-xs font-bold text-slate-800">Rachel M.</p>
                <p className="text-[11px] text-slate-400">Patient, Boston</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}