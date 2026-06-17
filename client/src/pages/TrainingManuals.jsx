import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { DocumentPreviewModal } from '../components/ui/DocumentPreviewModal'
import { TrainingManualsTable } from '../components/training/TrainingManualsTable'
import { TrainingManualFormModal } from '../components/training/TrainingManualFormModal'
import { DeleteTrainingManualModal } from '../components/training/DeleteTrainingManualModal'
import { useTrainingManuals } from '../context/TrainingManualsContext'

export function TrainingManuals() {
  const { addManual, updateManual, deleteManual } = useTrainingManuals()

  const [previewManual, setPreviewManual] = useState(null)
  const [editManual, setEditManual] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Training & Manuals"
        description="Training materials, SOPs, and radiation safety references for SMS-3 operations."
        action={
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="h-4 w-4" />
            Upload Manual
          </Button>
        }
      />

      <section aria-label="Training and manuals">
        <h2 className="section-heading mb-4">Manual Library</h2>
        <TrainingManualsTable
          onView={setPreviewManual}
          onEdit={setEditManual}
          onDelete={setDeleteTarget}
        />
      </section>

      <DocumentPreviewModal
        open={Boolean(previewManual)}
        onClose={() => setPreviewManual(null)}
        document={previewManual}
        title={previewManual?.fileName || previewManual?.manualName}
      />

      <TrainingManualFormModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Manual"
        onSave={(form) => addManual(form)}
      />

      <TrainingManualFormModal
        open={Boolean(editManual)}
        onClose={() => setEditManual(null)}
        manual={editManual}
        title="Edit Manual"
        onSave={(form) => updateManual(editManual.id, form)}
      />

      <DeleteTrainingManualModal
        manual={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteManual}
      />
    </div>
  )
}
