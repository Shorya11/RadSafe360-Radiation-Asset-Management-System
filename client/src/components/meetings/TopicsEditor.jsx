import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function TopicsEditor({ topics, onChange, label = 'Meeting topics / agenda' }) {
  const updateTopic = (index, value) => {
    onChange(topics.map((t, i) => (i === index ? value : t)))
  }

  const addTopic = () => onChange([...topics, ''])

  const removeTopic = (index) => {
    if (topics.length <= 1) {
      onChange([''])
      return
    }
    onChange(topics.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={addTopic}>
          <Plus className="h-3.5 w-3.5" />
          Add topic
        </Button>
      </div>
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={topic}
              onChange={(e) => updateTopic(index, e.target.value)}
              placeholder="e.g. SSR report submission"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeTopic(index)}
              className="mt-6 rounded-lg p-2 text-industrial-600 hover:bg-red-50 hover:text-accent-red"
              aria-label="Remove topic"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
