import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Activity, Loader2, ArrowLeft } from 'lucide-react';
import { patientApi } from '../../api/patient';

export default function SelectDoctor() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await patientApi.getDoctors();
      if (data.doctors) {
        setDoctors(data.doctors.map(d => ({
          doctor_id: d.doctor_id,
          name: d.name,
          specialty: d.speciality || 'Specialist',
          hospital: d.hospital_name || 'Medical Center',
          exp: d.experience_years ? `${d.experience_years} years` : 'N/A',
          rating: d.average_rating ? parseFloat(d.average_rating) * 20 : 98, // assuming rating is out of 5, multiply by 20 for %
          reviews: d.total_reviews || 120
        })));
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (doctor) => {
    navigate(`/patient/checkout/${doctor.doctor_id || 'd1'}`);
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <section>
            <p className="text-xs font-semibold text-sky-700 uppercase tracking-widest mb-1">Second Opinion</p>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Select a Specialist
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose a doctor for your second opinion.
            </p>
          </section>
          <button 
            onClick={() => navigate('/patient')} 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors, specialties..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm text-sm"
          />
        </div>

      <div className="w-full">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading specialists...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center min-h-[300px] flex flex-col justify-center items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <p className="text-slate-800 font-bold mb-1">Oops!</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button onClick={fetchDoctors} className="mt-4 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg font-semibold hover:bg-sky-100 transition-colors">Try Again</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <button 
                  key={doc.doctor_id || index} 
                  onClick={() => handleBook(doc)}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-sm hover:border-slate-300 flex items-center gap-4 text-left group transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex-shrink-0 flex items-center justify-center text-lg font-extrabold ring-1 ring-sky-200">
                    {doc.name?.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0,2)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{doc.name}</p>
                    <p className="text-xs text-slate-400 leading-snug line-clamp-1">{doc.specialty} • {doc.hospital}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Star size={10} className="fill-amber-500"/> {doc.rating}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{doc.exp}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pl-2">
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg group-hover:bg-sky-100 transition-colors">
                      Select
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
                No doctors found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
