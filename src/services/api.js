import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Department API
export const departmentApi = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  getDepartmentWithProfessors: (id) => api.get(`/departments/${id}/professors`),
};

// Professor API
export const professorApi = {
  getAll: () => api.get('/professors'),
  getById: (id) => api.get(`/professors/${id}`),
  create: (data) => api.post('/professors', data),
  update: (id, data) => api.put(`/professors/${id}`, data),
  delete: (id) => api.delete(`/professors/${id}`),
};

export default api;
