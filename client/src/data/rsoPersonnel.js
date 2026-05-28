/** @typedef {'Valid' | 'Expired'} PersonnelStatus */

/**
 * @typedef {Object} Personnel
 * @property {string} employeeId
 * @property {string} name
 * @property {string} department
 * @property {string} phone
 * @property {string} email
 * @property {string} caseFileNumber
 * @property {string} documentNumber
 * @property {string} dateOfIssue
 * @property {string} validTill
 * @property {PersonnelStatus} status
 * @property {string} certificateName
 */

export const PERSONNEL_STATUSES = ['Valid', 'Expired']

export const PERSONNEL_DEPARTMENTS = [
  'Radiation Safety',
  'SMS-II',
  'SMS-III',
  'Coke Oven',
  'Blast Furnace',
  'Plate Mill',
  'Utility',
]

export const RSO_PERSONNEL = [
  {
    employeeId: 'EMP-RSO-1001',
    name: 'Prasanta Kumar Mishra',
    department: 'Radiation Safety',
    phone: '+91-9876543201',
    email: 'prasanta.mishra@industrialops.com',
    caseFileNumber: 'CF-RSO-2024-011',
    documentNumber: 'DOC-AERB-RSO-1101',
    dateOfIssue: '2024-01-10',
    validTill: '2027-01-09',
    status: 'Valid',
    certificateName: 'rso-cert-prasanta.pdf',
  },
  {
    employeeId: 'EMP-RSO-1002',
    name: 'Lalit Goyal',
    department: 'SMS-II',
    phone: '+91-9876543202',
    email: 'lalit.goyal@industrialops.com',
    caseFileNumber: 'CF-RSO-2023-019',
    documentNumber: 'DOC-AERB-RSO-1133',
    dateOfIssue: '2023-06-15',
    validTill: '2026-06-14',
    status: 'Valid',
    certificateName: 'rso-cert-lalit.pdf',
  },
  {
    employeeId: 'EMP-RSO-1003',
    name: 'Nikhilesh Gawhade',
    department: 'SMS-III',
    phone: '+91-9876543203',
    email: 'nikhilesh.gawhade@industrialops.com',
    caseFileNumber: 'CF-RSO-2022-031',
    documentNumber: 'DOC-AERB-RSO-1087',
    dateOfIssue: '2022-09-01',
    validTill: '2026-06-12',
    status: 'Valid',
    certificateName: 'rso-cert-nikhilesh.pdf',
  },
  {
    employeeId: 'EMP-RSO-1004',
    name: 'Ritesh Rai',
    department: 'Coke Oven',
    phone: '+91-9876543204',
    email: 'ritesh.rai@industrialops.com',
    caseFileNumber: 'CF-RSO-2021-007',
    documentNumber: 'DOC-AERB-RSO-1016',
    dateOfIssue: '2021-03-25',
    validTill: '2025-03-24',
    status: 'Expired',
    certificateName: 'rso-cert-ritesh.pdf',
  },
]
