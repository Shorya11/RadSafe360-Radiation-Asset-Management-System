import { apiClient } from './api'

export const trainingManualsApi = {
  getAll: () => apiClient.get('/api/training-manuals'),

  create: (data) =>
    apiClient.post('/api/training-manuals', data),

  delete: (id) =>
    apiClient.delete(`/api/training-manuals/${id}`),
}