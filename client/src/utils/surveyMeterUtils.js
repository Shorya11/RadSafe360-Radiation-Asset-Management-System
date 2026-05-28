/** @param {import('../data/surveyMeters.js').SurveyMeter[]} meters */
export function computeSurveyMeterKpis(meters) {
  const total = meters.length
  const working = meters.filter((m) => m.functionalStatus === 'Working').length
  const notWorking = meters.filter((m) => m.functionalStatus === 'Not Working').length
  return { total, working, notWorking }
}

export function exportSurveyMetersCsv(meters) {
  const headers = [
    'Survey Meter Name',
    'Supplier',
    'Date of Procurement',
    'Make',
    'Model',
    'Serial Number',
    'Detector Type',
    'Detector Volume',
    'Radiation Type',
    'Functional Status',
    'Calibration Date',
    'Calibration Till Date',
    'Calibration Lab',
  ]

  const rows = meters.map((m) =>
    [
      m.surveyMeterName,
      m.supplier,
      m.dateOfProcurement,
      m.make,
      m.model,
      m.serialNumber,
      m.detectorType,
      m.detectorVolume,
      m.radiationType,
      m.functionalStatus,
      m.calibrationDate,
      m.calibrationTillDate,
      m.calibrationLab,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `survey-meters-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function generateSurveyMeterId(meters) {
  const nums = meters
    .map((m) => parseInt(m.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1001
  return `SM-${next}`
}
