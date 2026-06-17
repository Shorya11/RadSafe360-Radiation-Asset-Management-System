import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function DeleteRsoPersonnelModal({ personnel, open, onClose, onConfirm }) {
  if (!personnel) return null

  return (
    <Modal open={open} onClose={onClose} title="Delete Personnel">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete personnel
        {' '}
        <span className="font-semibold text-gray-900">{personnel.name}</span>
        {' '}
        (
        {personnel.employeeId}
        )? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          className="!border-rose-500/30 !bg-rose-500/10 !text-accent-red hover:!bg-rose-500/20"
          onClick={async () => {
            try {
              await onConfirm(personnel.employeeId)
              onClose()
            } catch {
              /* error surfaced via context */
            }
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
