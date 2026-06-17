import { Button } from './Button'

export function ApiStatus({ loading, error, onRetry, className = '' }) {
  if (loading) {
    return (
      <p className={`text-sm text-industrial-600 ${className}`} role="status">
        Loading data…
      </p>
    )
  }

  if (!error) return null

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 ${className}`}
      role="alert"
    >
      <span>{error}</span>
      {onRetry && (
        <Button type="button" variant="secondary" className="!py-1.5 !text-xs" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
