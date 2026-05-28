import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { SURVEY_METER_STATUSES } from '../../data/surveyMeters'

const emptyForm = {
  id: '',
  surveyMeterName: '',
  supplier: '',
  dateOfProcurement: '',
  make: '',
  model: '',
  serialNumber: '',
  detectorType: '',
  detectorVolume: '',
  radiationType: '',
  functionalStatus: 'Working',
  calibrationDate: '',
  calibrationTillDate: '',
  calibrationLab: '',
}

export function SurveyMeterFormModal({ open, onClose, meter, onSave, title }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (meter) {
      setForm({ ...meter })
    } else {
      setForm(emptyForm)
    }
  }, [open, meter])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Meter ID"
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="SM-1010"
            disabled={Boolean(meter)}
            required={!meter}
          />
          <Input
            label="Survey Meter Name"
            name="surveyMeterName"
            value={form.surveyMeterName}
            onChange={handleChange}
            required
          />
          <Input label="Supplier" name="supplier" value={form.supplier} onChange={handleChange} required />
          <Input
            label="Date of Procurement"
            name="dateOfProcurement"
            type="date"
            value={form.dateOfProcurement}
            onChange={handleChange}
            required
          />
          <Input label="Make" name="make" value={form.make} onChange={handleChange} required />
          <Input label="Model" name="model" value={form.model} onChange={handleChange} required />
          <Input
            label="Serial Number"
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Detector Type"
            name="detectorType"
            value={form.detectorType}
            onChange={handleChange}
            required
          />
          <Input
            label="Detector Volume"
            name="detectorVolume"
            value={form.detectorVolume}
            onChange={handleChange}
            required
          />
          <Input
            label="Radiation Type"
            name="radiationType"
            value={form.radiationType}
            onChange={handleChange}
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="functionalStatus" className="block text-xs font-medium text-gray-500">
              Functional Status
            </label>
            <select
              id="functionalStatus"
              name="functionalStatus"
              value={form.functionalStatus}
              onChange={handleChange}
              className="enterprise-input"
            >
              {SURVEY_METER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Calibration Date"
            name="calibrationDate"
            type="date"
            value={form.calibrationDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Calibration Till Date"
            name="calibrationTillDate"
            type="date"
            value={form.calibrationTillDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Calibration Lab"
            name="calibrationLab"
            value={form.calibrationLab}
            onChange={handleChange}
            className="sm:col-span-2"
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{meter ? 'Save Changes' : 'Add Meter'}</Button>
        </div>
      </form>
    </Modal>
  )
}
