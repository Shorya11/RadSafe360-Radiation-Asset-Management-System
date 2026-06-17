/** @param {import('../data/reports.js').ReportDocument[]} reports */
export function generateReportId(reports) {
  const nums = reports
    .map((r) => parseInt(r.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `RPT-${String(next).padStart(3, '0')}`
}
