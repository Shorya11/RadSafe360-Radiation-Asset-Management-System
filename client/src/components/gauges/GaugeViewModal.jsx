import { Modal } from '../ui/Modal'
import { GaugeStatusBadge } from './GaugeStatusBadge'
import { LifecycleStatusBadge } from './LifecycleStatusBadge'
import { Button } from '../ui/Button'
import { Eye, Download } from 'lucide-react'

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wider text-industrial-600">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || '—'}</p>
    </div>
  )
}

export function GaugeViewModal({ gauge, open, onClose, onPreviewDocument, onDownloadDocument }) {
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
        <DetailRow label="Purchase Date" value={gauge.purchaseDate} />
        <DetailRow label="Installation Date" value={gauge.installDate} />
        <DetailRow label="Source Test Date" value={gauge.sourceTestDate} />
        <DetailRow label="Activity" value={gauge.activity} />
        <DetailRow label="Lifecycle (Years)" value={gauge.lifecycleYears} />
        <DetailRow label="Expiry Date" value={gauge.expiryDate} />
        <DetailRow label="Remaining Life" value={gauge.remainingLife} />
        <DetailRow label="Lifecycle Status">
          <LifecycleStatusBadge status={gauge.lifecycleStatus} />
        </DetailRow>
        <DetailRow label="Plant" value={gauge.plant} />
        <DetailRow label="Location" value={gauge.location} />
        <DetailRow label="NOC Number" value={gauge.nocNumber} />
        <DetailRow label="Contact Person" value={gauge.contactPerson} />
        <DetailRow label="Calibration Due Date" value={gauge.calibrationDueDate} />
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900">Uploaded Documents</h3>
        {!gauge.documents?.length ? (
          <p className="mt-2 text-sm text-industrial-600">No documents uploaded.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {gauge.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-industrial-600">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onPreviewDocument(doc)}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="secondary" onClick={() => onDownloadDocument(doc)}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
