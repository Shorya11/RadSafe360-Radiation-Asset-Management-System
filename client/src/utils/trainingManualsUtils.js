/** @param {import('../data/trainingManuals.js').TrainingManual[]} manuals */
export function generateTrainingManualId(manuals) {
  const nums = manuals
    .map((m) => parseInt(m.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `TM-${String(next).padStart(3, '0')}`
}
