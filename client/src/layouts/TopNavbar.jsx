import { Bell, Menu, Search, User } from 'lucide-react'

export function TopNavbar({ onMenuClick, title = 'Dashboard' }) {
  return (
    <header className="enterprise-navbar sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-industrial-600 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:text-gray-900 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-accent-amber">
            Industrial Ops
          </p>
          <h2 className="truncate text-lg font-bold text-gray-900">{title}</h2>
        </div>
      </div>

      <div className="hidden max-w-md flex-1 px-4 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-industrial-500" />
          <input
            type="search"
            placeholder="Search gauges, meetings, reports..."
           className="enterprise-input w-full py-2.5 !pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-industrial-600 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-amber ring-2 ring-white" />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50 sm:px-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-accent-amber">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-semibold text-gray-900 sm:inline">Admin</span>
        </button>
      </div>
    </header>
  )
}
