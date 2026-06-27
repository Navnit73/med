import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Activity, ArrowLeft } from 'lucide-react';
import { patientApi } from '../../api/patient';

export default function Checkout() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might fetch the specific doctor details by ID
    // For now, let's fetch all doctors and find the one that matches
    const fetchDoctorDetails = async () => {
      try {
        const data = await patientApi.getDoctors();
        const found = (data.doctors || []).find(d => d.doctor_id === doctorId);
        
        if (found) {
          setDoctor(found);
        } else {
          // Mock fallback
          setDoctor({
            doctor_id: doctorId,
            name: 'Dr. Sarah Jenkins',
            specialty: 'Cardiologist',
            hospital: 'Apollo Medical Center',
            exp: '15 years',
            rating: 98
          });
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setDoctor({
          doctor_id: doctorId,
          name: 'Dr. Sarah Jenkins',
          specialty: 'Cardiologist',
          hospital: 'Apollo Medical Center'
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
              <span className="font-semibold text-slate-900">₹800</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
              <span className="font-semibold text-slate-900">₹50</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes (18% GST)</span>
              <span className="font-semibold text-slate-900">₹153</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100 font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-sky-600 text-lg">₹1,003</span>
            </div>
          </div>

          <button 
            onClick={() => {
              const intentId = localStorage.getItem('current_intent_id');
              alert(`Paid ₹1,003 and booked ${doctor?.name} for intent ${intentId || 'none'}!`);
              navigate('/patient');
            }}
            className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 active:scale-95 transition-all shadow-sm flex justify-center items-center gap-2 text-sm"
          >
            Pay Now
          </button>
        </div>
      </main>
    </div>
  );
}
