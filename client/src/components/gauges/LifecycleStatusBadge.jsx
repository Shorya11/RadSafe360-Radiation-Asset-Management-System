import { Badge } from '../ui/Badge'
import { getLifecycleStatusVariant } from '../../utils/gaugeUtils'

export function LifecycleStatusBadge({ status }) {
  return <Badge variant={getLifecycleStatusVariant(status)}>{status || 'Expired'}</Badge>
}
