import api from './axios';

export const hospitalApi = {
  onboard: async (data) => {
    const response = await api.post('/hospital/onboard', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/hospital/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.patch('/hospital/profile', data);
    return response.data;
  },
  deleteProfile: async () => {
    const response = await api.delete('/hospital/profile');
    return response.data;
  },
  hardDeleteProfile: async () => {
    const response = await api.delete('/hospital/profile/hard-delete');
    return response.data;
  },
  addDepartments: async (data) => {
    const response = await api.post('/hospital/department/add', data);
    return response.data;
  },
  getDepartments: async () => {
    const response = await api.get('/hospital/departments');
    return response.data;
  },
  updateDepartment: async (data) => {
    const response = await api.patch('/hospital/department/update', data);
    return response.data;
  },
  removeDepartment: async (data) => {
    const response = await api.delete('/hospital/department/remove', { data });
    return response.data;
  },
  getMasterDepartments: async () => {
    const response = await api.get('/hospital/master-departments');
    return response.data;
  },
  uploadMOU: async (data) => {
    const response = await api.post('/hospital/mou/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getMOU: async () => {
    const response = await api.get('/hospital/mou/get');
    return response.data;
  },
  deleteMOU: async () => {
    const response = await api.delete('/hospital/mou/delete');
    return response.data;
  }
};

