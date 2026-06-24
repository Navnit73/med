import api from './axios';

export const doctorApi = {
  onboard: async (data) => {
    const response = await api.post('/doctor/onboard', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.patch('/doctor/profile', data);
    return response.data;
  },
  
  deleteProfile: async () => {
    const response = await api.delete('/doctor/profile/hard-delete');
    return response.data;
  }
};
