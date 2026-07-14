import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Activity, ArrowLeft } from 'lucide-react';
import { patientApi } from '../../api/patient';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const { patientData } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // In a real app, we might fetch the specific doctor details by ID
    // For now, let's fetch all doctors and find the one that matches
    const fetchDoctorDetails = async () => {
      try {
        const data = await patientApi.getDoctors();
        const found = (data.doctors || []).find(d => String(d.doctor_id) === String(doctorId));
        
        if (found) {
          setDoctor({
            doctor_id: found.doctor_id,
            name: found.name,
            specialty: found.speciality || 'Specialist',
            hospital: found.hospital_name || 'Apollo Medical Center',
            fee: found.online_consultation_fee || 800
          });
        } else {
          // Mock fallback
          setDoctor({
            doctor_id: doctorId,
            name: 'Dr. Sarah Jenkins',
            specialty: 'Cardiologist',
            hospital: 'Apollo Medical Center',
            fee: 800
          });
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setDoctor({
          doctor_id: doctorId,
          name: 'Dr. Sarah Jenkins',
          specialty: 'Cardiologist',
          hospital: 'Apollo Medical Center',
          fee: 800
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6 flex justify-center items-center h-64">
          <p className="text-slate-500 font-medium">Loading checkout...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/patient/select-doctor')} 
            className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600 transition-colors mb-4 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to Doctors
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
            Confirm Booking
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-extrabold shrink-0 ring-1 ring-sky-200">
              {doctor?.name?.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{doctor?.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Activity size={12}/> {doctor?.specialty}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {doctor?.hospital}</p>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 mb-4 text-sm">Price Breakdown</h3>
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Consultation Fee</span>
              <span className="font-semibold text-slate-900">₹{doctor?.fee || 800}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
              <span className="font-semibold text-slate-900">₹50</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes (18% GST)</span>
              <span className="font-semibold text-slate-900">₹{Math.round(((doctor?.fee || 800) + 50) * 0.18)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100 font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-sky-600 text-lg">₹{(doctor?.fee || 800) + 50 + Math.round(((doctor?.fee || 800) + 50) * 0.18)}</span>
            </div>
          </div>

          <button 
            onClick={async () => {
              setPaymentLoading(true);
              try {
                const intentIdStr = localStorage.getItem('current_intent_id');
                const intentId = intentIdStr ? parseInt(intentIdStr, 10) : 0;

                // Book appointment first
                await api.post('/appointment/patient/book', {
                  intent_id: intentId,
                  doctors: [{ doctor_id: parseInt(doctorId, 10), consultation_type: "Video" }]
                });

                // Create order
                const orderRes = await api.post('/payment/create-order', { intent_id: intentId });
                const { amount, currency, razorpay_order_id, razorpay_key_id } = orderRes.data;

                // Load Razorpay script
                const scriptLoaded = await new Promise((resolve) => {
                  if (window.Razorpay) return resolve(true);
                  const script = document.createElement('script');
                  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                  script.onload = () => resolve(true);
                  script.onerror = () => resolve(false);
                  document.body.appendChild(script);
                });

                if (!scriptLoaded) {
                  alert('Failed to load payment gateway.');
                  setPaymentLoading(false);
                  return;
                }

                // Open Razorpay checkout
                const options = {
                  key: razorpay_key_id,
                  amount: amount,
                  currency: currency,
                  name: 'Med Experts',
                  description: 'Expert Second Opinion',
                  order_id: razorpay_order_id,
                  handler: function (response) {
                    alert(`Paid successfully and booked ${doctor?.name}!`);
                    navigate('/patient');
                    setPaymentLoading(false);
                  },
                  prefill: {
                    name: patientData?.first_name ? `${patientData.first_name} ${patientData.last_name || ''}`.trim() : '',
                    email: patientData?.email || '',
                    contact: patientData?.phone_number || patientData?.phone || ''
                  },
                  theme: { color: '#0284c7' }, // sky-600
                  modal: {
                    ondismiss: function () {
                      setPaymentLoading(false);
                    }
                  }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.on('payment.failed', function (response) {
                  console.error(response.error);
                  alert('Payment failed. Please try again.');
                  setPaymentLoading(false);
                });
                paymentObject.open();

              } catch (err) {
                console.error('Payment API Error:', err);
                alert(err.response?.data?.detail || 'Payment failed. Please try again.');
                setPaymentLoading(false);
              }
            }}
            disabled={paymentLoading}
            className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 active:scale-95 transition-all shadow-sm flex justify-center items-center gap-2 text-sm disabled:opacity-50"
          >
            {paymentLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing…
              </span>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
