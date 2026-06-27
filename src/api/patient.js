import api from './axios';

export const patientApi = {
  getProfile: async () => {
    const response = await api.get('/patient/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/patient/profile', data);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete('/patient/profile');
    return response.data;
  },

  hardDeleteProfile: async () => {
    const response = await api.delete('/patient/profile/hard-delete');
    return response.data;
  },

  createIntent: async (intentType = 'expert') => {
    const response = await api.post('/intent/', {
      intent_type: intentType
    });
    return response.data;
  },

  getDoctors: async () => {
    // Modify this endpoint according to the new API requirement
    const response = await api.get('/patient/doctors');
    return response.data;
  }
};
