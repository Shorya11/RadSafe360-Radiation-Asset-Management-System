import { PageHeader } from './PageHeader'
import { Card, CardBody } from './Card'

export function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <CardBody className="flex flex-col items-center justify-center py-16 text-center">
          {Icon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-accent-amber">
              <Icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
          )}
          <p className="text-gray-500">
            This section is ready for your {title.toLowerCase()} module.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
