import { NavLink } from 'react-router-dom'
import { Factory, X } from 'lucide-react'
import clsx from 'clsx'
import { NAV_ITEMS } from '../data/navigation'

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={clsx(
          'enterprise-sidebar fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col transition-transform duration-300 ease-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 glow-amber">
              <Factory className="h-5 w-5 text-accent-amber" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Industria</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-industrial-600">
                Gauge Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-industrial-500 transition-colors hover:bg-slate-100 hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive ? 'nav-item-active' : 'nav-item-inactive',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'h-5 w-5 shrink-0 transition-colors duration-200',
                      isActive ? 'text-accent-amber' : 'text-industrial-500 group-hover:text-industrial-700',
                    )}
                    strokeWidth={1.75}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-accent-amber shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="enterprise-surface rounded-xl p-3.5">
            <p className="text-xs font-semibold text-industrial-700">System Status</p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-700">All systems operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
