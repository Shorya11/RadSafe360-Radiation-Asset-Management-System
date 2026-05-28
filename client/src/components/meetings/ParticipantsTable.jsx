import { Trash2 } from 'lucide-react'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { ATTENDANCE_STATUS_META } from '../../utils/meetingUtils'

const STATUS_OPTIONS = ['present', 'absent', 'leave', 'resigned']

export function ParticipantsTable({
  rows,
  editable = false,
  onStatusChange,
  onRemove,
  statusFilter = 'all',
}) {
  const filtered =
    statusFilter === 'all'
      ? rows
      : rows.filter((r) => r.status === statusFilter)

  const colSpan = onRemove ? 8 : 7

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="enterprise-table-head-accent">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Designation</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Attendance</th>
              {onRemove && <th className="px-4 py-3 font-semibold" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-8 text-center text-industrial-600">
                  No participants match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-industrial-600">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-500">{row.department || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{row.designation || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-gray-500">
                    {row.phoneNumber || '—'}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-industrial-600">
                    {row.email || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {editable ? (
                      <select
                        value={row.status}
                        onChange={(e) => onStatusChange(row.id, e.target.value)}
                        className="enterprise-select !rounded-lg !px-2 !py-1.5"
                        aria-label={`Attendance for ${row.name}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {ATTENDANCE_STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <AttendanceStatusBadge status={row.status} />
                    )}
                  </td>
                  {onRemove && (
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onRemove(row.id)}
                        className="rounded-lg p-2 text-industrial-600 transition-colors hover:bg-red-50 hover:text-accent-red"
                        aria-label={`Remove ${row.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
