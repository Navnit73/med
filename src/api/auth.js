import api from './axios';

export const authApi = {
  sendOtp: async (phone_number, country_code, role) => {
    const response = await api.post('/auth/send-otp', {
      phone_number,
      country_code,
      role
    });
    return response.data;
  },

  verifyOtp: async (phone_number, country_code, otp_code, role) => {
    const response = await api.post('/auth/verify-otp', {
      phone_number,
      country_code,
      otp_code,
      role
    });
    return response.data;
  }
};
