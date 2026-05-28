import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const EMPTY_ACTION_ACTIVITY = {
  task: '',
  assignedTo: '',
  dueDate: '',
  status: 'Pending',
}

const ACTION_STATUSES = ['Pending', 'In Progress', 'Completed']

export function ActionActivitiesEditor({ activities, onChange }) {
  const updateRow = (index, field, value) => {
    onChange(activities.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const addRow = () => onChange([...activities, { ...EMPTY_ACTION_ACTIVITY }])

  const removeRow = (index) => {
    if (activities.length <= 1) {
      onChange([{ ...EMPTY_ACTION_ACTIVITY }])
      return
    }
    onChange(activities.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Action Activities</p>
        <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={addRow}>
          <Plus className="h-3.5 w-3.5" />
          Add activity
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {activities.map((row, index) => (
          <div key={index} className="enterprise-surface-muted p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-industrial-600">Activity {index + 1}</span>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="rounded-lg p-1.5 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red"
                aria-label="Remove action activity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Task"
                value={row.task}
                onChange={(e) => updateRow(index, 'task', e.target.value)}
                required
              />
              <Input
                label="Assigned To"
                value={row.assignedTo}
                onChange={(e) => updateRow(index, 'assignedTo', e.target.value)}
                required
              />
              <Input
                label="Due Date"
                type="date"
                value={row.dueDate}
                onChange={(e) => updateRow(index, 'dueDate', e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-500">Status</label>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(index, 'status', e.target.value)}
                  className="enterprise-input"
                >
                  {ACTION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
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
