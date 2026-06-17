import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, User, ClipboardList, Pencil, Save, X } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { AttendanceSummary } from '../components/meetings/AttendanceSummary'
import { MeetingTopicsCard } from '../components/meetings/MeetingTopicsCard'
import { DiscussionPointsCard } from '../components/meetings/DiscussionPointsCard'
import { ParticipantsTable } from '../components/meetings/ParticipantsTable'
import { ActionItemsTable } from '../components/meetings/ActionItemsTable'
import { MeetingParticipantsPanel } from '../components/meetings/MeetingParticipantsPanel'
import { useMeetings } from '../context/MeetingContext'
import { formatMeetingDate } from '../utils/meetingUtils'
import { ApiStatus } from '../components/ui/ApiStatus'

export function MeetingDetails() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const {
    loading,
    detailsLoading,
    error,
    fetchMeetings,
    loadMeetingDetails,
    getMeetingById,
    getMeetingDetails,
    updateAttendanceStatus,
    removeParticipant,
    updateMeeting,
    updateMeetingTopics,
    updateMeetingDiscussionPoints,
    addActionItem,
    updateActionItem,
    deleteActionItem,
  } = useMeetings()
  const [statusFilter, setStatusFilter] = useState('all')
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [draftDetails, setDraftDetails] = useState({
    title: '',
    date: '',
    timeLabel: '',
    venue: '',
    chairPerson: '',
    description: '',
  })

  useEffect(() => {
    if (meetingId) {
      loadMeetingDetails(meetingId)
    }
  }, [meetingId, loadMeetingDetails])

  const details = meetingId ? getMeetingDetails(meetingId) : null
  const meetingExists = meetingId ? Boolean(getMeetingById(meetingId)) : false

  if (loading || (detailsLoading && !details)) {
    return (
      <div className="space-y-4 py-16">
        <ApiStatus loading />
      </div>
    )
  }

  if (!details && !meetingExists && !detailsLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Meeting not found.</p>
        <Link to="/meetings" className="mt-4 inline-block text-accent-amber hover:underline">
          Back to meetings
        </Link>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="space-y-4 py-16">
        <ApiStatus loading={detailsLoading} error={error} onRetry={() => loadMeetingDetails(meetingId, { force: true })} />
      </div>
    )
  }

  const { meeting, attendance, actionItems } = details
  console.log("Meeting ID =", meeting?.id)

  const startEditDetails = () => {
    setDraftDetails({
      title: meeting.title ?? '',
      date: meeting.date ?? '',
      timeLabel: meeting.timeLabel ?? '',
      venue: meeting.venue ?? '',
      chairPerson: meeting.chairPerson ?? '',
      description: meeting.description ?? '',
    })
    setIsEditingDetails(true)
  }

  const cancelEditDetails = () => {
    setIsEditingDetails(false)
  }

  const saveEditDetails = async () => {
    try {
      await updateMeeting(meeting.id, {
        title: draftDetails.title,
        date: draftDetails.date,
        timeLabel: draftDetails.timeLabel,
        venue: draftDetails.venue,
        chairPerson: draftDetails.chairPerson,
        description: draftDetails.description,
      })
      setIsEditingDetails(false)
    } catch {
      /* error surfaced via context */
    }
  }
  const sendMom = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/meetings/${id}/send-mom`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()

      alert(data.message)
    } catch (error) {
      console.error(error)
      alert('Failed to send MOM')
    }
  }
  const handleDeleteMeeting = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meeting?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/meetings/${meetingId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      await fetchMeetings()

      navigate('/meetings', { replace: true })

      alert(data.message)
    } catch (error) {
      console.error(error)
      alert('Failed to delete meeting')
    }
  }



  return (
    <div className="space-y-8">
      <Link
        to="/meetings"
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-accent-amber"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Meetings
      </Link>

      <ApiStatus
        error={error}
        onRetry={() => {
          fetchMeetings()
          loadMeetingDetails(meetingId, { force: true })
        }}
      />

      <PageHeader
        title={meeting.title}
        description={meeting.description}
        action={
          <div className="flex items-center gap-2">
            <Badge variant={meeting.status === 'completed' ? 'success' : 'default'}>{meeting.status}</Badge>
            <Button
              variant="secondary"
              className="!py-1.5 !text-xs"
              onClick={() => sendMom(meeting.id)}
            >
              📧 Email MOM
            </Button>
            {!isEditingDetails ? (
              <>
                <Button
                  variant="secondary"
                  className="!py-1.5 !text-xs"
                  onClick={startEditDetails}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>

                <Button
                  className="!py-1.5 !text-xs"
                  onClick={handleDeleteMeeting}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className="!py-1.5 !text-xs" onClick={cancelEditDetails}>
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button className="!py-1.5 !text-xs" onClick={saveEditDetails}>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Meeting Info</CardTitle>
        </CardHeader>
        <CardBody className="space-y-5">
          {isEditingDetails ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={draftDetails.title}
                onChange={(e) => setDraftDetails((d) => ({ ...d, title: e.target.value }))}
              />
              <Input
                label="Venue"
                value={draftDetails.venue}
                onChange={(e) => setDraftDetails((d) => ({ ...d, venue: e.target.value }))}
              />
              <Input
                label="Date"
                type="date"
                value={draftDetails.date}
                onChange={(e) => setDraftDetails((d) => ({ ...d, date: e.target.value }))}
              />
              <Input
                label="Time"
                value={draftDetails.timeLabel}
                onChange={(e) => setDraftDetails((d) => ({ ...d, timeLabel: e.target.value }))}
                placeholder="3:00 PM - 5:00 PM"
              />
              <Input
                label="Chairperson"
                value={draftDetails.chairPerson}
                onChange={(e) => setDraftDetails((d) => ({ ...d, chairPerson: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="MOM Summary"
                  value={draftDetails.description}
                  onChange={(e) => setDraftDetails((d) => ({ ...d, description: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-accent-amber" />
                  <div>
                    <p className="text-xs text-industrial-600">Date & Time</p>
                    <p className="text-sm text-gray-900">
                      {formatMeetingDate(meeting.date)}
                      {meeting.timeLabel && ` · ${meeting.timeLabel}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-accent-amber" />
                  <div>
                    <p className="text-xs text-industrial-600">Venue</p>
                    <p className="text-sm text-gray-900">{meeting.venue}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="h-5 w-5 text-accent-amber" />
                  <div>
                    <p className="text-xs text-industrial-600">Chairperson</p>
                    <p className="text-sm text-gray-900">{meeting.chairPerson}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ClipboardList className="h-5 w-5 text-accent-amber" />
                  <div>
                    <p className="text-xs text-industrial-600">MOM Items</p>
                    <p className="text-sm text-gray-900">{actionItems.length} action items</p>
                  </div>
                </div>
              </div>

              <div className="enterprise-surface-muted p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-industrial-600">MOM Summary</p>
                    <p className="text-sm leading-relaxed text-industrial-700">
                      {meeting.description || '—'}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="!py-1.5 !text-xs"
                    onClick={startEditDetails}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <AttendanceSummary meeting={meeting} />

      <MeetingTopicsCard
        topics={meeting.topics}
        editable
        onSave={(next) => updateMeetingTopics(meeting.id, next)}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Participants & Attendance</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-industrial-600">Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enterprise-select"
            >
              <option value="all">All statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="resigned">Resigned</option>
            </select>
            <MeetingParticipantsPanel meetingId={meeting.id} />
            <Link
              to="/attendance"
              className="text-sm text-accent-amber hover:underline"
            >
              Attendance manager →
            </Link>
          </div>
        </div>
        <ParticipantsTable
          rows={attendance}
          editable
          statusFilter={statusFilter}
          onStatusChange={updateAttendanceStatus}
          onRemove={removeParticipant}
        />
      </section>

      <DiscussionPointsCard
        points={meeting.discussionPoints}
        editable
        onSave={(next) => updateMeetingDiscussionPoints(meeting.id, next)}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">MOM Action Items</h2>
        <ActionItemsTable
          items={actionItems}
          editable
          onAdd={(payload) => addActionItem(meeting.id, payload)}
          onUpdate={updateActionItem}
          onDelete={deleteActionItem}
        />
      </section>
    </div>
  )
}

