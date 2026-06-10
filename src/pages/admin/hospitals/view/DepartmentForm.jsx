import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Building2, UserCircle, Users, Activity } from 'lucide-react';

export default function DepartmentForm({ department, onSave, onCancel }) {
  const isEdit = Boolean(department);
  
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    patients: 0,
    status: 'active',
    doctors: '', // we will parse this to array on save
  });

  useEffect(() => {
    if (department) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: department.name || '',
        head: department.head || '',
        patients: department.patients || 0,
        status: department.status || 'active',
        doctors: Array.isArray(department.doctors) ? department.doctors.join(', ') : '',
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorsArray = formData.doctors.split(',').map(d => d.trim()).filter(Boolean);
    onSave({ 
      ...formData, 
      doctors: doctorsArray,
      id: isEdit ? department.id : Date.now() 
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit Speciality' : 'Add New Speciality'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Speciality Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Cardiology"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Head of Department</label>
              <div className="relative">
                <UserCircle className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" name="head" required
                  value={formData.head} onChange={handleChange}
                  placeholder="e.g. Dr. Sarah Johnson"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-shadow"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Patients</label>
              <div className="relative">
                <Activity className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" name="patients" min="0" required
                  value={formData.patients} onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Doctors (Comma separated)</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea 
                  name="doctors" rows="4" required
                  value={formData.doctors} onChange={handleChange}
                  placeholder="e.g. Dr. John Doe, Dr. Jane Smith"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2DB37D]/30 focus:border-[#2DB37D] transition-shadow resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#2DB37D] hover:bg-[#24a06e] rounded-sm transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Add Speciality'}
          </button>
        </div>
      </form>
    </div>
  );
}
