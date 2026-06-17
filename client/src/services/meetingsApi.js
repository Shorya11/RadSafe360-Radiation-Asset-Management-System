import { apiRequest, unwrapData } from './api'

export const meetingsApi = {
  getAll() {
    return apiRequest({ method: 'GET', url: '/api/meetings' }).then(unwrapData)
  },
  getById(id) {
    return apiRequest({ method: 'GET', url: `/api/meetings/${id}` }).then(unwrapData)
  },
  create(payload) {
    return apiRequest({ method: 'POST', url: '/api/meetings', data: payload }).then(unwrapData)
  },
  update(id, payload) {
    return apiRequest({ method: 'PUT', url: `/api/meetings/${id}`, data: payload }).then(unwrapData)
  },
  remove(id) {
    return apiRequest({ method: 'DELETE', url: `/api/meetings/${id}` })
  },
  addParticipant(meetingId, participant) {
    return apiRequest({
      method: 'POST',
      url: `/api/meetings/${meetingId}/participants`,
      data: participant,
    }).then(unwrapData)
  },
  removeParticipant(attendanceId) {
    return apiRequest({
      method: 'DELETE',
      url: `/api/meetings/participants/${attendanceId}`,
    })
  },
  addActionItem(meetingId, payload) {
    return apiRequest({
      method: 'POST',
      url: `/api/meetings/${meetingId}/action-items`,
      data: payload,
    }).then(unwrapData)
  },
  updateActionItem(itemId, payload) {
    return apiRequest({
      method: 'PUT',
      url: `/api/meetings/action-items/${itemId}`,
      data: payload,
    }).then(unwrapData)
  },
  deleteActionItem(itemId) {
    return apiRequest({ method: 'DELETE', url: `/api/meetings/action-items/${itemId}` })
  },
}
