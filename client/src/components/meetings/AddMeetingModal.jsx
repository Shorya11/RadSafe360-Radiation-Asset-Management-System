import { useState } from 'react'

import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

import { TopicsEditor } from './TopicsEditor'
import { ParticipantRowsEditor } from './ParticipantRowsEditor'
import {
  ActionActivitiesEditor,
  EMPTY_ACTION_ACTIVITY,
} from './ActionActivitiesEditor'
import { RsoParticipantPickerModal } from './RsoParticipantPickerModal'

import { useMeetings } from '../../context/MeetingContext'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'

import {
  EMPTY_PARTICIPANT_ROW,
  personnelToParticipant,
} from '../../data/attendance'
const emptyForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  chairPerson: 'Mr. Lalit Kumar Goyal',
  description: '',
}

export function AddMeetingModal({ open, onClose, onAdded }) {
  const { addMeeting } = useMeetings()
  const { personnel } = useRsoPersonnel()
  const [form, setForm] = useState(emptyForm)
  const [topics, setTopics] = useState([''])
  const [discussionPoints, setDiscussionPoints] = useState([''])
  const [participants, setParticipants] = useState([{ ...EMPTY_PARTICIPANT_ROW }])
  const [actionActivities, setActionActivities] = useState([{ ...EMPTY_ACTION_ACTIVITY }])
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setTopics([''])
    setDiscussionPoints([''])
    setParticipants([{ ...EMPTY_PARTICIPANT_ROW }])
    setActionActivities([{ ...EMPTY_ACTION_ACTIVITY }])
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validParticipants = participants.filter(
      (p) => p.name.trim() && p.department.trim(),
    )
    const validActionActivities = actionActivities
      .map((a) => ({
        task: a.task.trim(),
        assignedTo: a.assignedTo.trim(),
        dueDate: a.dueDate,
        status: a.status,
      }))
      .filter((a) => a.task && a.assignedTo)

    setSubmitting(true)
    try {
      const meeting = await addMeeting({
        ...form,
        topics,
        discussionPoints,
        participants: validParticipants,
        actionActivities: validActionActivities,
      })
      resetForm()
      onAdded?.(meeting)
      onClose()
    } catch {
      /* error surfaced via context */
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Meeting" className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="RSO meeting at SMS-3 Conference Room"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <Input
            label="Time"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="3:00 PM - 5:00 PM"
          />
        </div>
        <Input
          label="Venue"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="SMS-3 Conference Room"
          required
        />
        <Input
          label="Chairperson"
          name="chairPerson"
          value={form.chairPerson}
          onChange={handleChange}
          required
        />
        <Textarea
          label="MOM Summary"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Meeting summary and key MOM notes..."
        />

        <TopicsEditor topics={topics} onChange={setTopics} label="Topics" />
        <TopicsEditor topics={discussionPoints} onChange={setDiscussionPoints} label="Discussion Points" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Meeting Participants</p>
            <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={() => setPickerOpen(true)}>
              Add Participants from RSO Personnel
            </Button>
          </div>
          <ParticipantRowsEditor participants={participants} onChange={setParticipants} compact />
        </div>

        <ActionActivitiesEditor activities={actionActivities} onChange={setActionActivities} />

        <div className="flex justify-end gap-3 border-t border-slate-300 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Meeting'}
          </Button>
        </div>
      </form>

      <RsoParticipantPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        personnel={personnel}
        selectedPersonnelIds={participants
          .filter((p) => p.participantSource === 'rso_personnel' && p.personnelId)
          .map((p) => p.personnelId)}
        onApply={(selectedIds) => {
          const selectedSet = new Set(selectedIds)
          const picked = personnel
            .filter((p) => selectedSet.has(p.employeeId))
            .map((p) => personnelToParticipant(p))
          setParticipants((prev) => [...prev, ...picked])
          setPickerOpen(false)
        }}
      />
    </Modal>
  )
}
