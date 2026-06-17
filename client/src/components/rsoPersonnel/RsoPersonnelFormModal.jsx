import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'


const emptyForm = {
  employeeId: '',
  name: '',
  department: 'Radiation Safety',
  phone: '',
  email: '',
  caseFileNumber: '',
  documentNumber: '',
  dateOfIssue: '',
  validTill: '',
  certificateName: '',
}

export function RsoPersonnelFormModal({ open, onClose, personnel, onSave, title }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (personnel) {
      setForm({
        employeeId: personnel.employeeId,
        name: personnel.name,
        department: personnel.department,
        phone: personnel.phone,
        email: personnel.email,
        caseFileNumber: personnel.caseFileNumber,
        documentNumber: personnel.documentNumber,
        dateOfIssue: personnel.dateOfIssue,
        validTill: personnel.validTill,
        certificateName: personnel.certificateName || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, personnel])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0]
    setForm((prev) => ({ ...prev, certificateName: file?.name || prev.certificateName }))
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSave(form)
      onClose()
    } catch {
      /* error surfaced via context */
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Employee ID"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="EMP-RSO-1005"
            disabled={Boolean(personnel)}
            required={!personnel}
          />
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Enter Department"
            required
          />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input
            label="Case File Number"
            name="caseFileNumber"
            value={form.caseFileNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Document Number"
            name="documentNumber"
            value={form.documentNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Date of Issue"
            name="dateOfIssue"
            type="date"
            value={form.dateOfIssue}
            onChange={handleChange}
            required
          />
          <Input
            label="Valid Till"
            name="validTill"
            type="date"
            value={form.validTill}
            onChange={handleChange}
            required
          />
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="certificateUpload" className="block text-xs font-medium text-gray-500">
              Upload Certificate (placeholder)
            </label>
            <input
              id="certificateUpload"
              type="file"
              onChange={handleCertificateChange}
              className="enterprise-input w-full file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-amber hover:file:bg-amber-100"
            />
            {form.certificateName && (
              <p className="text-xs text-industrial-600">Selected: {form.certificateName}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : personnel ? 'Save Changes' : 'Add Personnel'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
