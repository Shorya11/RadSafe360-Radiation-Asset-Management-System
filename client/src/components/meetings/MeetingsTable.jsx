import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { AttendanceRateBadge } from './AttendanceRateBadge'
import { formatMeetingDate } from '../../utils/meetingUtils'
export function MeetingsTable({ meetings }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="enterprise-table-head">
              <th className="px-5 py-3 font-medium">Meeting</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Venue</th>
              <th className="px-5 py-3 font-medium">Chair</th>
              <th className="px-5 py-3 font-medium">Participants</th>
              <th className="px-5 py-3 font-medium">Attendance</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {meetings.map((m) => (
              <tr
                key={m.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="max-w-xs px-5 py-4">
                  <p className="font-medium text-gray-900">{m.title}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  {formatMeetingDate(m.date)}
                </td>
                <td className="px-5 py-4 text-gray-500">{m.venue}</td>
                <td className="max-w-[140px] truncate px-5 py-4 text-gray-500">
                  {m.chairPerson}
                </td>
                <td className="px-5 py-4 font-mono text-gray-700">
                  {m.participantCount}
                </td>
                <td className="px-5 py-4">
                  <AttendanceRateBadge rate={m.attendanceRate} />
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={m.status === 'completed' ? 'success' : 'default'}
                  >
                    {m.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Link
                    to={`/meetings/${m.id}`}
                    className="inline-flex rounded-lg p-2 text-gray-500 transition-colors hover:bg-slate-100 hover:text-accent-amber"
                    aria-label="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
