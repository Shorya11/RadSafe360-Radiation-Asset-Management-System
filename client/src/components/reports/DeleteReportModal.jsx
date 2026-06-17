import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function DeleteReportModal({ report, open, onClose, onConfirm }) {
  if (!report) return null

  return (
    <Modal open={open} onClose={onClose} title="Delete Document">
      <p className="text-sm text-gray-500">
        Delete the document for{' '}
        <span className="font-semibold text-gray-900">{report.contactName}</span>
        {report.fileName ? ` (${report.fileName})` : ''}? This cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          className="!border-rose-500/30 !bg-rose-500/10 !text-accent-red hover:!bg-rose-500/20"
          onClick={() => {
            onConfirm(report.id)
            onClose()
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
