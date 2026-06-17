import { useMemo, useState } from 'react'
import { Eye, Pencil, Trash2, Download, Search, Upload } from 'lucide-react'
import { useGauges } from '../../context/GaugeContext'
import { GaugeStatusBadge } from './GaugeStatusBadge'
import { LifecycleStatusBadge } from './LifecycleStatusBadge'
import { GAUGE_PLANTS, GAUGE_STATUSES } from '../../data/gauges'

export function GaugeTable({ onView, onEdit, onDelete, onDownload, onUpload }) {
  const { gauges } = useGauges()
  const [search, setSearch] = useState('')
  const [plantFilter, setPlantFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
   const plantOptions = [...new Set(gauges.map((g) => g.plant).filter(Boolean))]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return gauges.filter((g) => {
      if (plantFilter !== 'all' && g.plant !== plantFilter) return false
      if (statusFilter !== 'all' && g.status !== statusFilter) return false
      if (!q) return true
      return (
        g.id.toLowerCase().includes(q) ||
        g.serialNumber.toLowerCase().includes(q) ||
        g.make.toLowerCase().includes(q) ||
        g.model.toLowerCase().includes(q) ||
        g.source.toLowerCase().includes(q) ||
        g.plant.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.contactPerson.toLowerCase().includes(q)
      )
    })
  }, [gauges, search, plantFilter, statusFilter])




  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gauges..."
            className="enterprise-input w-full py-2.5 !pl-14 pr-4"
          />
        </div>
        <select
          value={plantFilter}
          onChange={(e) => setPlantFilter(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">All plants</option>
          {plantOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">All statuses</option>
          {GAUGE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="text-sm text-industrial-600 lg:ml-auto">
          {filtered.length} of {gauges.length} gauges
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[2200px] text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="enterprise-table-head-accent">
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Gauge ID</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Serial Number</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Make</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Model</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Source</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Quantity</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Installation Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Source Test Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Activity</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Purchase Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Lifecycle (Years)</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Expiry Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Remaining Life</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Lifecycle Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Location</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Plant</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">NOC Number</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Contact</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Calibration Due Date</th>
                <th className="sticky right-0 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={23} className="px-4 py-12 text-center text-industrial-600">
                    No gauges match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-accent-amber">
                      {g.id}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-gray-500" title={g.serialNumber}>
                      {g.serialNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{g.make}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{g.model}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{g.source}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{g.quantity}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.installDate || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.sourceTestDate}</td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-gray-500">{g.activity}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.purchaseDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.lifecycleYears}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.expiryDate || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.remainingLife || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <LifecycleStatusBadge status={g.lifecycleStatus} />
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-gray-500">{g.location}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{g.plant}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <GaugeStatusBadge status={g.status} />
                    </td>
                    <td className="max-w-[120px] truncate px-4 py-3 text-industrial-600" title={g.nocNumber}>
                      {g.nocNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.contactPerson}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{g.calibrationDueDate}</td>
                    <td className="sticky right-0 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionBtn icon={Eye} label="View" onClick={() => onView(g)} />
                        <ActionBtn icon={Pencil} label="Edit" onClick={() => onEdit(g)} />
                        <ActionBtn icon={Trash2} label="Delete" onClick={() => onDelete(g)} danger />
                        <ActionBtn icon={Upload} label="Upload" onClick={() => onUpload(g)} />
                        <ActionBtn icon={Download} label="Download" onClick={() => onDownload(g)} />
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
