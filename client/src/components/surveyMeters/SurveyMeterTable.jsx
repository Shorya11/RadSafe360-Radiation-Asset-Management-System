import { useMemo, useState } from 'react'
import { Eye, Pencil, Trash2, Search } from 'lucide-react'
import { useSurveyMeters } from '../../context/SurveyMeterContext'
import { SURVEY_METER_STATUSES } from '../../data/surveyMeters'
import { SurveyMeterStatusBadge } from './SurveyMeterStatusBadge'

export function SurveyMeterTable({ onView, onEdit, onDelete }) {
  const { surveyMeters } = useSurveyMeters()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return surveyMeters.filter((m) => {
      if (statusFilter !== 'all' && m.functionalStatus !== statusFilter) return false
      if (!q) return true
      return (
        m.surveyMeterName.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q) ||
        m.make.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        m.serialNumber.toLowerCase().includes(q) ||
        m.detectorType.toLowerCase().includes(q) ||
        m.radiationType.toLowerCase().includes(q) ||
        m.calibrationLab.toLowerCase().includes(q)
      )
    })
  }, [surveyMeters, search, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meter, serial, supplier, model..."
            className="enterprise-input w-full py-2.5 pl-10 pr-4"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">All statuses</option>
          {SURVEY_METER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <p className="text-sm text-industrial-600 lg:ml-auto">
          {filtered.length}
          {' '}
          of
          {' '}
          {surveyMeters.length}
          {' '}
          meters
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1800px] text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="enterprise-table-head-accent">
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Survey Meter Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Supplier</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Date of Procurement</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Make</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Model</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Serial Number</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Detector Type</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Detector Volume</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Radiation Type</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Functional Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Calibration Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Calibration Till Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Calibration Lab</th>
                <th className="sticky right-0 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-12 text-center text-industrial-600">
                    No survey meters match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="transition-colors hover:bg-slate-50">
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium text-gray-900" title={m.surveyMeterName}>
                      {m.surveyMeterName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.supplier}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{m.dateOfProcurement}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.make}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.model}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-industrial-600">{m.serialNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.detectorType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{m.detectorVolume}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{m.radiationType}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <SurveyMeterStatusBadge status={m.functionalStatus} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{m.calibrationDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{m.calibrationTillDate}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-500" title={m.calibrationLab}>
                      {m.calibrationLab}
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
