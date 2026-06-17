import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ParticipantRowsEditor } from './ParticipantRowsEditor'
import { RsoParticipantPickerModal } from './RsoParticipantPickerModal'
import { EMPTY_PARTICIPANT_ROW } from '../../data/attendance'
import { personnelToParticipant } from '../../data/attendance'
import { useMeetings } from '../../context/MeetingContext'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'

export function MeetingParticipantsPanel({ meetingId }) {
  const { addParticipant, getAttendanceForMeeting } = useMeetings()
  const { personnel } = useRsoPersonnel()
  const [open, setOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [rows, setRows] = useState([{ ...EMPTY_PARTICIPANT_ROW }])

  const existingPersonnelIds = getAttendanceForMeeting(meetingId)
    .filter((r) => r.participantSource === 'rso_personnel' && r.personnelId)
    .map((r) => r.personnelId)

  const handleAdd = async (e) => {
    e.preventDefault()
    const valid = rows.filter((r) => r.name.trim() && r.department.trim())
    try {
      for (const row of valid) {
        await addParticipant(meetingId, row)
      }
      setRows([{ ...EMPTY_PARTICIPANT_ROW }])
      setOpen(false)
    } catch {
      /* error surfaced via context */
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" className="!py-2 !text-xs" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Add participant
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Participants" className="max-w-2xl">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={() => setPickerOpen(true)}>
              Add Participants from RSO Personnel
            </Button>
          </div>
          <ParticipantRowsEditor participants={rows} onChange={setRows} compact />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to meeting</Button>
          </div>
        </form>
      </Modal>

      <RsoParticipantPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        personnel={personnel}
        selectedPersonnelIds={existingPersonnelIds}
        onApply={(selectedIds) => {
          const selected = personnel
            .filter((p) => selectedIds.includes(p.employeeId))
            .map((p) => personnelToParticipant(p))
          selected.forEach((row) => addParticipant(meetingId, row))
          setPickerOpen(false)
        }}
      />
    </>
  )
}
