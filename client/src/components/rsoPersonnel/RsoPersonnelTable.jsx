import { useMemo, useState } from 'react'
import { Eye, Pencil, Trash2, Search, Upload } from 'lucide-react'
import { useRsoPersonnel } from '../../context/RsoPersonnelContext'
import { PERSONNEL_DEPARTMENTS } from '../../data/rsoPersonnel'
import { RsoPersonnelStatusBadge } from './RsoPersonnelStatusBadge'

export function RsoPersonnelTable({ onView, onEdit, onDelete, onUploadCertificate }) {
  const { personnel } = useRsoPersonnel()
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return personnel.filter((p) => {
      if (departmentFilter !== 'all' && p.department !== departmentFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (!q) return true
      return (
        p.employeeId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.caseFileNumber.toLowerCase().includes(q) ||
        p.documentNumber.toLowerCase().includes(q)
      )
    })
  }, [personnel, search, departmentFilter, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, name, email, case file..."
            className="enterprise-input w-full py-2.5 pl-10 pr-4"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">All departments</option>
          {PERSONNEL_DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">All statuses</option>
          <option value="Valid">Valid</option>
          <option value="Expired">Expired</option>
        </select>
        <p className="text-sm text-industrial-600 lg:ml-auto">
          {filtered.length} of {personnel.length} personnel
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1650px] text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="enterprise-table-head-accent">
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Employee ID</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Department</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Phone</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Case File Number</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Document Number</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Date of Issue</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Valid Till</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Upload Certificate</th>
                <th className="sticky right-0 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-industrial-600">
                    No personnel match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.employeeId} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-accent-amber">{p.employeeId}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{p.department}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{p.phone}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-600" title={p.email}>{p.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{p.caseFileNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{p.documentNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{p.dateOfIssue}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{p.validTill}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <RsoPersonnelStatusBadge status={p.status} validTill={p.validTill} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onUploadCertificate(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-industrial-700 transition-colors hover:border-amber-300 hover:bg-amber-50"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {p.certificateName ? 'Replace' : 'Upload'}
                      </button>
                    </td>
                    <td className="sticky right-0 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionBtn icon={Eye} label="View" onClick={() => onView(p)} />
                        <ActionBtn icon={Pencil} label="Edit" onClick={() => onEdit(p)} />
                        <ActionBtn icon={Trash2} label="Delete" onClick={() => onDelete(p)} danger />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
