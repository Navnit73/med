import React, { useState, useEffect } from 'react';
import { hospitalApi } from '../../api/hospital';
import { Loader2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function HospitalDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add state
  const [isAdding, setIsAdding] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editDeptName, setEditDeptName] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const data = await hospitalApi.getDepartments();
      setDepartments(Array.isArray(data) ? data : data.departments || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await hospitalApi.addDepartments([{ department_name: newDeptName.trim() }]);
      setSuccess('Department added successfully');
      setNewDeptName('');
      setIsAdding(false);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add department');
    }
  };

  const handleUpdate = async (id) => {
    if (!editDeptName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await hospitalApi.updateDepartment({
        department_id: id,
        department_name: editDeptName.trim()
      });
      setSuccess('Department updated successfully');
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update department');
    }
  };

  const initiateDelete = (dept) => {
    setDepartmentToDelete(dept);
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  const confirmDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete' || !departmentToDelete) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await hospitalApi.removeDepartment({ department_id: departmentToDelete.department_id || departmentToDelete.id });
      setSuccess('Department removed successfully');
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove department');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0284c7]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500 text-sm">Manage your hospital's departments</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] text-white rounded-lg font-medium hover:bg-[#0369a1] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isAdding && (
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <form onSubmit={handleAdd} className="flex gap-3">
              <input
                type="text"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="Department Name"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0284c7] text-white rounded-lg text-sm font-medium hover:bg-[#0369a1]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {departments.length === 0 && !isAdding ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No departments found. Add a department to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {departments.map((dept, index) => (
              <li key={dept.department_id || dept.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                {editingId === (dept.department_id || dept.id) ? (
                  <div className="flex flex-1 gap-3 mr-4 ml-8">
                    <input
                      type="text"
                      value={editDeptName}
                      onChange={(e) => setEditDeptName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 focus:border-[#0284c7]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(dept.department_id || dept.id)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm font-medium w-5">{index + 1}.</span>
                      <span className="font-medium text-slate-800 text-sm">
                        {dept.department_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(dept.department_id || dept.id);
                          setEditDeptName(dept.department_name);
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#0284c7] hover:bg-[#f0f9ff] rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => initiateDelete(dept)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Department</h3>
              <p className="text-sm text-slate-500 mb-6">
                You are about to delete the department <strong>{departmentToDelete?.department_name}</strong>.
                Please type <strong className="select-none pointer-events-none">delete</strong> to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                placeholder="Type delete"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 mb-6"
                autoFocus
                autoComplete="off"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDepartmentToDelete(null);
                    setDeleteConfirmText('');
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteConfirmText.toLowerCase() !== 'delete' || deleting}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
