import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardBody, CardTitle } from '../components/ui/Card'

export function Settings() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Application preferences and facility configuration for the radiation safety program."
      />

      <Card>
        <CardBody className="space-y-2">
          <CardTitle>General</CardTitle>
          <p className="text-sm leading-relaxed text-industrial-600">
            User roles, notifications, and plant zone configuration are managed by your system
            administrator. Contact the SMS-3 radiation safety team for changes to facility
            settings or integrations.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
