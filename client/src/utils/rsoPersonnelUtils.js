/** @param {string} validTill */
export function derivePersonnelStatus(validTill) {
  if (!validTill) return 'Expired'
  const today = startOfDay(new Date())
  const expiryDate = startOfDay(new Date(validTill))
  return expiryDate >= today ? 'Valid' : 'Expired'
}

/** @param {string} validTill */
export function isExpiringSoon(validTill, days = 30) {
  if (!validTill) return false
  const today = startOfDay(new Date())
  const expiryDate = startOfDay(new Date(validTill))
  if (Number.isNaN(expiryDate.getTime()) || expiryDate < today) return false
  const threshold = new Date(today)
  threshold.setDate(threshold.getDate() + days)
  return expiryDate <= threshold
}

/** @param {import('../data/rsoPersonnel.js').Personnel[]} personnel */
export function computeRsoPersonnelKpis(personnel) {
  const total = personnel.length
  const valid = personnel.filter((p) => p.status === 'Valid').length
  const expired = personnel.filter((p) => p.status === 'Expired').length
  const expiringSoon = personnel.filter((p) => isExpiringSoon(p.validTill)).length
  return { total, valid, expired, expiringSoon }
}

export function exportRsoPersonnelCsv(personnel) {
  const headers = [
    'Employee ID',
    'Name',
    'Department',
    'Phone',
    'Email',
    'Case File Number',
    'Document Number',
    'Date of Issue',
    'Valid Till',
    'Status',
    'Upload Certificate',
  ]

  const rows = personnel.map((p) =>
    [
      p.employeeId,
      p.name,
      p.department,
      p.phone,
      p.email,
      p.caseFileNumber,
      p.documentNumber,
      p.dateOfIssue,
      p.validTill,
      p.status,
      p.certificateName || '',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rso-personnel-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
