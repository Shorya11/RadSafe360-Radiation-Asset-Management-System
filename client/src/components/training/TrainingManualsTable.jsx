import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useTrainingManuals } from '../../context/TrainingManualsContext'

export function TrainingManualsTable({ onView, onEdit, onDelete }) {
  const { manuals } = useTrainingManuals()

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="enterprise-table-head-accent">
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Manual Name</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Category</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Upload File</th>
              <th className="sticky right-0 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {manuals.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-industrial-600">
                  No manuals uploaded yet.
                </td>
              </tr>
            ) : (
              manuals.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-slate-50">
                  <td
                    className="max-w-[240px] truncate px-4 py-3 font-medium text-gray-900"
                    title={m.manualName}
                  >
                    {m.manualName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.category}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-gray-500" title={m.fileName}>
                    {m.fileName || '—'}
                  </td>
                  <td className="sticky right-0 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ActionBtn icon={Eye} label="View" onClick={() => onView(m)} />
                      <ActionBtn icon={Pencil} label="Edit" onClick={() => onEdit(m)} />
                      <ActionBtn icon={Trash2} label="Delete" onClick={() => onDelete(m)} danger />
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
