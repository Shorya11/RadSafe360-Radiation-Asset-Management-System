import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function DeleteTrainingManualModal({ manual, open, onClose, onConfirm }) {
  if (!manual) return null

  return (
    <Modal open={open} onClose={onClose} title="Delete Manual">
      <p className="text-sm text-gray-500">
        Delete manual{' '}
        <span className="font-semibold text-gray-900">{manual.manualName}</span>
        {manual.fileName ? ` (${manual.fileName})` : ''}? This cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          className="!border-rose-500/30 !bg-rose-500/10 !text-accent-red hover:!bg-rose-500/20"
          onClick={() => {
            onConfirm(manual.id)
            onClose()
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
