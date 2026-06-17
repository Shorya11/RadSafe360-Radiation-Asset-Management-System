import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { NAV_ITEMS } from '../data/navigation'
import logo from '../assets/logo.png'

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
          'enterprise-sidebar fixed left-0 top-0 z-50 flex h-screen w-[17.5rem] flex-col transition-transform duration-300 ease-out lg:fixed lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >

        <div className="shrink-0 border-b border-slate-200 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <img
                src={logo}
                alt="Jindal Steel and Power"
                className="h-12 w-auto max-w-full object-contain object-left"
              />
              <p className="mt-3 text-[11px] font-bold uppercase leading-snug tracking-wide text-gray-900">
                JINDAL STEEL
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-amber">
                RADIATION SAFETY
              </p>
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


      </aside>
    </>
  )
}
