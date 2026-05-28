/** @param {import('../data/gauges.js').Gauge[]} gauges */

export function computeGaugeKpis(gauges) {
  const total = gauges.length
  const active = gauges.filter((g) => g.status === 'Active').length
  const inactive = gauges.filter((g) => g.status === 'Inactive').length
  const disposed = gauges.filter((g) => g.status === 'Disposed').length
  return { total, active, inactive, disposed }
}

export function buildPlantDistribution(gauges) {
  const plants = ['SMS-II', 'SMS-III', 'Blast Furnace', 'Plate Mill', 'Coke Oven']
  const counts = Object.fromEntries(plants.map((p) => [p, 0]))

  for (const g of gauges) {
    if (counts[g.plant] !== undefined) counts[g.plant] += 1
    else counts[g.plant] = 1
  }

  return plants.map((plant) => ({
    plant,
    count: counts[plant] ?? 0,
  }))
}

export function buildStatusDistribution(gauges) {
  const statuses = ['Active', 'Inactive', 'Disposed']
  return statuses.map((status) => ({
    name: status,
    value: gauges.filter((g) => g.status === status).length,
  })).filter((d) => d.value > 0)
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
    'Install Date',
    'Location',
    'Plant',
    'Life',
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
      g.location,
      g.plant,
      g.life,
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
