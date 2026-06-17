import { apiRequest, unwrapData } from './api'

export const rsoPersonnelApi = {
  getAll() {
    return apiRequest({ method: 'GET', url: '/api/rso-personnel' }).then(unwrapData)
  },
  getById(employeeId) {
    return apiRequest({ method: 'GET', url: `/api/rso-personnel/${employeeId}` }).then(unwrapData)
  },
  create(payload) {
    return apiRequest({ method: 'POST', url: '/api/rso-personnel', data: payload }).then(unwrapData)
  },
  update(employeeId, payload) {
    return apiRequest({
      method: 'PUT',
      url: `/api/rso-personnel/${employeeId}`,
      data: payload,
    }).then(unwrapData)
  },
  remove(employeeId) {
    return apiRequest({ method: 'DELETE', url: `/api/rso-personnel/${employeeId}` })
  },
}
