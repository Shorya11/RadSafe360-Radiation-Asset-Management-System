/** @typedef {Object} ReportDocument
 * @property {string} id
 * @property {string} department
 * @property {string} contactName
 * @property {string} reportType
 * @property {string} [fileName]
 * @property {string} [fileMimeType]
 * @property {string} [fileDataUrl]
 */

export const REPORT_TYPES = [
  'Compliance Report',
  'SSR',
  'Inspection Report',
  'Calibration Certificate',
  'Safety Audit',
  'Other',
]

/** @type {ReportDocument[]} */
export const REPORTS = [
  {
    id: 'RPT-001',
    department: 'SMS # 2',
    contactName: 'Mr. Lalit Goyal',
    reportType: 'SSR',
    fileName: 'SSR-SMS2-H2-2025.pdf',
    fileMimeType: 'application/pdf',
  },
  {
    id: 'RPT-002',
    department: 'OHS',
    contactName: 'Simanchal Panda',
    reportType: 'Compliance Report',
    fileName: 'RSO-Compliance-Q2-2025.pdf',
    fileMimeType: 'application/pdf',
  },
  {
    id: 'RPT-003',
    department: 'BF # 1',
    contactName: 'Plant RSO Representative',
    reportType: 'Inspection Report',
  },
]
