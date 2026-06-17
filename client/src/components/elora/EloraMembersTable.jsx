import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'

export function EloraMembersTable({ members, onEdit, onDelete, onAdd }) {
  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle>Member Management</CardTitle>
        <Button className="ml-auto" onClick={onAdd}>
          Add Member
        </Button>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="enterprise-table-head-accent">
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Designation</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Role</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-industrial-600">
                    No ELORA members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 text-gray-700">{member.designation}</td>
                    <td className="px-4 py-3 text-gray-700">{member.email}</td>
                    <td className="px-4 py-3 text-gray-700">{member.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(member)}
                          className="rounded-lg p-2 text-industrial-600 transition-colors hover:bg-amber-50 hover:text-accent-amber"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(member)}
                          className="rounded-lg p-2 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}
