import { Search } from 'lucide-react'
import clsx from 'clsx'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function MeetingFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-600" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search meetings, venue, chairperson..."
          className="enterprise-input w-full py-2.5 !pl-10 pr-4"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="enterprise-select"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {['cards', 'table'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all',
                viewMode === mode
                  ? 'bg-amber-50 text-accent-amber shadow-sm'
                  : 'text-industrial-600 hover:bg-slate-50 hover:text-industrial-800',
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
