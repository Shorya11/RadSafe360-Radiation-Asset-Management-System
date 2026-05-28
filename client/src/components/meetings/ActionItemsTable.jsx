import { useMemo, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const ACTION_STATUSES = ['Pending', 'In Progress', 'Completed']

function statusVariant(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'completed' || normalized === 'done') return 'success'
  if (normalized === 'in progress') return 'warning'
  return 'muted'
}

export function ActionItemsTable({
  items,
  editable = false,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const canEdit =
    editable &&
    typeof onAdd === 'function' &&
    typeof onUpdate === 'function' &&
    typeof onDelete === 'function'

  const sorted = useMemo(
    () => [...(items ?? [])].sort((a, b) => (a.serialNo ?? 0) - (b.serialNo ?? 0)),
    [items],
  )

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({
    task: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending',
  })

  const startEdit = (item) => {
    setEditingId(item.id)
    setDraft({
      task: item.task ?? item.agendaItem ?? '',
      assignedTo: item.assignedTo ?? item.ownerRaw ?? '',
      dueDate: item.dueDate ?? item.targetDateRaw ?? '',
      status: item.status ?? item.workflowStatus ?? 'Pending',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({ task: '', assignedTo: '', dueDate: '', status: 'Pending' })
  }

  const saveEdit = () => {
    if (!editingId) return
    onUpdate(editingId, {
      task: draft.task,
      assignedTo: draft.assignedTo,
      dueDate: draft.dueDate,
      status: draft.status,
    })
    cancelEdit()
  }

  const handleAdd = () => {
    const id = onAdd({
      task: 'New task',
      assignedTo: '',
      dueDate: '',
      status: 'Pending',
    })
    const created = sorted.find((i) => i.id === id)
    if (created) startEdit(created)
  }

  if (!sorted.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
        <p className="text-industrial-600">No MOM action items for this meeting.</p>
        {canEdit && (
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Action
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      {canEdit && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/60 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">Action Activities</p>
          <Button variant="secondary" className="!py-1.5 !text-xs" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add Action
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="enterprise-table-head">
              <th className="w-12 px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Task</th>
              <th className="px-5 py-3 font-medium">Assigned To</th>
              <th className="px-5 py-3 font-medium">Due Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              {canEdit && <th className="w-32 px-5 py-3 font-medium" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sorted.map((item) => {
              const isEditing = canEdit && editingId === item.id
              return (
              <tr key={item.id} className="align-top hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-industrial-600">{item.serialNo}</td>
                <td className="px-5 py-4 font-medium text-gray-900">
                  {isEditing ? (
                    <Input
                      label="Task"
                      value={draft.task}
                      onChange={(e) => setDraft((d) => ({ ...d, task: e.target.value }))}
                    />
                  ) : (
                    (item.task ?? item.agendaItem ?? '—')
                  )}
                </td>
                <td className="max-w-xs px-5 py-4 text-gray-500">
                  {isEditing ? (
                    <Input
                      label="Assigned To"
                      value={draft.assignedTo}
                      onChange={(e) => setDraft((d) => ({ ...d, assignedTo: e.target.value }))}
                    />
                  ) : (
                    (item.assignedTo ?? item.ownerRaw ?? '—')
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  {isEditing ? (
                    <Input
                      label="Due Date"
                      type="date"
                      value={draft.dueDate}
                      onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                    />
                  ) : (
                    (item.dueDate ?? item.targetDateRaw ?? '—')
                  )}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-500">Status</label>
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                        className="enterprise-select !rounded-lg !px-2 !py-1.5"
                      >
                        {ACTION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (item.status || item.workflowStatus ? (
                    <Badge variant={statusVariant(item.status ?? item.workflowStatus)}>
                      {item.status ?? item.workflowStatus}
                    </Badge>
                  ) : (
                    <span className="text-industrial-600">—</span>
                  ))}
                </td>
                {canEdit && (
                  <td className="px-5 py-4">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button className="!px-3 !py-1.5 !text-xs" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => startEdit(item)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="rounded-lg p-2 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red"
                          aria-label="Delete action activity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}
