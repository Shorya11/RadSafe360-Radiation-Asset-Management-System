/** @typedef {{ id: string, name: string, aliases?: string[] }} Department */

/** @type {Department[]} */
export const DEPARTMENTS = [
  { id: 'cac', name: 'CAC', aliases: [] },
  { id: 'cme-hese', name: 'CME & HESE', aliases: [] },
  { id: 'ohs', name: 'OHS', aliases: ['OHS - Representative'] },
  { id: 'bf-1', name: 'BF # 1', aliases: ['BF-1'] },
  { id: 'bf-2', name: 'BF # 2', aliases: ['BF-2'] },
  { id: 'sms-2', name: 'SMS # 2', aliases: ['SMS-2', 'SMSII'] },
  { id: 'sms-3', name: 'SMS # 3', aliases: ['SMS-3', 'SMSIII'] },
  { id: 'plate-mill', name: 'Plate Mill', aliases: [] },
  { id: 'sinter', name: 'Sinter Plant', aliases: ['Sinter'] },
  { id: 'power-plant', name: 'Power Plant', aliases: ['PP-1&2'] },
  { id: 'tsd', name: 'TSD (BF# 2 - Lab)', aliases: ['TSD'] },
  { id: 'coal-washry', name: 'Coal Washry', aliases: ['Coal washery-2', 'Coal washery-3'] },
]

export const DEPARTMENT_BY_ID = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.id, d]),
)
