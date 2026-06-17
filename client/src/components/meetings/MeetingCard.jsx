import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, User, Eye } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { AttendanceRateBadge } from './AttendanceRateBadge'
import { formatMeetingDate } from '../../utils/meetingUtils'
import { Button } from '../ui/Button'

export function MeetingCard({ meeting }) {
  const computedStatus =
    new Date(meeting.date) < new Date()
      ? 'completed'
      : 'scheduled'
  return (
    <Card className="flex flex-col">
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
              {meeting.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-industrial-600">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500/70" />
                {formatMeetingDate(meeting.date)}
                {meeting.timeLabel && ` · ${meeting.timeLabel}`}
              </span>
            </div>
          </div>
          <AttendanceRateBadge rate={meeting.attendanceRate} />
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-amber-500/60" />
            {meeting.venue}
          </p>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-amber-500/60" />
            <span className="truncate">{meeting.chairPerson}</span>
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-amber-500/60" />
            {meeting.participantCount} participants · {meeting.presentCount} present
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
          <Badge variant={computedStatus === 'completed' ? 'success' : 'default'}>
            {computedStatus}
          </Badge>
          <Link to={`/meetings/${meeting.id}`}>
            <Button variant="secondary" className="!py-2 !text-xs">
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
