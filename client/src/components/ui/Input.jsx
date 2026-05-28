import clsx from 'clsx'

export function Input({ label, className, id, ...props }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-industrial-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx('enterprise-input', className)}
        {...props}
      />
    </div>
  )
}

export function Textarea({ label, className, id, ...props }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-industrial-600">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={3}
        className={clsx(
          'w-full min-h-[120px] resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-industrial-500 transition-all duration-200 focus:border-accent-amber focus:outline-none focus:ring-2 focus:ring-amber-500/15',
          className,
        )}
        {...props}
      />
    </div>
  )
}
