import api from './axios';

export const patientApi = {
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  }
};
