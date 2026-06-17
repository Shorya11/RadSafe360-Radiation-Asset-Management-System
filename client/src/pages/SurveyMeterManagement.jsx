import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { SurveyMeterKpiCards } from '../components/surveyMeters/SurveyMeterKpiCards'
import { SurveyMeterTable } from '../components/surveyMeters/SurveyMeterTable'
import { SurveyMeterViewModal } from '../components/surveyMeters/SurveyMeterViewModal'
import { SurveyMeterFormModal } from '../components/surveyMeters/SurveyMeterFormModal'
import { DeleteSurveyMeterModal } from '../components/surveyMeters/DeleteSurveyMeterModal'
import { useSurveyMeters } from '../context/SurveyMeterContext'
import { exportSurveyMetersCsv } from '../utils/surveyMeterUtils'
import { ApiStatus } from '../components/ui/ApiStatus'
import { DocumentPreviewModal } from '../components/ui/DocumentPreviewModal'
import { downloadDocument } from '../utils/fileUtils'

export function SurveyMeterManagement() {
  const {
    surveyMeters,
    loading,
    error,
    fetchSurveyMeters,
    addSurveyMeter,
    updateSurveyMeter,
    deleteSurveyMeter,
    uploadSurveyMeterDocument,
  } = useSurveyMeters()

  const [viewMeter, setViewMeter] = useState(null)
  const [editMeter, setEditMeter] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState(null)

  const triggerFilePicker = (onSelect) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.png,.jpg,.jpeg,.gif,.webp'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onSelect(file)
    }
    input.click()
  }

  const handleUpload = (meter) => {
    triggerFilePicker(async (file) => {
      await uploadSurveyMeterDocument(meter.id, file)
    })
  }

  const handleDownload = (meter) => {
    const firstDocument = meter.documents?.[0]
    if (firstDocument) downloadDocument(firstDocument)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Survey Meter"
        description="Track procurement, calibration, and operational status of radiation survey meters."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => exportSurveyMetersCsv(surveyMeters)}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Meter
            </Button>
          </div>
        }
      />

      <ApiStatus loading={loading} error={error} onRetry={fetchSurveyMeters} />

      <section aria-label="Survey meter KPIs">
        <SurveyMeterKpiCards />
      </section>

      <section aria-label="Survey meter inventory">
        <h2 className="section-heading mb-4">Survey Meter Inventory</h2>
        <SurveyMeterTable
          onView={setViewMeter}
          onEdit={setEditMeter}
          onDelete={setDeleteTarget}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </section>

      <SurveyMeterViewModal
        meter={viewMeter}
        open={Boolean(viewMeter)}
        onClose={() => setViewMeter(null)}
        onPreviewDocument={setPreviewDocument}
        onDownloadDocument={downloadDocument}
      />

      <SurveyMeterFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Survey Meter"
        onSave={(form) => addSurveyMeter(form)}
      />

      <SurveyMeterFormModal
        open={Boolean(editMeter)}
        onClose={() => setEditMeter(null)}
        meter={editMeter}
        title="Edit Survey Meter"
        onSave={(form) => updateSurveyMeter(editMeter.id, form)}
      />

      <DeleteSurveyMeterModal
        meter={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteSurveyMeter}
      />

      <DocumentPreviewModal
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
        title={previewDocument?.fileName}
      />
    </div>
  )
}
