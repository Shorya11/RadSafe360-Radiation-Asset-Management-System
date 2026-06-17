import { apiRequest, unwrapData } from './api'

export const surveyMetersApi = {
  getAll() {
    return apiRequest({ method: 'GET', url: '/api/survey-meters' }).then(unwrapData)
  },
  getById(id) {
    return apiRequest({ method: 'GET', url: `/api/survey-meters/${id}` }).then(unwrapData)
  },
  create(payload) {
    return apiRequest({ method: 'POST', url: '/api/survey-meters', data: payload }).then(unwrapData)
  },
  update(id, payload) {
    return apiRequest({ method: 'PUT', url: `/api/survey-meters/${id}`, data: payload }).then(
      unwrapData,
    )
  },
  remove(id) {
    return apiRequest({ method: 'DELETE', url: `/api/survey-meters/${id}` })
  },
  uploadDocument(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest({
      method: 'POST',
      url: `/api/survey-meters/${id}/documents`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrapData)
  },
}
