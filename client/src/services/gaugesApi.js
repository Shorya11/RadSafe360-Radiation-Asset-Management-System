import { apiRequest, unwrapData } from './api'

export const gaugesApi = {
  getAll() {
    return apiRequest({ method: 'GET', url: '/api/gauges' }).then(unwrapData)
  },
  getById(id) {
    return apiRequest({ method: 'GET', url: `/api/gauges/${id}` }).then(unwrapData)
  },
  create(payload) {
    return apiRequest({ method: 'POST', url: '/api/gauges', data: payload }).then(unwrapData)
  },
  update(id, payload) {
    return apiRequest({ method: 'PUT', url: `/api/gauges/${id}`, data: payload }).then(unwrapData)
  },
  remove(id) {
    return apiRequest({ method: 'DELETE', url: `/api/gauges/${id}` })
  },
  uploadDocument(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest({
      method: 'POST',
      url: `/api/gauges/${id}/documents`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrapData)
  },
}
