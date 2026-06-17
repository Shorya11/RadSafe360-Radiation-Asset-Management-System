import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const emptyForm = {
  name: '',
  designation: '',
  email: '',
  role: '',
}

export function EloraMemberFormModal({ open, onClose, member, onSave, title }) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(member ? { ...member } : emptyForm)
  }, [open, member])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onSave({
        name: form.name,
        designation: form.designation,
        email: form.email,
        role: form.role,
      })
      onClose()
    } catch {
      // context handles error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name || ''} onChange={handleChange} required />
        <Input
          label="Designation"
          name="designation"
          value={form.designation || ''}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email || ''}
          onChange={handleChange}
          required
        />
        <Input label="Role" name="role" value={form.role || ''} onChange={handleChange} required />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : member ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
