import { PARTICIPANT_BY_ID } from './participants'
import { DEPARTMENT_BY_ID } from './departments'
import { ATTENDANCE_LEGACY } from './attendanceLegacy'

/** @typedef {'present' | 'absent' | 'leave' | 'resigned'} AttendanceStatus */
/** @typedef {'core' | 'certified_rso'} AttendeeGroup */

/**
 * @typedef {Object} MeetingAttendance
 * @property {string} id
 * @property {string} meetingId
 * @property {string} [participantId]
 * @property {string} name
 * @property {string} department
 * @property {string} designation
 * @property {string} phoneNumber
 * @property {string} email
 * @property {AttendanceStatus} status
 * @property {AttendeeGroup} [group]
 */

function designationFor(group) {
  return group === 'core' ? 'RSO Leadership' : 'Certified RSO'
}

function expandLegacyRecord(record) {
  const person = PARTICIPANT_BY_ID[record.participantId]
  const department = person
    ? (DEPARTMENT_BY_ID[person.departmentId]?.name ?? '')
    : ''

  return {
    ...record,
    name: person?.name ?? '',
    department,
    designation: designationFor(record.group),
    phoneNumber: person?.mobile ?? '',
    email: person?.email ?? '',
  }
}

/** @type {MeetingAttendance[]} */
export const ATTENDANCE = ATTENDANCE_LEGACY.map(expandLegacyRecord)

export function createAttendanceRecord(meetingId, participant, id) {
  return {
    id: id ?? `att-${meetingId}-${Date.now()}`,
    meetingId,
    participantId: participant.participantId,
    personnelId: participant.personnelId,
    participantSource: participant.participantSource ?? 'external',
    name: participant.name,
    department: participant.department,
    designation: participant.designation,
    phoneNumber: participant.phoneNumber,
    email: participant.email,
    status: participant.status ?? 'present',
    group: participant.group ?? 'certified_rso',
  }
}

export const EMPTY_PARTICIPANT_ROW = {
  name: '',
  department: '',
  designation: '',
  phoneNumber: '',
  email: '',
  status: 'present',
  group: 'certified_rso',
}

export function personnelToParticipant(personnel) {
  return {
    participantId: `personnel-${personnel.employeeId}`,
    personnelId: personnel.employeeId,
    participantSource: 'rso_personnel',
    name: personnel.name,
    department: personnel.department,
    designation: 'RSO Personnel',
    phoneNumber: personnel.phone,
    email: personnel.email,
    status: 'present',
    group: 'certified_rso',
  }
}
