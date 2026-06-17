import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Users } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { ParticipantsTable } from '../components/meetings/ParticipantsTable'
import { MeetingParticipantsPanel } from '../components/meetings/MeetingParticipantsPanel'
import { MeetingTopicsCard } from '../components/meetings/MeetingTopicsCard'
import { AttendanceRateBadge } from '../components/meetings/AttendanceRateBadge'
import { useMeetings } from '../context/MeetingContext'
import { formatMeetingDate } from '../utils/meetingUtils'
import { ApiStatus } from '../components/ui/ApiStatus'
import clsx from 'clsx'

export function Attendance() {
  const {
    meetings,
    loading,
    error,
    fetchMeetings,
    detailsLoading,
    loadMeetingDetails,
    getMeetingDetails,
    updateAttendanceStatus,
    removeParticipant,
  } = useMeetings()
  const sortedMeetings = useMemo(
    () => [...meetings].sort((a, b) => b.date.localeCompare(a.date)),
    [meetings],
  )

  const [selectedMeetingId, setSelectedMeetingId] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!selectedMeetingId && sortedMeetings[0]) {
      setSelectedMeetingId(sortedMeetings[0].id)
    }
  }, [sortedMeetings, selectedMeetingId])

  useEffect(() => {
    if (selectedMeetingId) {
      loadMeetingDetails(selectedMeetingId)
    }
  }, [selectedMeetingId, loadMeetingDetails])

  const details = selectedMeetingId ? getMeetingDetails(selectedMeetingId) : null
  const meeting = details?.meeting
  const attendance = details?.attendance ?? []

  const statusCounts = useMemo(() => {
    const c = { present: 0, absent: 0, leave: 0, resigned: 0 }
    for (const a of attendance) c[a.status] = (c[a.status] ?? 0) + 1
    return c
  }, [attendance])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendance Management"
        description="Add or remove participants, mark attendance, and review meeting topics."
      />

      <ApiStatus loading={loading} error={error} onRetry={fetchMeetings} />

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Meeting</CardTitle>
            <Filter className="h-4 w-4 text-accent-amber" />
          </CardHeader>
          <CardBody className="max-h-[420px] space-y-2 overflow-y-auto">
            {sortedMeetings.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMeetingId(m.id)}
                className={clsx(
                  'w-full rounded-xl border p-3 text-left transition-all duration-200',
                  selectedMeetingId === m.id
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-slate-200 hover:border-amber-500/20 hover:bg-slate-50',
                )}
              >
                <p className="line-clamp-2 text-sm font-medium text-gray-900">{m.title}</p>
                <p className="mt-1 text-xs text-industrial-600">{formatMeetingDate(m.date)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-industrial-600">{m.participantCount} people</span>
                  <AttendanceRateBadge rate={m.attendanceRate} />
                </div>
              </button>
            ))}
            {sortedMeetings.length === 0 && (
              <p className="text-sm text-industrial-600">No meetings yet.</p>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          {meeting ? (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{meeting.title}</h2>
                  <p className="text-sm text-industrial-600">
                    {formatMeetingDate(meeting.date)} · {meeting.venue}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <MeetingParticipantsPanel meetingId={meeting.id} />
                  <Link
                    to={`/meetings/${meeting.id}`}
                    className="text-sm text-accent-amber hover:underline"
                  >
                    Full meeting details →
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Present"
                  value={String(statusCounts.present)}
                  icon={Users}
                />

                <StatCard
                  title="Absent"
                  value={String(statusCounts.absent)}
                  changeType="down"
                />

                <StatCard
                  title="Leave"
                  value={String(statusCounts.leave)}
                  changeType="neutral"
                />

                <StatCard
                  title="Attendance Rate"
                  value={`${meeting.attendanceRate}%`}
                  change="Live from recorded statuses"
                  changeType="up"
                />
              </div>

              <MeetingTopicsCard topics={meeting.topics} />

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-industrial-600">Filter by status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="enterprise-select"
                >
                  <option value="all">All</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                  <option value="resigned">Resigned</option>
                 
                </select>
              </div>

              <ParticipantsTable
                rows={attendance}
                editable
                statusFilter={statusFilter}
                onStatusChange={updateAttendanceStatus}
                onRemove={removeParticipant}
              />
            </>
          ) : (
            <Card>
              <CardBody className="py-16 text-center text-industrial-600">
                Select a meeting to manage attendance, or create one from the Meetings page.
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
