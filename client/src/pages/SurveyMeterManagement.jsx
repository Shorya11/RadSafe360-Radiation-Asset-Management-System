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

export function SurveyMeterManagement() {
  const { surveyMeters, addSurveyMeter, updateSurveyMeter, deleteSurveyMeter } = useSurveyMeters()

  const [viewMeter, setViewMeter] = useState(null)
  const [editMeter, setEditMeter] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Survey Meter Management"
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

      <section aria-label="Survey meter KPIs">
        <SurveyMeterKpiCards />
      </section>

      <section aria-label="Survey meter inventory">
        <h2 className="section-heading mb-4">Survey Meter Inventory</h2>
        <SurveyMeterTable onView={setViewMeter} onEdit={setEditMeter} onDelete={setDeleteTarget} />
      </section>

      <SurveyMeterViewModal
        meter={viewMeter}
        open={Boolean(viewMeter)}
        onClose={() => setViewMeter(null)}
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
    </div>
  )
}
