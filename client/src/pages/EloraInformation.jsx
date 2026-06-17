import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { EloraInfoPanel } from '../components/elora/EloraInfoPanel'
import { useElora } from '../context/EloraContext'
import { useEloraMembers } from '../context/EloraMembersContext'
import { ApiStatus } from '../components/ui/ApiStatus'
import { EloraMembersTable } from '../components/elora/EloraMembersTable'
import { EloraMemberFormModal } from '../components/elora/EloraMemberFormModal'

export function EloraInformation() {
  const { information, updateInformation } = useElora()
  const { members, loading, error, fetchMembers, addMember, updateMember, deleteMember } = useEloraMembers()
  const [addOpen, setAddOpen] = useState(false)
  const [editMember, setEditMember] = useState(null)

  return (
    <div className="space-y-8">
      <PageHeader
        title="ELORA Information"
        description="Manage e-LORA portal credentials and access for radiation facility compliance."
      />

      <section aria-label="ELORA information">
        <EloraInfoPanel information={information} onSave={updateInformation} />
      </section>

      <ApiStatus loading={loading} error={error} onRetry={fetchMembers} />

      <section aria-label="ELORA member management">
        <EloraMembersTable
          members={members}
          onAdd={() => setAddOpen(true)}
          onEdit={setEditMember}
          onDelete={async (member) => {
            if (window.confirm(`Delete ELORA member ${member.name}?`)) {
              await deleteMember(member.id)
            }
          }}
        />
      </section>

      <EloraMemberFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={addMember}
        title="Add ELORA Member"
      />

      <EloraMemberFormModal
        open={Boolean(editMember)}
        onClose={() => setEditMember(null)}
        member={editMember}
        onSave={(form) => updateMember(editMember.id, form)}
        title="Edit ELORA Member"
      />
    </div>
  )
}
