import { Modal } from '../ui/Modal'
import { SurveyMeterStatusBadge } from './SurveyMeterStatusBadge'

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wider text-industrial-600">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || '—'}</p>
    </div>
  )
}

export function SurveyMeterViewModal({ meter, open, onClose }) {
  if (!meter) return null

  return (
    <Modal open={open} onClose={onClose} title={meter.surveyMeterName} className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-accent-amber">{meter.id}</p>
        <SurveyMeterStatusBadge status={meter.functionalStatus} />
      </div>
      <div className="grid gap-x-14 gap-y-2 sm:grid-cols-2">
        <DetailRow label="Supplier" value={meter.supplier} />
        <DetailRow label="Date of Procurement" value={meter.dateOfProcurement} />
        <DetailRow label="Make" value={meter.make} />
        <DetailRow label="Model" value={meter.model} />
        <DetailRow label="Serial Number" value={meter.serialNumber} />
        <DetailRow label="Detector Type" value={meter.detectorType} />
        <DetailRow label="Detector Volume" value={meter.detectorVolume} />
        <DetailRow label="Radiation Type" value={meter.radiationType} />
        <DetailRow label="Functional Status" value={meter.functionalStatus} />
        <DetailRow label="Calibration Date" value={meter.calibrationDate} />
        <DetailRow label="Calibration Till Date" value={meter.calibrationTillDate} />
        <DetailRow label="Calibration Lab" value={meter.calibrationLab} />
      </div>
    </Modal>
  )
}
