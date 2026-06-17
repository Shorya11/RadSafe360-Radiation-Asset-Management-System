import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'

export function RsoCertifiedPersonnelCard() {
  const { personnel } = useRsoPersonnel()

  const certifiedPersonnel = personnel
    .filter((p) => p.status === 'Valid')
    .slice(0, 5)

  return (
    <Card glass={true} hover={true}>
      <CardHeader>
        <CardTitle>RSO Certified Personnel</CardTitle>
      </CardHeader>

      <CardBody>
        <div className="space-y-3">
          {certifiedPersonnel.map((person) => (
            <div
              key={person.employeeId}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-semibold text-gray-900">
                {person.name}
              </p>

              <p className="text-xs text-slate-500">
                {person.employeeId}
              </p>

              <p className="text-xs text-slate-500">
                {person.department}
              </p>

              <p className="text-xs text-amber-700">
                Valid Till: {person.validTill}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}