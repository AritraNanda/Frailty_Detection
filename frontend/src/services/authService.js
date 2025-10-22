import api from './api';

export const authService = {
  login: (employeeId) => {
    return api.post('/auth/login', { employeeId });
  },

  verifyToken: (token) => {
    return api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};