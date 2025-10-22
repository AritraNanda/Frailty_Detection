import api from './api';

export const patientService = {
  getAllPatients: () => {
    return api.get('/patients');
  },

  getPatient: (id) => {
    return api.get(`/patients/${id}`);
  },

  createPatient: (patientData) => {
    return api.post('/patients', patientData);
  },

  updatePatient: (id, patientData) => {
    return api.put(`/patients/${id}`, patientData);
  },

  deletePatient: (id) => {
    return api.delete(`/patients/${id}`);
  },

  searchPatients: (searchTerm) => {
    return api.get(`/patients/search?q=${encodeURIComponent(searchTerm)}`);
  },

  getRecentPatients: (doctorId) => {
    return api.get(`/patients/recent/${doctorId}`);
  },

  getDashboardStats: (doctorId) => {
    return api.get(`/patients/stats/${doctorId}`);
  }
};