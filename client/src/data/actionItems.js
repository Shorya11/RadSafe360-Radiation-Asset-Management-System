/**
 * @typedef {Object} MomActionItem
 * @property {string} id
 * @property {string} meetingId
 * @property {number} serialNo
 * @property {string} [task]
 * @property {string} [assignedTo]
 * @property {string} [dueDate]
 * @property {'Pending' | 'In Progress' | 'Completed'} [status]
 * @property {string} [agendaItem]
 * @property {string} [actionPoints]
 * @property {string} [targetDateRaw]
 * @property {string} [workflowStatus]
 * @property {string} [ownerRaw]
 * @property {string} [remark]
 */

/** @type {MomActionItem[]} */
export const ACTION_ITEMS = [
  {
    id: 'mom-2025-05-30-1',
    meetingId: '2025-05-30',
    serialNo: 1,
    agendaItem: 'Meeting Frequency',
    actionPoints: 'Monthly',
    targetDateRaw: "Next Meeting 2'nd week of June 2025",
    workflowStatus: null,
    ownerRaw: 'Mohan Iyer',
  },
  {
    id: 'mom-2025-05-30-2',
    meetingId: '2025-05-30',
    serialNo: 2,
    agendaItem: 'SSR report for July-Dec 2024',
    actionPoints: 'To be submitted in elora',
    targetDateRaw: '15.01.2025',
    workflowStatus: 'Done',
    ownerRaw: 'Simanchal Panda',
    remark: 'Nest SSR to be uploaded in elora in July 2025.',
  },
  {
    id: 'mom-2025-05-30-3',
    meetingId: '2025-05-30',
    serialNo: 3,
    agendaItem: 'Old 9mCi 4 nos. Radioactive sources of SMS-2 to be disposed off',
    actionPoints: 'Extraction, wipe test, disposal',
    targetDateRaw: '31.03.2025',
    workflowStatus: 'NOC received for export of sources',
    ownerRaw: 'Mohan Iyer',
    remark: 'WO made for extraction & disposal. To be executed by 30.06.2025',
  },
  {
    id: 'mom-2025-05-30-4',
    meetingId: '2025-05-30',
    serialNo: 4,
    agendaItem: 'Old 4mCi 6 nos. Radioactive sources of SMS-3 to be disposed off',
    actionPoints: 'Extraction, wipe test, disposal',
    targetDateRaw: '31.03.2025',
    workflowStatus: 'NOC received for export of sources',
    ownerRaw: 'Nikhilesh & Ranjeet',
  },
  {
    id: 'mom-2025-05-30-5',
    meetingId: '2025-05-30',
    serialNo: 5,
    agendaItem: 'New Cs-137 to be procured for SMS-3 Combi caster',
    targetDateRaw: '31.03.2025',
    workflowStatus: 'Done',
    ownerRaw: 'Mr. Nikhilesh & Mr. Ranjeet',
  },
  {
    id: 'mom-2025-05-30-6',
    meetingId: '2025-05-30',
    serialNo: 6,
    agendaItem: 'TLD badges',
    actionPoints: 'Phase 1 & 2 procurement for departments',
    targetDateRaw: '30.06.2025',
    workflowStatus: 'PO made for SMS-2; SR for Sinter Plant',
    ownerRaw: 'Mandeep, Sanjay & Mr. Nikhilesh, Akhilesh',
  },
  {
    id: 'mom-2025-10-23-1',
    meetingId: '2025-10-23',
    serialNo: 1,
    agendaItem: 'Meeting Frequency',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2025-10-23-2',
    meetingId: '2025-10-23',
    serialNo: 2,
    agendaItem: 'SSR report for Jan-June 2025',
    actionPoints: 'To be submitted in elora',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2025-10-23-3',
    meetingId: '2025-10-23',
    serialNo: 3,
    agendaItem: 'New RSO registration along with finalization of license',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2026-03-17-1',
    meetingId: '2026-03-17',
    serialNo: 1,
    agendaItem: 'Meeting Frequency',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2026-03-17-2',
    meetingId: '2026-03-17',
    serialNo: 2,
    agendaItem: 'SSR report for July-Dec 2025',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2026-03-17-3',
    meetingId: '2026-03-17',
    serialNo: 3,
    agendaItem: 'New RSO registration along with finalization of license',
    ownerRaw: 'Mandeep / Nikhilesh',
  },
  {
    id: 'mom-2026-03-23-1',
    meetingId: '2026-03-23',
    serialNo: 1,
    agendaItem: 'Meeting Frequency',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2026-03-23-2',
    meetingId: '2026-03-23',
    serialNo: 2,
    agendaItem: 'SSR report for July-Dec 2025',
    ownerRaw: 'Simanchal Panda',
  },
  {
    id: 'mom-2026-03-23-3',
    meetingId: '2026-03-23',
    serialNo: 3,
    agendaItem: 'Survey Meter registration in e-LORA',
    actionPoints: 'BF, Coal Washery, Power Plant to register meters',
    targetDateRaw: '30.06.2025',
    workflowStatus: 'Addition in Elora pending',
    ownerRaw: 'Mandeep Singh Rajput, Suraj Yadav, Kanhaiya Maurya',
    remark: 'Calibration validity tracking required before upload.',
  },
]
