/** @typedef {Object} TrainingManual
 * @property {string} id
 * @property {string} manualName
 * @property {string} category
 * @property {string} [fileName]
 * @property {string} [fileMimeType]
 * @property {string} [fileDataUrl]
 */

export const TRAINING_CATEGORIES = ['Safety', 'Training', 'Hazards', 'SOP', 'Emergency']

/** @type {TrainingManual[]} */
export const TRAINING_MANUALS = [
  {
    id: 'TM-001',
    manualName: 'Radiation Safety Officer Orientation',
    category: 'Training',
    fileName: 'RSO-Orientation-2025.pdf',
    fileMimeType: 'application/pdf',
  },
  {
    id: 'TM-002',
    manualName: 'Nucleonic Gauge Emergency Response',
    category: 'Emergency',
    fileName: 'Gauge-Emergency-Response.pdf',
    fileMimeType: 'application/pdf',
  },
  {
    id: 'TM-003',
    manualName: 'Co-60 Source Handling Hazards',
    category: 'Hazards',
  },
]
