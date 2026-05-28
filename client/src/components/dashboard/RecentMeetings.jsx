import { Calendar, Users } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { RECENT_MEETINGS } from '../../data/dashboardData'

const statusVariant = {
  completed: 'success',
  scheduled: 'default',
  urgent: 'danger',
}

export function RecentMeetings() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Meetings</CardTitle>
        <Calendar className="h-4 w-4 text-accent-amber" />
      </CardHeader>
      <CardBody className="space-y-3">
        {RECENT_MEETINGS.map((meeting) => (
          <div
            key={meeting.id}
            className="group enterprise-surface p-4 transition-all duration-200 hover:border-amber-300/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-900">
                  {meeting.title}
                </p>
                <p className="mt-1 text-xs text-industrial-600">
                  {meeting.date} · {meeting.time}
                </p>
              </div>
              <Badge variant={statusVariant[meeting.status]}>
                {meeting.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-industrial-600">
              <Users className="h-3.5 w-3.5 text-amber-500/60" />
              <span>{meeting.attendees} attendees</span>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
