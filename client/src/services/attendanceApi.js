import { apiRequest, unwrapData } from './api'

export const attendanceApi = {
  updateStatus(attendanceId, status) {
    return apiRequest({
      method: 'PUT',
      url: `/api/attendance/${attendanceId}`,
      data: { status },
    }).then(unwrapData)
  },
  getStatsByMeeting(meetingId) {
    return apiRequest({ method: 'GET', url: `/api/attendance/stats/${meetingId}` }).then(unwrapData)
  },
}
