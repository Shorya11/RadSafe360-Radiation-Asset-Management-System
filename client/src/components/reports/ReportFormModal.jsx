import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { REPORT_TYPES } from '../../data/reports'
import { DEPARTMENTS } from '../../data/departments'

const emptyForm = {
  department: 'SMS # 2',
  contactName: '',
  reportType: 'SSR',
  fileName: '',
  file: null,
}

export function ReportFormModal({
  open,
  onClose,
  report,
  onSave,
  title,
}) {
  const [form, setForm] = useState(emptyForm)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    if (!open) return

    setFileError('')

    if (report) {
      setForm({
        department: report.department,
        contactName: report.contactName,
        reportType: report.reportType,
        fileName: report.fileName || '',
        file: null,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, report])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((f) => ({
      ...f,
      [name]: value,
    }))
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

    if (!report && !form.file) {
      setFileError('Please upload a document.')
      return
    }

    onSave(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="department"
            className="block text-xs font-semibold text-industrial-600"
          >
            Department
          </label>

          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="enterprise-input w-full"
            required
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contact Name"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          required
        />

        <div className="space-y-1.5">
          <label
            htmlFor="reportType"
            className="block text-xs font-semibold text-industrial-600"
          >
            Report Type
          </label>

          <select
            id="reportType"
            name="reportType"
            value={form.reportType}
            onChange={handleChange}
            className="enterprise-input w-full"
            required
          >
            {REPORT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="report-file"
            className="block text-xs font-semibold text-industrial-600"
          >
            Upload Document
          </label>

          <input
            id="report-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
            onChange={handleFileChange}
            className="enterprise-input w-full file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-amber hover:file:bg-amber-100"
          />

          {form.fileName && (
            <p className="text-xs text-industrial-600">
              Selected: {form.fileName}
            </p>
          )}

          {fileError && (
            <p className="text-xs text-accent-red">
              {fileError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit">
            {report ? 'Save Changes' : 'Upload Document'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}