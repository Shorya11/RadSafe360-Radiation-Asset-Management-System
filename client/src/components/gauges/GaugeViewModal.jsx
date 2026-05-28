import { Modal } from '../ui/Modal'
import { GaugeStatusBadge } from './GaugeStatusBadge'

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wider text-industrial-600">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || '—'}</p>
    </div>
  )
}

export function GaugeViewModal({ gauge, open, onClose }) {
  if (!gauge) return null

  return (
    <Modal open={open} onClose={onClose} title={`Gauge ${gauge.id}`} className="max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-accent-amber">{gauge.serialNumber}</p>
        <GaugeStatusBadge status={gauge.status} />
      </div>
      <div className="grid gap-y-2 gap-x-16 sm:grid-cols-2">
        <DetailRow label="Make" value={gauge.make} />
        <DetailRow label="Model" value={gauge.model} />
        <DetailRow label="Source" value={gauge.source} />
        <DetailRow label="Quantity" value={gauge.quantity} />
        <DetailRow label="Activity" value={gauge.activity} />
        <DetailRow label="Purchase Date" value={gauge.purchaseDate} />
        <DetailRow label="Install Date" value={gauge.installDate} />
        <DetailRow label="Life" value={gauge.life} />
        <DetailRow label="Plant" value={gauge.plant} />
        <DetailRow label="Location" value={gauge.location} />
        <DetailRow label="NOC Number" value={gauge.nocNumber} />
        <DetailRow label="Contact Person" value={gauge.contactPerson} />
        <DetailRow label="Calibration Due Date" value={gauge.calibrationDueDate} />
      </div>
    </Modal>
  )
}
