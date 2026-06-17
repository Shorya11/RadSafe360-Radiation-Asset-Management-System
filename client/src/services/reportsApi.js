import { apiClient } from './api'

export const reportsApi = {
  getAll: () => apiClient.get('/api/reports'),

  create: (formData) =>
    apiClient.post('/api/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id) =>
    apiClient.delete(`/api/reports/${id}`),
}