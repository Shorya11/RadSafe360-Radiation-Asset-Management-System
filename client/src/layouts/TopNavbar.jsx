import { Menu, User } from 'lucide-react'

const BRAND_NAME = 'JINDAL STEEL'
const DEFAULT_SUBTITLE =
  'Industrial Radiation Safety Monitoring and Compliance Management System'

export function TopNavbar({ onMenuClick, title = 'Radiation Safety Dashboard' }) {
  return (
    <header className="enterprise-navbar sticky top-0 z-30 shrink-0 border-b border-slate-200/80">
      <div className="flex h-auto min-h-16 flex-col justify-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <button
            type="button"
            onClick={onMenuClick}
            className="mt-0.5 rounded-xl border border-slate-200 bg-white p-2.5 text-industrial-600 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:text-gray-900 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-accent-amber sm:text-xs">
              {BRAND_NAME}
            </p>
            <h2 className="truncate text-lg font-bold leading-tight text-gray-900 sm:text-xl">
              {title}
            </h2>
            <p className="mt-1 hidden max-w-2xl text-xs leading-relaxed text-industrial-600 md:block">
              {DEFAULT_SUBTITLE}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 sm:self-center">
          <div
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm sm:px-3"
            aria-label="Signed in as SMS-3 Team"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-accent-amber">
              <User className="h-4 w-4" />
            </div>
            
          </div>
        </div>
      </div>
      <p className="border-t border-slate-100 px-4 py-2 text-xs leading-relaxed text-industrial-600 md:hidden">
        {DEFAULT_SUBTITLE}
      </p>
    </header>
  )
}
