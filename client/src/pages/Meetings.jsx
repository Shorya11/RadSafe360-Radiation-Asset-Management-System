import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { MeetingFilters } from '../components/meetings/MeetingFilters'
import { MeetingCard } from '../components/meetings/MeetingCard'
import { MeetingsTable } from '../components/meetings/MeetingsTable'
import { MeetingAnalytics } from '../components/meetings/MeetingAnalytics'
import { AddMeetingModal } from '../components/meetings/AddMeetingModal'
import { useMeetings } from '../context/MeetingContext'
import { ApiStatus } from '../components/ui/ApiStatus'

export function Meetings() {
  const { meetings, loading, error, fetchMeetings } = useMeetings()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('cards')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return meetings
      .filter((m) => statusFilter === 'all' || m.status === statusFilter)
      .filter(
        (m) =>
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.chairPerson.toLowerCase().includes(q) ||
          m.date.includes(q),
      )
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [meetings, search, statusFilter])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Meeting Management"
        description="RSO meetings, attendance tracking, and minutes of meeting (MOM) action items."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Meeting
          </Button>
        }
      />

      <ApiStatus loading={loading} error={error} onRetry={fetchMeetings} />

      <MeetingFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <section>
        <p className="mb-4 text-sm text-industrial-600">
          {filtered.length} meeting{filtered.length !== 1 ? 's' : ''}
        </p>
        {viewMode === 'cards' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        ) : (
          <MeetingsTable meetings={filtered} />
        )}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-industrial-600">No meetings match your filters.</p>
        )}
      </section>

      <MeetingAnalytics />

      <AddMeetingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
