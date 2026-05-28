import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { RsoPersonnelKpiCards } from '../components/rsoPersonnel/RsoPersonnelKpiCards'
import { RsoPersonnelTable } from '../components/rsoPersonnel/RsoPersonnelTable'
import { RsoPersonnelViewModal } from '../components/rsoPersonnel/RsoPersonnelViewModal'
import { RsoPersonnelFormModal } from '../components/rsoPersonnel/RsoPersonnelFormModal'
import { DeleteRsoPersonnelModal } from '../components/rsoPersonnel/DeleteRsoPersonnelModal'
import { UploadCertificateModal } from '../components/rsoPersonnel/UploadCertificateModal'
import { useRsoPersonnel } from '../context/RsoPersonnelContext'
import { exportRsoPersonnelCsv } from '../utils/rsoPersonnelUtils'

export function RsoPersonnel() {
  const {
    personnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    updateCertificateName,
  } = useRsoPersonnel()

  const [viewPersonnel, setViewPersonnel] = useState(null)
  const [editPersonnel, setEditPersonnel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploadTarget, setUploadTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-8">
      <PageHeader
        title="RSO Personnel"
        description="Master participant database for meetings and attendance with certification validity tracking."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => exportRsoPersonnelCsv(personnel)}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Personnel
            </Button>
          </div>
        }
      />

      <section aria-label="RSO personnel KPIs">
        <RsoPersonnelKpiCards />
      </section>

      <section aria-label="RSO personnel database">
        <h2 className="section-heading mb-4">Master Personnel Database</h2>
        <RsoPersonnelTable
          onView={setViewPersonnel}
          onEdit={setEditPersonnel}
          onDelete={setDeleteTarget}
          onUploadCertificate={setUploadTarget}
        />
      </section>

      <RsoPersonnelViewModal
        personnel={viewPersonnel}
        open={Boolean(viewPersonnel)}
        onClose={() => setViewPersonnel(null)}
      />

      <RsoPersonnelFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Personnel"
        onSave={(form) => addPersonnel(form)}
      />

      <RsoPersonnelFormModal
        open={Boolean(editPersonnel)}
        onClose={() => setEditPersonnel(null)}
        personnel={editPersonnel}
        title="Edit Personnel"
        onSave={(form) => updatePersonnel(editPersonnel.employeeId, form)}
      />

      <DeleteRsoPersonnelModal
        personnel={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deletePersonnel}
      />

      <UploadCertificateModal
        personnel={uploadTarget}
        open={Boolean(uploadTarget)}
        onClose={() => setUploadTarget(null)}
        onSave={(certificateName) => {
          if (!uploadTarget || !certificateName) return
          updateCertificateName(uploadTarget.employeeId, certificateName)
        }}
      />
    </div>
  )
}
