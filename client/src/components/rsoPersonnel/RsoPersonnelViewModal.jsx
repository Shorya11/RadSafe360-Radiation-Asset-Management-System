import { Modal } from '../ui/Modal'
import { RsoPersonnelStatusBadge } from './RsoPersonnelStatusBadge'

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wider text-industrial-600">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || '—'}</p>
    </div>
  )
}

export function RsoPersonnelViewModal({ personnel, open, onClose }) {
  if (!personnel) return null

  return (
    <Modal open={open} onClose={onClose} title={personnel.name} className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-accent-amber">{personnel.employeeId}</p>
        <RsoPersonnelStatusBadge status={personnel.status} validTill={personnel.validTill} />
      </div>
      <div className="grid gap-x-14 gap-y-2 sm:grid-cols-2">
        <DetailRow label="Department" value={personnel.department} />
        <DetailRow label="Phone" value={personnel.phone} />
        <DetailRow label="Email" value={personnel.email} />
        <DetailRow label="Case File Number" value={personnel.caseFileNumber} />
        <DetailRow label="Document Number" value={personnel.documentNumber} />
        <DetailRow label="Date of Issue" value={personnel.dateOfIssue} />
        <DetailRow label="Valid Till" value={personnel.validTill} />
        <DetailRow label="Status" value={personnel.status} />
        <DetailRow label="Upload Certificate" value={personnel.certificateName || 'Not uploaded'} />
      </div>
    </Modal>
  )
}
