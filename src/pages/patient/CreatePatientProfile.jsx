import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2, ChevronDown } from "lucide-react";
import { patientApi } from "../../api/patient";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CreatePatientProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", dob: "", gender: "", 
    blood_group: "", city: "", state: "", pincode: "", age: ""
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, age: Number(formData.age) };
      const newPatientData = await patientApi.createPatient(payload);
      if (newPatientData && newPatientData.patient_id) {
        navigate(`/patient/${newPatientData.patient_id}/dashboard`);
      } else {
        navigate('/patient');
      }
    } catch (error) {
      console.error("Failed to register patient", error);
      setIsSubmitting(false);
    } 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-8 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => navigate('/patient')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={24} />
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">Register Patient</h1>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">First Name</label>
                  <input required name="first_name" value={formData.first_name} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input required name="last_name" value={formData.last_name} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Date of Birth</label>
                  <input type="date" required name="dob" value={formData.dob} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Age</label>
                  <input type="number" required name="age" value={formData.age} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="e.g. 30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Gender</label>
                  <div className="relative">
                    <select required name="gender" value={formData.gender} onChange={handleRegisterChange} className="w-full p-3 pr-10 appearance-none rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none">
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Blood Group</label>
                  <div className="relative">
                    <select required name="blood_group" value={formData.blood_group} onChange={handleRegisterChange} className="w-full p-3 pr-10 appearance-none rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none">
                      <option value="" disabled>Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">City</label>
                <input required name="city" value={formData.city} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="City name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">State</label>
                  <div className="relative">
                    <select required name="state" value={formData.state} onChange={handleRegisterChange} className="w-full p-3 pr-10 appearance-none rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none">
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Pincode</label>
                  <input required name="pincode" value={formData.pincode} onChange={handleRegisterChange} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm outline-none" placeholder="Zip code" />
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-3.5 bg-sky-600 disabled:bg-sky-400 text-white font-bold rounded-xl mt-6 hover:bg-sky-700 shadow-sm transition-colors flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Patient"}
              </button>
          </form>
        </div>
      </main>
    </div>
  );
}
