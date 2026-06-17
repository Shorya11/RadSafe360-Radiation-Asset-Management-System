import { apiRequest, unwrapData } from './api'

export const eloraMembersApi = {
  getAll() {
    return apiRequest({ method: 'GET', url: '/api/elora-members' }).then(unwrapData)
  },
  create(payload) {
    return apiRequest({ method: 'POST', url: '/api/elora-members', data: payload }).then(unwrapData)
  },
  update(id, payload) {
    return apiRequest({ method: 'PUT', url: `/api/elora-members/${id}`, data: payload }).then(
      unwrapData,
    )
  },
  remove(id) {
    return apiRequest({ method: 'DELETE', url: `/api/elora-members/${id}` })
  },
}
