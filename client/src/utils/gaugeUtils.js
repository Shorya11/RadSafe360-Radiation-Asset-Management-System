/** @param {import('../data/gauges.js').Gauge[]} gauges */

export function computeGaugeKpis(gauges) {
  const total = gauges.length
  const active = gauges.filter((g) => g.status === 'Active').length
  const inactive = gauges.filter((g) => g.status === 'Inactive').length
  const disposed = gauges.filter((g) => g.status === 'Disposed').length
  const maintenance = gauges.filter((g) => g.status === 'Maintenance').length
  return { total, active, inactive, disposed, maintenance }
}

export function buildPlantDistribution(gauges) {
  const counts = {}

  gauges.forEach((g) => {
    if (!g.plant) return

    counts[g.plant] = (counts[g.plant] || 0) + 1
  })

  return Object.entries(counts).map(([plant, count]) => ({
    plant,
    count,
  }))
}

export function buildStatusDistribution(gauges) {
  const distribution = {
    Valid: 0,
    'Expiring Soon': 0,
    Expired: 0,
  }

  gauges.forEach((g) => {
    const status = g.lifecycleStatus

    if (distribution[status] !== undefined) {
      distribution[status]++
    }
  })

  return Object.entries(distribution)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .filter((item) => item.value > 0)
}

export function getLifecycleStatusVariant(status) {
  if (status === 'Valid') return 'success'
  if (status === 'Expiring Soon') return 'warning'
  return 'danger'
}

export function exportGaugesCsv(gauges) {
  const headers = [
    'Gauge ID',
    'Serial Number',
    'Make',
    'Model',
    'Source',
    'Quantity',
    'Activity',
    'Purchase Date',
    'Installation Date',
    'Source Test Date',
    'Lifecycle (Years)',
    'Expiry Date',
    'Remaining Life',
    'Lifecycle Status',
    'Location',
    'Plant',
    'Status',
    'NOC Number',
    'Contact Person',
    'Calibration Due Date',
  ]
  const rows = gauges.map((g) =>
    [
      g.id,
      g.serialNumber,
      g.make,
      g.model,
      g.source,
      g.quantity,
      g.activity,
      g.purchaseDate,
      g.installDate,
      g.sourceTestDate,
      g.lifecycleYears,
      g.expiryDate,
      g.remainingLife,
      g.lifecycleStatus,
      g.location,
      g.plant,
      g.status,
      g.nocNumber,
      g.contactPerson,
      g.calibrationDueDate,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gauges-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function generateGaugeId(gauges) {
  const nums = gauges
    .map((g) => parseInt(g.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 2001
  return `NG-${next}`
}
