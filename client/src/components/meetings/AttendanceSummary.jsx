import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { AttendanceRateBadge } from './AttendanceRateBadge'

export function AttendanceSummary({ meeting }) {
  const items = [
    { label: 'Present', count: meeting.presentCount, status: 'present' },
    { label: 'Absent', count: meeting.absentCount, status: 'absent' },
    { label: 'Leave', count: meeting.leaveCount, status: 'leave' },
    { label: 'Resigned', count: meeting.resignedCount, status: 'resigned' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <AttendanceRateBadge rate={meeting.attendanceRate} />
      </CardHeader>
      <CardBody>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map(({ label, count, status }) => (
            <div
              key={status}
              className="enterprise-surface p-4 text-center"
            >
              <p className="font-mono text-2xl font-semibold text-gray-900">{count}</p>
              <div className="mt-2 flex justify-center">
                <AttendanceStatusBadge status={status} />
              </div>
              <p className="mt-1 text-xs text-industrial-600">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-industrial-600">
          {meeting.participantCount} total participants · Attendance rate based on
          recorded employee attendance statuses
        </p>
      </CardBody>
    </Card>
  )
}
