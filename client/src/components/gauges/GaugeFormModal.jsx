import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { GAUGE_STATUSES, GAUGE_PLANTS } from '../../data/gauges'

const emptyForm = {
  id: '',
  serialNumber: '',
  make: '',
  model: '',
  source: '',
  quantity: 1,
  activity: '',
  purchaseDate: '',
  installDate: '',
  sourceTestDate: '',
  location: '',
  plant: 'SMS-II',
  lifecycleYears: '',
  nocNumber: '',
  contactPerson: '',
  calibrationDueDate: '',
  status: 'Active',
}

export function GaugeFormModal({ open, onClose, gauge, onSave, title }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (gauge) {
      setForm({
        id: gauge.id,
        serialNumber: gauge.serialNumber,
        make: gauge.make,
        model: gauge.model,
        source: gauge.source,
        quantity: gauge.quantity,
        activity: gauge.activity,
        purchaseDate: gauge.purchaseDate,
        installDate: gauge.installDate,
        sourceTestDate: gauge.sourceTestDate,
        location: gauge.location,
        plant: gauge.plant,
        lifecycleYears: gauge.lifecycleYears,
        nocNumber: gauge.nocNumber,
        contactPerson: gauge.contactPerson,
        calibrationDueDate: gauge.calibrationDueDate,
        status: gauge.status,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, gauge])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
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
    <Modal open={open} onClose={onClose} title={title} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Gauge ID"
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="NG-2019"
            disabled={Boolean(gauge)}
            required={!gauge}
          />
          <Input
            label="Gauge Serial Number"
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            required
          />
          <Input label="Make" name="make" value={form.make} onChange={handleChange} required />
          <Input label="Model" name="model" value={form.model} onChange={handleChange} required />
          <Input label="Source" name="source" value={form.source} onChange={handleChange} required />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <Input
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Activity"
            name="activity"
            value={form.activity}
            onChange={handleChange}
            required
          />
          <Input
            label="Install Date"
            name="installDate"
            type="date"
            value={form.installDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Source Test Date"
            name="sourceTestDate"
            type="date"
            value={form.sourceTestDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Lifecycle (Years)"
            name="lifecycleYears"
            type="number"
            min="0"
            step="any"
            value={form.lifecycleYears}
            onChange={handleChange}
            required
          />
          <Input
            label="Plant"
            name="plant"
            value={form.plant}
            onChange={handleChange}
            placeholder="Enter Plant"
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-xs font-medium text-gray-500">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="enterprise-input"
            >
              {GAUGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="sm:col-span-2"
            required
          />
          <Input
            label="NOC Number"
            name="nocNumber"
            value={form.nocNumber}
            onChange={handleChange}
          />
          <Input
            label="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            required
          />
          <Input
            label="Calibration Due Date"
            name="calibrationDueDate"
            type="date"
            value={form.calibrationDueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : gauge ? 'Save Changes' : 'Add Gauge'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
