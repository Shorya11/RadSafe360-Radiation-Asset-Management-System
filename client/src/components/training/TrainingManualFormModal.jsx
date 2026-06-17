import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { TRAINING_CATEGORIES } from '../../data/trainingManuals'


const emptyForm = {
  manualName: '',
  category: 'Safety',
  fileName: '',
  file: null,
}

export function TrainingManualFormModal({ open, onClose, manual, onSave, title }) {
  const [form, setForm] = useState(emptyForm)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    if (!open) return
    setFileError('')
    if (manual) {
      setForm({
        manualName: manual.manualName,
        category: manual.category,
        fileName: manual.fileName || '',
        file: null,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, manual])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setFileError('')

    setForm((f) => ({
      ...f,
      file,
      fileName: file.name,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!manual && !form.fileName) {
      setFileError('Please upload a file.')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Manual Name"
          name="manualName"
          value={form.manualName}
          onChange={handleChange}
          required
        />
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-xs font-semibold text-industrial-600">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="enterprise-input w-full"
            required
          >
            {TRAINING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="manual-file" className="block text-xs font-semibold text-industrial-600">
            Upload File
          </label>
          <input
            id="manual-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
            onChange={handleFileChange}
            className="enterprise-input w-full file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-amber hover:file:bg-amber-100"
          />
          {form.fileName && (
            <p className="text-xs text-industrial-600">Selected: {form.fileName}</p>
          )}
          {fileError && <p className="text-xs text-accent-red">{fileError}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{manual ? 'Save Changes' : 'Upload Manual'}</Button>
        </div>
      </form>
    </Modal>
  )
}
