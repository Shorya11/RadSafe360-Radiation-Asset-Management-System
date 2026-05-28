import { Badge } from '../ui/Badge'
import { attendanceRateVariant } from '../../utils/meetingUtils'

export function AttendanceRateBadge({ rate }) {
  return <Badge variant={attendanceRateVariant(rate)}>{rate}%</Badge>
}
