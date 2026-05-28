import { Badge } from '../ui/Badge'
import { ATTENDANCE_STATUS_META } from '../../utils/meetingUtils'

export function AttendanceStatusBadge({ status }) {
  const meta = ATTENDANCE_STATUS_META[status] ?? ATTENDANCE_STATUS_META.present
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}
