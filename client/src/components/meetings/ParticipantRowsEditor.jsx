import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { EMPTY_PARTICIPANT_ROW } from '../../data/attendance'
import { ATTENDANCE_STATUS_META } from '../../utils/meetingUtils'

const STATUS_OPTIONS = Object.keys(ATTENDANCE_STATUS_META)

export function ParticipantRowsEditor({ participants, onChange, compact = false }) {
  const updateRow = (index, field, value) => {
    const next = participants.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    )
    onChange(next)
  }

  const addRow = () => onChange([...participants, { ...EMPTY_PARTICIPANT_ROW }])

  const removeRow = (index) => {
    if (participants.length <= 1) return
    onChange(participants.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Participants</p>
        <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={addRow}>
          <Plus className="h-3.5 w-3.5" />
          Add participant
        </Button>
      </div>

      <div className={`space-y-3 ${compact ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
        {participants.map((row, index) => (
          <div
            key={index}
            className="enterprise-surface-muted p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-industrial-600">Participant {index + 1}</span>
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={participants.length <= 1}
                className="rounded-lg p-1.5 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red disabled:opacity-30"
                aria-label="Remove participant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Name"
                value={row.name}
                onChange={(e) => updateRow(index, 'name', e.target.value)}
                required
              />
              <Input
                label="Department"
                value={row.department}
                onChange={(e) => updateRow(index, 'department', e.target.value)}
                required
              />
              <Input
                label="Designation"
                value={row.designation}
                onChange={(e) => updateRow(index, 'designation', e.target.value)}
              />
              <Input
                label="Phone Number"
                value={row.phoneNumber}
                onChange={(e) => updateRow(index, 'phoneNumber', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={row.email}
                onChange={(e) => updateRow(index, 'email', e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-500">Attendance</label>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(index, 'status', e.target.value)}
                  className="enterprise-input"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ATTENDANCE_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
