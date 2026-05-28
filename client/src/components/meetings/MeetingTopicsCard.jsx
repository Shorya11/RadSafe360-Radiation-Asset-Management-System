import { ListChecks, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useMemo, useState } from 'react'

function normalizeList(items) {
  return (items ?? []).map((t) => String(t ?? '').trim())
}

export function MeetingTopicsCard({ topics, editable = false, onSave }) {
  const initial = useMemo(() => (topics?.length ? normalizeList(topics) : ['']), [topics])
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState([''])

  const canEdit = editable && typeof onSave === 'function'

  const addRow = () => setDraft((prev) => [...prev, ''])
  const removeRow = (index) => {
    setDraft((prev) => (prev.length <= 1 ? [''] : prev.filter((_, i) => i !== index)))
  }
  const updateRow = (index, value) => {
    setDraft((prev) => prev.map((t, i) => (i === index ? value : t)))
  }

  const handleCancel = () => {
    setDraft(initial)
    setIsEditing(false)
  }

  const handleSave = () => {
    const next = normalizeList(draft).filter(Boolean)
    onSave(next)
    setIsEditing(false)
  }

  const startEdit = () => {
    setDraft(initial)
    setIsEditing(true)
  }

  if (!topics?.length && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Topics</CardTitle>
          <ListChecks className="h-4 w-4 text-accent-amber" />
        </CardHeader>
        <CardBody>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-industrial-600">No topics recorded for this meeting.</p>
            {canEdit && (
              <Button variant="secondary" className="!py-1.5 !text-xs" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Topics</CardTitle>
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-accent-amber" />
          {canEdit && !isEditing && (
            <Button variant="secondary" className="!py-1.5 !text-xs" onClick={startEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-industrial-600">Add / edit / delete topics</p>
              <Button variant="secondary" className="!py-1.5 !text-xs" onClick={addRow}>
                <Plus className="h-3.5 w-3.5" />
                Add topic
              </Button>
            </div>

            <div className="space-y-3">
              {draft.map((topic, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    label={`Topic ${index + 1}`}
                    value={topic}
                    onChange={(e) => updateRow(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="mt-6 rounded-lg p-2 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red"
                    aria-label="Delete topic"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button variant="secondary" onClick={handleCancel}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {topics.map((topic, index) => (
              <li
                key={`${topic}-${index}`}
                className="flex gap-3 text-sm text-gray-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
