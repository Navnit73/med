import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { NavButtons } from './SharedComponents';
import api from '../../../api/axios';

export default function DoctorSelection({ consultType, setConsultType, selectedDoctors, toggleDoctor, onNext, onBack }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/public/doctors?page=1&page_size=40');
        const data = response.data;
        if (data.doctors) {
          const mapped = data.doctors.map(d => ({
            id: d.doctor_id,
            name: d.name,
            specialty: d.speciality || 'Specialist',
            rating: d.average_rating || '5.0',
            experience: d.experience_years ? `${d.experience_years} yrs` : 'N/A',
            fee: d.online_consultation_fee || 1500
          }));
          setDoctors(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="p-5 sm:p-7">
      <h2 className="text-xl font-extrabold text-slate-900">Choose Doctor(s)</h2>
      <p className="text-xs text-slate-400 mt-0.5 mb-4">One specialist or a panel — your call</p>

      {/* Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        {[
          { val: 'single',   label: 'Single Expert' },
          { val: 'multiple', label: 'Panel (Multiple)' },
        ].map(({ val, label }) => (
          <button key={val}
            onClick={() => setConsultType(val)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              consultType === val ? 'bg-white shadow text-sky-800' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {!consultType && (
        <p className="text-xs text-center text-slate-400 mb-3">Select single or panel above to get started</p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {doctors.map(doc => {
            const active = !!selectedDoctors.find(d => d.id === doc.id);
            const initials = doc.name.trim() ? doc.name.split(' ').slice(-1)[0][0] : 'D';
            return (
              <button key={doc.id}
              onClick={() => consultType && toggleDoctor(doc)}
              disabled={!consultType}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                !consultType ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50' :
                active ? 'border-sky-500 bg-sky-50/60' : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${active ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800'}`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                <p className="text-xs text-slate-500">{doc.specialty} · {doc.experience}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star size={11} fill="currentColor" /> {doc.rating}
                </div>
                <p className="text-xs font-bold text-sky-700">₹{doc.fee}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ml-1 ${active ? 'border-sky-600 bg-sky-600' : 'border-slate-300'}`}>
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedDoctors.length > 0 && (
        <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 flex justify-between items-center">
          <span className="text-xs text-sky-800 font-semibold">
            {selectedDoctors.length} doctor{selectedDoctors.length > 1 ? 's' : ''} selected
          </span>
          <span className="text-sm font-extrabold text-sky-800">₹{selectedDoctors.reduce((sum, d) => sum + (d.fee || 1500), 0) + 150}</span>
        </div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={selectedDoctors.length === 0}
      />
    </div>
  );
}
