import api from './axios';

export const authApi = {
  sendOtp: async (phone_number, role) => {
    const response = await api.post('/auth/send-otp', {
      phone_number,
      role
    });
    return response.data;
  },

  verifyOtp: async (phone_number, otp, role) => {
    const response = await api.post('/auth/verify-otp', {
      phone_number,
      otp,
      role
    });
    return response.data;
  }
};
