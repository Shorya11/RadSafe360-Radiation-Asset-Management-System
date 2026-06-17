import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useReports } from '../../context/ReportsContext'

export function ReportsTable({ onView, onEdit, onDelete }) {
  const { reports } = useReports()

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="enterprise-table-head-accent">
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Department</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Contact Name</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Report Type</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Upload Document</th>
              <th className="sticky right-0 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-industrial-600">
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{r.department}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{r.contactName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{r.reportType}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-gray-500" title={r.fileName}>
                    {r.fileName || '—'}
                  </td>
                  <td className="sticky right-0 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ActionBtn icon={Eye} label="View" onClick={() => onView(r)} />
                      <ActionBtn icon={Pencil} label="Edit" onClick={() => onEdit(r)} />
                      <ActionBtn icon={Trash2} label="Delete" onClick={() => onDelete(r)} danger />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${
        danger
          ? 'text-industrial-600 hover:bg-red-50 hover:text-accent-red'
          : 'text-industrial-600 hover:bg-amber-50 hover:text-accent-amber'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
