import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function UploadCertificateModal({ personnel, open, onClose, onSave }) {
  const [selectedName, setSelectedName] = useState('')

  if (!personnel) return null

  return (
    <Modal open={open} onClose={onClose} title={`Upload Certificate - ${personnel.employeeId}`}>
      <div className="space-y-4">
        <p className="text-sm text-industrial-600">
          Placeholder upload support for personnel certification documents.
        </p>
        <input
          type="file"
          onChange={(e) => setSelectedName(e.target.files?.[0]?.name || '')}
          className="enterprise-input w-full file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-amber hover:file:bg-amber-100"
        />
        {(selectedName || personnel.certificateName) && (
          <p className="text-xs text-industrial-600">
            Selected: {selectedName || personnel.certificateName}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave(selectedName)
              setSelectedName('')
              onClose()
            }}
          >
            Save Placeholder
          </Button>
        </div>
      </div>
    </Modal>
  )
}
